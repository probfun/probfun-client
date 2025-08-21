<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import Popover from 'primevue/popover'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/store/config.ts'
import type { NodeData } from '@/types/mindmap.ts'

// 定义 props 类型，确保与父组件传递的数据兼容
const props = defineProps<{
  id: string // 节点 ID
  sourcePosition: Position
  targetPosition: Position
  data: NodeData
}>()

const router = useRouter()

const config = useConfigStore()

// 定义公式渲染容器的引用
const mathContainer = ref<HTMLElement | null>(null)

// 渲染 LaTeX 公式
function renderLatex() {
  if (mathContainer.value) {
    katex.render(props.data.label || '', mathContainer.value, {
      throwOnError: false,
    })
  }
}

// Popover 的引用
const op = ref<InstanceType<typeof Popover>>()

// 定时器引用，用于控制延迟隐藏
let hideTimeout: number | null = null

// 显示 Popover
function showPopover(event: MouseEvent) {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  op.value?.show(event)
}

// 隐藏 Popover
function hidePopover() {
  hideTimeout = window.setTimeout(() => {
    op.value?.hide()
  }, 100) // 延迟隐藏 200ms
}

// 取消隐藏
function cancelHidePopover() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

// 在组件挂载和 formula 更新时重新渲染公式
onMounted(renderLatex)
watch(() => props.data.label, renderLatex)

const lightThemeFlag = ref<boolean>(config.theme === 'light')
watch(() => config.theme, (newTheme) => {
  if (newTheme === 'dark') {
    lightThemeFlag.value = false
  }
  else if (newTheme === 'light') {
    lightThemeFlag.value = true
  }
})

const chatting = ref(false)
const chattingKnowledge = ref<string>('')

function chat(knowledge: string) {
  chattingKnowledge.value = knowledge
  chatting.value = true
}
</script>

<template>
  <!-- 节点外层容器 -->
  <div
    class="relative bg-transparent !bg-opacity-75 transition-all hover:scale-[101%] border-[6px] p-3 min-h-10 min-w-48 text-center rounded-3xl shadow flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-[#3B82F6]/40"
    :data-source-position="props.sourcePosition"
    :data-target-position="props.targetPosition"
    :class="{
      'border-[4px]': props.id.length === 6,
      'bg-blue-300': lightThemeFlag,
      'border-gray-300': lightThemeFlag,
      'border-blue-200': !lightThemeFlag,
      // 掌握率颜色控制
      '!bg-[#d50000]': props.id.length === 6 && props.data.masteredRate !== undefined && props.data.masteredRate !== -1 && props.data.masteredRate < 0.5,
      '!bg-[#ff7301]': props.id.length === 6 && props.data.masteredRate !== undefined && props.data.masteredRate >= 0.5 && props.data.masteredRate < 0.75,
      '!bg-[#24d934]': props.id.length === 6 && props.data.masteredRate !== undefined && props.data.masteredRate >= 0.75 && props.data.masteredRate <= 1.01,
      // 其它原有配色...
      '!bg-[#191e59]': props.id.length === 2 && lightThemeFlag,
      '!bg-[#4A51D9]': props.id.length === 4 && lightThemeFlag,
      '!bg-[#8CB5FF]': props.id.length >= 6 && lightThemeFlag,
      '!bg-[#000757]': props.id.length === 2 && !lightThemeFlag,
      '!bg-[#29268c]': props.id.length === 4 && !lightThemeFlag,
      '!bg-[#4D86DB]': props.id.length >= 6 && !lightThemeFlag,
    }"
    :style="!lightThemeFlag ? {
      backgroundColor: '#1e1e2f',
      borderColor: '#3b3b4f',
      color: '#f1f5f9',
    } : undefined"
    @mouseenter="showPopover"
    @mouseleave="hidePopover"
  >
    <!--     左侧输入 Handle -->
    <Handle
      type="target"
      :position="Position.Left"
      class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full w-4 h-4 bg-blue-500 rounded-full"
    />
    <!-- 渲染 LaTeX 公式 -->
    <div class="flex justify-center items-center">
      <!--            <div -->
      <!--              ref="mathContainer" -->
      <!--              class="text-primary text-xl" -->
      <!--              :class="{ -->
      <!--                '!text-2xl': props.id.length === 2, -->
      <!--                '!text-md': props.id.length === 4, -->
      <!--                '!text-sm': props.id.length > 6, -->
      <!--              }" -->
      <!--            /> -->
      <div
        class="w-64 max-h-32 text-primary"
        :class="{
          '!text-2xl': props.id.length === 2,
          '!text-white': props.id.length === 2 || props.id.length === 4 || props.id.length === 6,
          '!text-xl': props.id.length === 4,
          '!text-md': props.id.length >= 6,
        }"
      >
        {{ props.data.label }}
      </div>
    </div>

    <!--     右侧输出 Handle -->
    <Handle
      type="source"
      :position="Position.Right"
      class="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full w-4 h-4 bg-green-500 rounded-full"
    />
  </div>

  <!-- Popover 弹出层 -->
  <Popover
    ref="op"
    class="w-64 text-center rounded-2xl shadow -mt-10"
    style="margin-top: -17px;"
    @mouseenter="cancelHidePopover"
    @mouseleave="hidePopover"
  >
    <div class="flex flex-col items-center gap-2">
      <!-- 提示信息 -->
      <span v-if="props.id.length === 6">掌握程度：{{ props.data.masteredRate === -1 || props.data.masteredRate === undefined ? '暂无数据' : `${(props.data.masteredRate * 100).toFixed(2)}%` }}</span>

      <Button v-if="props.id.length === 6" raised size="small" label="跳转到相关试题" severity="success" @click="router.push({ name: 'ChoiceQuestionBoard', query: { kpId: props.id, content: props.data.label } })" />
      <Button raised size="small" severity="primary" label="对知识点有疑问" @click="" />
    </div>
  </Popover>

  <Dialog v-model:visible="chatting" :modal="false" header="解答疑难" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <Chat :initial-message="chattingKnowledge" type="stream-chat" />
  </Dialog>
</template>
