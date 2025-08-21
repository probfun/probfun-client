<script setup lang="ts">
import {
  type Edge,
  type Node,
  type NodeComponent,
  type NodeMouseEvent,
  type NodeTypesObject,
  VueFlow,
  Panel as VueFlowPanel,
  useVueFlow,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { nextTick, onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import { useToast } from 'primevue/usetoast'
import { MiniMap } from '@vue-flow/minimap'
import LatexNode from '@/components/mindmap/LatexNode.vue'
import { edges, nodes } from '@/data/chapters/mapData1.ts'
import { useLayout } from '@/utils/useLayout.ts'
import { getChapterListApi } from '@/api/chapter/chapterApi.ts'
import type { Chapter } from '@/types/chapter.ts'
import { useConfigStore } from '@/store/config.ts'
import { getChapterKnowledgeMasteryApi } from '@/api/knowledgePoint/knowledgePointApi.ts'

// import default minimap styles
import '@vue-flow/minimap/dist/style.css'
import { getMindMapApi } from '@/api/mindmap/mindmap.ts'

const config = useConfigStore()

const toast = useToast()

const initialNodes = ref<Node[]>(nodes)

const initialEdges = ref<Edge[]>(edges)

const visibleNodes = ref<Node[]>([])

const visibleEdges = ref<Edge[]>([])

// const backgroundColor = ref<string>('#e85353')

const patternColor = ref<string>('#8c8888')
// const { updateNode, fitView } = useVueFlow()
const { fitView, getTransform, setTransform } = useVueFlow()

const { layout } = useLayout()

// 显式定义 nodeTypes 类型
const nodeTypes: NodeTypesObject = {
  latex: LatexNode as unknown as NodeComponent, // 添加类型断言
}

// function logAllNodes() {
//   const nodes: Node[] = getNodes.value
//   console.log('All Nodes:', nodes[0])
// }

// function updateEdgesBySource(sourceNodeId: string) {
//   visibleEdges.value = visibleEdges.value.map((edge) => {
//     if (edge.source === sourceNodeId) {
//       return {
//         ...edge,
//         animated: true,
//       }
//     }
//     return edge
//   })
// }

function onNodeEnter(event: NodeMouseEvent): void {
  const node = event.node // 从事件中获取节点对象
  // console.log('Entered Node ID:', node.id) // 输出被点击节点的 ID
  // if (config.theme === 'dark') {
  //   updateNode(node.id, { ...node, style: { 'background': '#204d49', 'border-radius': '1rem' } })
  // }
  visibleEdges.value = visibleEdges.value.map((edge) => {
    if (edge.source === node.id) {
      return {
        ...edge,
        animated: true,
      }
    }
    return edge
  })
  // updateEdgesBySource(node.id)
}
function onNodeLeave(event: NodeMouseEvent): void {
  const node = event.node // 从事件中获取节点对象
  // console.log('Entered Node ID:', node.id) // 输出被点击节点的 ID
  // if (config.theme === 'dark') {
  //   updateNode(node.id, { ...node, style: { 'background': '#1D232A', 'border-radius': '1rem' } })
  // }
  visibleEdges.value = visibleEdges.value.map((edge) => {
    if (edge.source === node.id) {
      return {
        ...edge,
        animated: false,
      }
    }
    return edge
  })
  // updateEdgesBySource(node.id)
}

async function onNodeDoubleClicked(event: NodeMouseEvent) {
  const node = event.node // 从事件中获取节点对象
  const length = visibleNodes.value.length
  const addedNodes = changeChildVisibility(node.id)[0]
  // console.log(`Nodes Added:${['01', node.id, ...addedNodes]}`)
  await layoutGraph('LR')
  if (length > visibleNodes.value.length) {
    await nextTick(() => {
      // zoomTo(10.0)
      fitView({
        duration: 400, // 500ms 过渡动画
        nodes: [node.id, ...addedNodes],
        padding: 10,
        minZoom: 0.6,
        maxZoom: 1.0,
        // padding: 1.5,
      })
    },
    )
  }
  else if (length === visibleNodes.value.length) {
    const parent = visibleEdges.value.find(edge => edge.target === node.id)?.source
    if (parent) {
      await nextTick(() => {
        // zoomTo(0.2)
        fitView({
          duration: 1000, // 500ms 过渡动画
          nodes: [node.id],
          padding: 10,
          minZoom: 0.6,
          maxZoom: 1.0,
        })
      },
      )
    }
  }
  // else {
  //   await nextTick(() => {
  //     fitView({
  //       duration: 1000, // 500ms 过渡动画
  //       nodes: [...visibleNodes.value.map(node => node.id)],
  //       padding: 10,
  //       minZoom: 0.6,
  //       maxZoom: 1.0,
  //     })
  //   },
  //   )
  // }
  // await nextTick(() => {
  //   fitView({
  //     duration: 500, // 500ms 过渡动画
  //     // padding: 1.5,
  //   })
  // },
  // )
}

function changeChildVisibility(nodeId: string) {
  // 获取初始节点和当前可见节点的值
  const initialNodesValue = initialNodes.value
  const initialEdgesValue = initialEdges.value
  const visibleNodesValue = visibleNodes.value
  const visibleEdgesValue = visibleEdges.value
  // 处理需要加入或移除的节点
  const nodesToAdd: Node[] = []
  const edgesToAdd: Edge[] = []
  const nodesToRemove: Node[] = []
  const edgesToRemove: Edge[] = []

  // 遍历 initialNodes，判断哪些节点需要加入 visibleNodes
  initialNodesValue.forEach((node) => {
    if (node.id.startsWith(nodeId) && node.id !== nodeId) {
      // 节点不在 visibleNodes 中且符合条件，加入 nodesToAdd
      if (node.id.length === nodeId.length + 2 && !visibleNodesValue.some(vNode => vNode.id === node.id)) {
        nodesToAdd.push(node)
        initialEdgesValue.forEach((edge) => {
          if (edge.target === node.id)
            edgesToAdd.push(edge)
        })
      }
      else if (visibleNodesValue.some(vNode => vNode.id === node.id)) {
        // 节点已经在 visibleNodes 中且符合条件，加入 nodesToRemove
        nodesToRemove.push(node)
        initialEdgesValue.forEach((edge) => {
          if (edge.target === node.id)
            edgesToRemove.push(edge)
        })
      }
    }
  })

  // 将需要加入的节点加入 visibleNodes
  visibleNodesValue.push(...nodesToAdd)
  visibleEdgesValue.push(...edgesToAdd)
  // 将需要移除的节点从 visibleNodes 中移除
  nodesToRemove.forEach((nodeToRemove) => {
    const nodeIndex = visibleNodesValue.findIndex(vNode => vNode.id === nodeToRemove.id)
    const edgeIndex = visibleEdgesValue.findIndex(vEdge => vEdge.target === nodeToRemove.id)
    if (nodeIndex !== -1) {
      visibleNodesValue.splice(nodeIndex, 1)
      visibleEdgesValue.splice(edgeIndex, 1)
    }
  })

  // 更新响应式数据
  visibleNodes.value = [...visibleNodesValue] // 触发 Vue 响应式更新
  visibleEdges.value = [...(visibleEdgesValue.map((edge) => {
    return {
      ...edge,
      animated: false,
    }
  }))]
  return [nodesToAdd.map(node => node.id), edgesToAdd.map(edge => edge.id)]
}

async function layoutGraph(direction: 'LR' | 'TB') {
  visibleNodes.value = visibleNodes.value.filter((node) => {
    return node.id.length <= 6
  })
  visibleEdges.value = visibleEdges.value.filter((edge) => {
    return edge.target.length <= 6
  })
  visibleNodes.value = layout(visibleNodes.value, visibleEdges.value, direction)
  visibleEdges.value = [...visibleEdges.value]
}

const chapterList = ref<Chapter[]>([])
// const currentChapter = ref<string>('')

async function getChapters() {
  try {
    const response = await getChapterListApi()
    chapterList.value = response.data.chapterList
    chapterList.value = chapterList.value.filter(item => item.name !== 'test')
  }
  catch (error) {
    toast.add({ severity: 'error', summary: '获取章节列表失败', detail: error, life: 3000 })
  }
  // console.log(chapterList.value)
}

// const chapterModule = ref()

const masteryList = ref<{
  kpId: string
  content: string
  description?: string
  masteredRate: number
}[]>([])

async function getChapterKnowledgeMastery(chapterId: string) {
  try {
    const response = await getChapterKnowledgeMasteryApi(chapterId)
    masteryList.value = response.data.masteredList
    // console.log(masteryList.value)
  }
  catch (error) {
    toast.add({ severity: 'error', summary: '获取知识点掌握情况失败', detail: error, life: 3000 })
  }
}

const currentChapter = ref<Chapter>()

async function changeChapter(id: string) {
  if (id === '1') {
    initialEdges.value = edges
    initialNodes.value = nodes
  }
  try {
    await getMapData(id)
  }
  catch (error) {
    toast.add({ severity: 'error', summary: '获取章节思维导图失败', detail: error, life: 3000 })
  }
  await getChapterKnowledgeMastery(id)
  initialNodes.value = initialNodes.value.map((node) => {
    // 查找 masteredList 中是否有匹配的 kpId
    const matchedMastery = masteryList.value.find(
      mastery => mastery.kpId === node.id,
    )

    // 如果找到匹配的 kpId，则更新 data
    if (matchedMastery) {
      return {
        ...node, // 保留原有属性
        data: {
          ...node.data, // 保留原有 data
          masteredRate: matchedMastery.masteredRate, // 添加 masteredRate
        },
      }
    }
    else {
      return {
        ...node, // 保留原有属性
        data: {
          ...node.data, // 保留原有 data
          masteredRate: -1, // 添加 masteredRate
        },
      }
    }
  })
  visibleNodes.value = [...initialNodes.value.filter(node => node.id.length <= 6)]
  visibleEdges.value = [...initialEdges.value.filter(edge => edge.target.length <= 6)]
  console.log(initialNodes.value)
  await layoutGraph('LR')

  await nextTick(() => {
    fitView({
      duration: 1000,
      padding: 10,
      minZoom: 0.6,
      maxZoom: 1.0,
    })
  },
  )
}

async function getMapData(chapterId: string) {
  try {
    const response = await getMindMapApi(chapterId)
    initialNodes.value = response.data.nodes
    initialEdges.value = response.data.edges
    console.log(response.data.nodes)
  }
  catch (error) {
    toast.add({ severity: 'error', life: 3000, summary: '请求失败', detail: '获取思维导图失败' })
    console.log(error)
  }
}

onMounted(async () => {
  await getChapters()
  await getMapData('1')
  await changeChapter('1')
  currentChapter.value = chapterList.value[0]
})
</script>

<template>
  <div class="w-full h-full"
    :class="{ 'bg-[#1D232A]': config.theme === 'dark', 'bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] shadow-lg': config.theme === 'light' }">
    <div class="w-full h-full p-4 flex gap-10">
      <Panel class="min-w-64 max-h-full overflow-auto rounded-lg shadow bg-white dark:bg-black border-none">
        <template #header>
          <div class="text-center font-semibold text-base text-black dark:text-white">
            章节选择
          </div>
        </template>

        <div class="flex flex-col gap-2 px-2 py-2">
          <div v-for="chapter in chapterList" :key="chapter.id" v-ripple
            class="cursor-pointer p-2 rounded-md transition-all duration-200 select-none text-sm font-medium" :class="[
              currentChapter?.id === chapter.id
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                : 'hover:bg-blue-50 dark:hover:bg-[#353a45] text-black dark:text-white',
            ]" @click="async () => {
              await changeChapter(chapter.id)
              currentChapter = chapter
              await nextTick(() => {
                fitView({
                  duration: 1000,
                  padding: 10,
                  minZoom: 1.0,
                })
              },
              )
            }">
            {{ chapter.name }}
          </div>
        </div>
      </Panel>
      <div class="w-full flex flex-col items-center justify-center">
        <!--        <div class="w-full text-primary font-bold p-3"> -->
        <!--          {{ currentChapter?.name }} -->
        <!--        </div> -->
        <VueFlow :nodes="visibleNodes" :edges="visibleEdges" :node-types="nodeTypes"
          class="w-full h-full max-h-[95%] border-2 rounded-xl m-3" :mastered-list="masteryList"
          @node-mouse-enter="onNodeEnter" @node-mouse-leave="onNodeLeave" @node-double-click="onNodeDoubleClicked"
          @nodes-initialized="layoutGraph('LR')">
          <MiniMap pannable zoomable class="!bg-black !bg-rounded-xl !border-2" />
          <Background :size="3" :gap="24" variant="dots" :pattern-color="patternColor" />
          <VueFlowPanel position="top-left">
            <div class="w-64 h-16 flex items-center justify-center rounded-xl">
              <span class="text-xl text-black dark:text-white">双击节点以展开/收缩子节点</span>
            </div>
          </VueFlowPanel>
          <VueFlowPanel position="top-right">
            <div class="w-64 h-16 flex items-center justify-center rounded-xl gap-2">
              <span class="text-xl text-black dark:text-white">点击调整视图</span>
              <div class="p-2 bg-green-400 rounded-full cursor-pointer" @click="async () => {
                await nextTick(() => {
                  fitView({
                    duration: 500, // 过渡动画
                    // nodes: [...visibleNodes.value.map(node => node.id)],
                    padding: 10,
                    minZoom: 1.0,
                  })
                })
              }">
                <span class="text-primary pi pi-refresh" />
              </div>
            </div>
          </VueFlowPanel>
          <Controls position="top-right" />
        </VueFlow>
        <!--        <div class="w-full flex-1 justify-end"> -->
        <!--          <Legend /> -->
        <!--        </div> -->
      </div>
    </div>
  </div>
</template>