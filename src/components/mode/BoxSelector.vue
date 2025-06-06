<script setup lang="ts">
import { Dice3, Infinity, MoveUpRight } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue'

type FaceType = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom'

const emit = defineEmits<{
  (e: 'colorChange', color: string): void
}>()
const rotateX = ref(-25)
const rotateY = ref(-25)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const showDetail = ref(false)
const isExpanded = ref(false)
const expandTransition = ref(false)
const skipTransition = ref(false)
const isAnimating = ref(false)

// 保存展开前的旋转状态
const preExpandRotateX = ref(0)
const preExpandRotateY = ref(0)

// 展开后的位置配置
const expandedPositions = {
  front: { x: 80, y: -160, z: 0 },
  right: { x: 450, y: -160, z: 0 },
  left: { x: 265, y: 190, z: 0 },
}

// 添加面到角度的映射
const faceToAngle = {
  front: { x: -25, y: -25 },
  right: { x: -25, y: -115 },
  left: { x: -25, y: 65 },
  back: { x: -25, y: 155 },
  top: { x: 65, y: -25 },
  bottom: { x: -115, y: -25 },
}

// 归一化角度到 -180 到 180 度之间
function normalizeAngle(angle: number): number {
  angle = angle % 360
  return angle > 180 ? angle - 360 : angle < -180 ? angle + 360 : angle
}

// 计算展开时的过渡transform
const expandedTransform = computed(() => {
  if (!expandTransition.value) {
    return ''
  }
  const progress = isExpanded.value ? 1 : 0
  const startX = preExpandRotateX.value
  const startY = preExpandRotateY.value
  const currentX = startX * (1 - progress)
  const currentY = startY * (1 - progress)
  return `rotateX(${currentX}deg) rotateY(${currentY}deg)`
})

// 计算当前朝前的面
const currentFace = computed<FaceType>(() => {
  const y = (rotateY.value % 360)
  if (y === -25 || y === 335) {
    return 'front'
  }
  if (y === 65 || y === -295) {
    return 'left'
  }
  if (y === 155 || y === -205) {
    return 'back'
  }
  if (y === -115 || y === 245) {
    return 'right'
  }
  return 'top'
})

// 用于生成transform样式的函数
function getExpandedTransform(position: { x: number, y: number, z: number }) {
  return `translateX(${position.x}px) translateY(${position.y}px) translateZ(${position.z}px) rotateY(0deg)`
}

// 颜色映射
const faceColors = {
  front: 'rgb(36, 96, 226)', // 邮趣概率
  right: 'rgb(34, 168, 109)', // 邮趣高数
  left: 'rgb(142, 68, 173)', // 邮趣线代
  back: 'rgb(243, 156, 18)', // 敬请期待
  top: 'rgb(189, 195, 199)',
  bottom: 'rgb(44, 62, 80)',
}

// 监听当前面的变化并发出颜色改变事件
watch(currentFace, (newFace) => {
  emit('colorChange', faceColors[newFace])
})

// 修改 handleMouseDown、handleMouseUp 只用于拖动切换面
function handleMouseDown(e: MouseEvent) {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
}

function handleMouseUp(e: MouseEvent) {
  if (!isDragging.value)
    return
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value
  const threshold = 50
  if (!isExpanded.value && (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold)) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 判断是否倒置
      const absX = Math.abs((rotateX.value % 360 + 360) % 360)
      const isUpsideDown = absX > 90 && absX < 270
      if (isUpsideDown) {
        // 倒置时，左右方向反转
        if (deltaX > 0) {
          rotateY.value -= 90
        }
        else {
          rotateY.value += 90
        }
      }
      else {
        if (deltaX > 0) {
          rotateY.value += 90
        }
        else {
          rotateY.value -= 90
        }
      }
    }
    else {
      if (deltaY > 0) {
        rotateX.value -= 90
      }
      else {
        rotateX.value += 90
      }
    }
    emit('colorChange', faceColors[currentFace.value])
  }
  isDragging.value = false
}

// 2. 双击用于展开/收起立方体（原来长按的逻辑）
function handleDoubleClick() {
  if (isAnimating.value)
    return
  if (isExpanded.value) {
    // 收起
    isExpanded.value = false
    showDetail.value = false
    setTimeout(() => {
      expandTransition.value = false
    }, 300)
  }
  else {
    // 展开
    skipTransition.value = true
    rotateX.value = normalizeAngle(rotateX.value)
    rotateY.value = normalizeAngle(rotateY.value)
    requestAnimationFrame(() => {
      skipTransition.value = false
      preExpandRotateX.value = rotateX.value
      preExpandRotateY.value = rotateY.value
      requestAnimationFrame(() => {
        isAnimating.value = true
        expandTransition.value = true
        isExpanded.value = true
        showDetail.value = true
        setTimeout(() => {
          isAnimating.value = false
        }, 800)
      })
    })
  }
}

function handleMouseLeave() {
  isDragging.value = false
}

function handleClose() {
  isExpanded.value = false
  showDetail.value = false
  setTimeout(() => {
    expandTransition.value = false
  }, 300)
}

// 处理展开状态下的点击
function handleFaceClick(face: FaceType) {
  if (!isExpanded.value || isAnimating.value)
    return
  // 开始收缩动画
  isAnimating.value = true
  handleClose()
  // 设置旋转角度
  const targetAngle = faceToAngle[face]
  rotateX.value = targetAngle.x
  rotateY.value = targetAngle.y
  // 发出颜色改变事件
  emit('colorChange', faceColors[face])
  // 动画结束后重置状态
  setTimeout(() => {
    isAnimating.value = false
  }, 800)
}

// 初始化时恢复旋转角度
const savedX = localStorage.getItem('cube-rotate-x')
const savedY = localStorage.getItem('cube-rotate-y')
if (savedX !== null && savedY !== null) {
  rotateX.value = Number(savedX)
  rotateY.value = Number(savedY)
}

// 拖动或旋转后保存
watch([rotateX, rotateY], ([x, y]) => {
  localStorage.setItem('cube-rotate-x', String(x))
  localStorage.setItem('cube-rotate-y', String(y))
})
</script>

<template>
  <div
    class="scene"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @dblclick="handleDoubleClick"
  >
    <div
      class="cube"
      :class="{
        'expanded': isExpanded,
        'transitioning': expandTransition,
        'skip-transition': skipTransition,
      }"
      :style="{
        transform: expandTransition ? expandedTransform : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }"
    >
      <!-- front -->
      <div
        class="cube-face front"
        :class="{ 'show-detail': showDetail && (currentFace === 'front' || isExpanded) }"
        @click="handleFaceClick('front')"
      >
        <span class="face-title">
          <Dice3 class="face-icon" />
          <span>邮趣概率</span>
        </span>
        <div v-if="showDetail && (currentFace === 'front' || isExpanded)" class="detail">
          <h3>邮趣概率</h3>
          <p>探索不确定世界的规律</p>
          <p>适合喜欢逻辑和建模的你</p>
        </div>
      </div>
      <!-- right -->
      <div
        class="cube-face right"
        :class="{ 'show-detail': showDetail && (currentFace === 'right' || isExpanded) }"
        @click="handleFaceClick('right')"
      >
        <span class="face-title">
          <Infinity class="face-icon" />
          <span>邮趣高数</span>
        </span>
        <div v-if="showDetail && (currentFace === 'right' || isExpanded)" class="detail">
          <h3>高等数学</h3>
          <p>微积分，函数与极限的艺术</p>
          <p>适合喜欢挑战和推理的你</p>
        </div>
      </div>
      <!-- left -->
      <div
        class="cube-face left"
        :class="{ 'show-detail': showDetail && (currentFace === 'left' || isExpanded) }"
        @click="handleFaceClick('left')"
      >
        <span class="face-title">
          <MoveUpRight class="face-icon" />
          <span>邮趣线代</span>
        </span>
        <div v-if="showDetail && (currentFace === 'left' || isExpanded)" class="detail">
          <h3>线性代数</h3>
          <p>空间与向量的语言</p>
          <p>适合喜欢抽象思维和结构分析的你</p>
        </div>
      </div>
      <!-- top -->
      <div
        class="cube-face top"
        @click="handleFaceClick('top')"
      >
        <span class="simple">WXZZZ</span>
      </div>
      <!-- back -->
      <div
        class="cube-face back"
        @click="handleFaceClick('back')"
      >
        <span class="simple">敬请期待</span>
      </div>
      <!-- bottom -->
      <div
        class="cube-face bottom"
        @click="handleFaceClick('bottom')"
      />
    </div>
  </div>
</template>

<style scoped>
.scene {
  perspective: 1200px;
  width: 800px;
  height: 250px;
  margin: 100px auto;
  cursor: grab;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scene:active {
  cursor: grabbing;
}

.cube {
  width: 250px;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
}

.cube.transitioning {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.cube.expanded {
  width: 800px;
}

.cube.expanded .front {
  transform: v-bind('getExpandedTransform(expandedPositions.front)');
  opacity: 1;
}

.cube.expanded .right {
  transform: v-bind('getExpandedTransform(expandedPositions.right)');
  opacity: 1;
}

.cube.expanded .left {
  transform: v-bind('getExpandedTransform(expandedPositions.left)');
  opacity: 1;
}

.cube.expanded .top {
  transform: translateY(-200px) rotateX(90deg) scale(0.5);
  opacity: 0;
  pointer-events: none;
}

.cube.expanded .back {
  transform: translateZ(-200px) rotateY(180deg) scale(0.5);
  opacity: 0;
  pointer-events: none;
}

.cube.expanded .bottom {
  transform: translateY(200px) rotateX(-90deg) scale(0.5);
  opacity: 0;
  pointer-events: none;
}

.cube-face {
  position: absolute;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  user-select: none;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  backface-visibility: visible;
  border: 7px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.front {
  transform: translateZ(125px);
  background: rgba(36, 96, 226, 0.85); /* 蓝色 - 邮趣概率 */
}

.back {
  transform: translateZ(-125px) rotateY(180deg);
  background: rgba(243, 156, 18, 0.85);
}

.right {
  transform: translateX(125px) rotateY(90deg);
  background: rgba(34, 168, 109, 0.85); /* 绿色 - 邮趣高数 */
}

.left {
  transform: translateX(-125px) rotateY(-90deg);
  background: rgba(142, 68, 173, 0.85);
}

.top {
  transform: translateY(-125px) rotateX(90deg);
  background: rgba(189, 195, 199, 0.85);
}

.bottom {
  transform: translateY(125px) rotateX(-90deg);
  background: rgba(44, 62, 80, 0.85);
}

.simple {
  font-size: 2em;
  transition: opacity 0.3s;
  font-weight: bold;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.show-detail .simple {
  opacity: 0;
}

.detail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
}

.detail h3 {
  font-size: 1.8em;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.detail p {
  font-size: 1.2em;
  margin: 8px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.cube.skip-transition {
  transition: none !important;
}

.face-title {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: center;
  justify-content: center;
  gap: 0.3em;
  font-size: 2em;
  font-weight: bold;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s;
}

.show-detail .face-title {
  opacity: 0;
  pointer-events: none;
}

.face-icon {
  font-size: 2em;
  width: 1.5em;
  height: 1.5em;
  margin: 0;
  vertical-align: middle;
  display: inline-block;
}

.cube-face .face-title span {
  font-size: 1em;
  vertical-align: middle;
}
</style>
