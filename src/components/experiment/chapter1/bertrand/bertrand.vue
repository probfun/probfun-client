<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ThreeDoorsDisplay from '@/components/experiment/chapter1/three-doors/ThreeDoorsDisplay.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toMarkdown } from '@/utils/markdown';
import { GraduationCap, Lightbulb, MessagesSquare } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';



const selectedStrategy = ref<'random' | 'middle' | 'diameter'>('random');  // 用户选择的实验策略
const circleData = ref<any[]>([]);  // 用来存储弦数据
const simulateGame = ref(false);  // 是否开始模拟
// const simulateGame = ref<boolean>(false);


const bertrandDisplay = ref<any>(null);  // 用于贝特朗悖论展示的引用

// 计算弦长度的函数
function calculateChordLength(x: number, y: number, strategy: string): number {
  let length = 0;
  if (strategy === 'random') {
    length = Math.sqrt(x * x + y * y);
  } else if (strategy === 'middle') {
    // 示例: 随机选择弦的中点（待根据实际情况完善）
    length = Math.random() * 2;
  } else if (strategy === 'diameter') {
    // 示例: 随机选择一个直径，垂直于该直径的弦（待根据实际情况完善）
    length = Math.random() * 2;
  }
  return length;
}

// 动态更新弦的数据
function updateCircles() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2 - 1;  // x 坐标在 -1 和 1 之间
    const y = Math.random() * 2 - 1;  // y 坐标在 -1 和 1 之间
    const length = calculateChordLength(x, y, selectedStrategy.value);
    const color = length > Math.sqrt(3) ? 'red' : 'blue';  // 判断弦的颜色
    data.push({ x, y, length, color });
  }
  circleData.value = data;
}

// 模拟按钮点击
function toggleSimulation() {
  simulateGame.value = !simulateGame.value;
  if (simulateGame.value) {
    updateCircles();
  }
}

onMounted(() => {
  // 初始化数据
  updateCircles();
});


const discussTabList = [

  {
    id: 0,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,
  },
  {
    id: 1,
    label: '相关讨论',
    name: 'discuss',
    icon: Lightbulb,
  },
  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
];
</script>

<template>
  <ExperimentBoard :discuss-tab-list="discussTabList">
    <template #experiment>

      <!-- 三个单位圆展示 -->
      <div class="circles-container  grid grid-cols-3  ">
        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <g v-for="(chord, index) in circleData" :key="index">
              <!-- <line :x1="100" :y1="100" :x2="100 + chord.x * 100" :y2="100 + chord.y * 100" :stroke="chord.color" stroke-width="2" /> -->
            </g>
          </svg>
          <div class="circle-label">random endpoints</div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <g v-for="(chord, index) in circleData" :key="index">
              <!-- <line :x1="100" :y1="100" :x2="100 + chord.x * 100" :y2="100 + chord.y * 100" :stroke="chord.color"
                    stroke-width="2" /> -->
            </g>
          </svg>
          <div class="circle-label">radial midpoint</div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 180 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <g v-for="(chord, index) in circleData" :key="index">
              <!-- <line :x1="100" :y1="100" :x2="100 + chord.x * 100" :y2="100 + chord.y * 100" :stroke="chord.color"
                    stroke-width="2" /> -->
            </g>
          </svg>
          <div class="circle-label ">random midpoint</div>
        </div>
      </div>

      <!-- 模拟控制 -->
      <div class="controls absolute left-1/2 -translate-x-1/2 mt-2">
        <Button @click="toggleSimulation">
          {{ simulateGame.value ? '停止模拟' : '开始模拟' }}
        </Button>

      </div>


    </template>
    <template #parameter>
      <div v-if="bertrandDisplay" class="p-2 grid grid-cols-2 w-full h-full gap-2">
        <div class="flex flex-col gap-2">
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                模拟轮数
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center p-4 pt-0 flex-1">
              <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                <Input v-model="bertrandDisplay.autoGameRound[0]" class="" :min="1" :max="500" />
                <Slider v-model="bertrandDisplay.autoGameRound" class="" />
              </div>
              <div class="flex justify-center gap-2 w-full">
                <Button class="" @click="() => {
                  if (bertrandDisplay === null)
                    return;
                  bertrandDisplay.autoGaming ? bertrandDisplay.autoGaming = false : bertrandDisplay.simulateGame();
                }">
                  {{ bertrandDisplay.autoGaming ? '终止模拟' : '开始模拟' }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card class="flex-1">
            <CardHeader class="p-4">
              <CardTitle>
                实验结果
              </CardTitle>
            </CardHeader>
            <CardContent class="flex items-center flex-col">

            </CardContent>
          </Card>
        </div>
        <Card class="h-full flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>
              实验结果
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-1 flex-col  items-center justify-center">

            <Button class="mt-3" @click="bertrandDisplay.resetData">
              重置数据
            </Button>
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <!-- <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)" /> -->
      </div>
    </template>




    <template #comment>
      <CommentPanel exp-id="bertrand" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.circle-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  flex-direction: column;
  /* 文字在圆圈下方 */
  gap: 1px;
  /* 圆圈与文字之间的间距 */
  margin-top: 20px;
}

.circle {
  position: relative;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  width: 200px;
  height: 200px;
  left:100px;
}

.circle-label {
  position: absolute;
  /* 文字绝对定位 */
  bottom: 0px;
  /* 调整文字位置，确保它在圆圈下方 */
  text-align: center;
  /* 文字水平居中 */
  font-size: 14px;
  /* 可根据需要调整字体大小 */
  font-weight: bold;
  /* 可选：加粗字体 */

}

/* button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
} */
</style>
