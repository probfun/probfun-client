<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';
import type { ReceiveData } from '@/api/ai/aiType.ts';
import type { Chat } from '@/api/do-question/doQuestion';
import { layout as dagreLayout, graphlib } from '@dagrejs/dagre';
import { vAutoAnimate } from '@formkit/auto-animate';
import { Icon } from '@iconify/vue';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { Handle, MarkerType, Position, useVueFlow, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { aiApi } from '@/api/ai/aiApi';
import { ReceiveDataType } from '@/api/ai/aiType.ts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils.ts';
import MindmapAiSidebar from './MindmapAiSidebar.vue';
// import { useUserStore } from '@/store';

type Level = 1 | 2 | 3;
export interface MindNodeData {
  label: string;
  level: Level;
  [k: string]: any;
}

const props = defineProps<{
  nodes: Node<MindNodeData>[];
  edges: Edge<any>[];
}>();

const router = useRouter();
const orientation = ref<'LR' | 'TB'>('LR');
const openId = ref<string | null>(null);
// const userStore = useUserStore();

// AI侧边栏状态
const showAiSidebar = ref(false);
const currentKnowledgePoint = ref('');

const aiMessages = ref<Chat[]>([]);
const aiThinking = ref(false);
const aiState = ref<'idle' | 'thinking' | 'error'>('idle');
const abortController = ref<AbortController | null>(null);

const levelClasses: Record<Level, string> = {
  1: 'bg-emerald-50 border-emerald-400 text-emerald-900 text-lg',
  2: 'bg-sky-50 border-sky-400 text-sky-900 text-base',
  3: 'bg-amber-50 border-amber-400 text-amber-900 text-sm',
};

function _initAiConnection() {
  const requestData: any = {
    messages: [],
  };

  aiApi(
    requestData,
    () => {
      console.log('AI连接已建立');
    },
    (data) => {
      // onReceive回调
      console.log('data:', data);
      if (data) {
        processReceiveData(data);
      }
    },
    () => {
      // onFinish回调
      aiThinking.value = false;
      aiState.value = 'idle';
    },
    null, // abortController
  );
}

// 处理流式消息，按照 aiApi.ts 的处理方式
function processReceiveData(data: ReceiveData) {
  const lastMessage = aiMessages.value[aiMessages.value.length - 1] as Chat;

  switch (data.type) {
    case ReceiveDataType.TEXT: {
      if (lastMessage && lastMessage.role === 'assistant' && data.content) {
        lastMessage.content += data.content;
        lastMessage.hasReceivedText = true;
      }
      break;
    }
    case ReceiveDataType.TOOL: {
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.isUsingTool = true;
      }
      break;
    }
    case ReceiveDataType.ERROR: {
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.status = 'error';
        lastMessage.content += `\n\n[错误] ${data.content}`;
      }
      aiState.value = 'error';
      break;
    }
    default: {
      break;
    }
  }
}

async function sendMessage(content?: string, skipUserMessage = false) {
  if (!content || aiState.value === 'thinking')
    return;

  if (abortController.value) {
    abortController.value.abort();
  }

  const controller = new AbortController();
  abortController.value = controller;

  try {
    aiState.value = 'thinking';

    if (!skipUserMessage) {
      const userMessage: Chat = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      aiMessages.value.push(userMessage);
    }

    const aiMessage: Chat = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      status: 'streaming',
      hasReceivedText: false,
      isUsingTool: false,
    };
    aiMessages.value.push(aiMessage);

    const messageContent = !content.includes(`我正在学习"${currentKnowledgePoint.value}"这个知识点`)
      ? `我正在学习"${currentKnowledgePoint.value}"这个知识点，${content}`
      : content;

    const requestData: any = {
      messages: [{ role: 'user' as const, content: messageContent }],
    };

    await aiApi(
      requestData,
      () => {
        console.log('AI连接已建立，开始发送消息');
      },
      processReceiveData,
      () => {
        console.log('AI连接关闭');
        const lastMessage = aiMessages.value[aiMessages.value.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.status = 'completed';
        }
        aiState.value = 'idle';
      },
      controller,
    );
  }
  catch (error) {
    console.error('发送消息失败:', error);
    aiState.value = 'error';
  }
  finally {
    abortController.value = null;
  }
}

async function quickAsk(content: string) {
  if (aiState.value === 'thinking')
    return;

  if (abortController.value) {
    abortController.value.abort();
  }

  const controller = new AbortController();
  abortController.value = controller;

  try {
    aiState.value = 'thinking';

    const userMessage: Chat = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    aiMessages.value.push(userMessage);

    const aiMessage: Chat = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      status: 'streaming',
      hasReceivedText: false,
      isUsingTool: false,
    };
    aiMessages.value.push(aiMessage);

    const requestData: any = {
      messages: [{ role: 'user' as const, content }],
    };

    await aiApi(
      requestData,
      () => {
        console.log('AI连接已建立，开始发送快速提问');
      },
      processReceiveData,
      () => {
        console.log('AI连接关闭');
        const lastMessage = aiMessages.value[aiMessages.value.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.status = 'completed';
        }
        aiState.value = 'idle';
      },
      controller,
    );
  }
  catch (error) {
    console.error('快速提问失败:', error);
    aiState.value = 'error';
  }
  finally {
    abortController.value = null;
  }
}

function _clearChat() {
  if (aiState.value === 'thinking')
    return;

  aiMessages.value = [];
  aiState.value = 'idle';
}

function stopGenerating() {
  if (aiState.value === 'thinking') {
    aiState.value = 'idle';
    aiThinking.value = false;
    abortController.value?.abort();
    abortController.value = null;
  }
}

function retryFrom(content: string) {
  if (aiState.value === 'thinking')
    return;

  // 移除最后一条AI消息
  if (aiMessages.value.length > 0 && aiMessages.value[aiMessages.value.length - 1].role === 'ai') {
    aiMessages.value.pop();
  }

  // 重新发送消息
  sendMessage(content);
}

function openAiSidebar(knowledgePoint: string) {
  currentKnowledgePoint.value = knowledgePoint;
  showAiSidebar.value = true;

  aiMessages.value = [];

  const firstMessage = `请给我讲讲"${knowledgePoint}"这个知识点`;

  sendMessage(firstMessage, true);
}

// 动态计算布局参数
function getDynamicLayoutParams() {
  const baseParams = {
    ranksep: showAiSidebar.value ? 72 : 96,
    nodesep: showAiSidebar.value ? 40 : 56,
    edgesep: 8,
    marginx: 16,
    marginy: 16,
  };

  // 根据布局方向进一步调整
  if (orientation.value === 'TB') {
    // 上下布局时，有侧边栏需要更紧凑的参数
    return {
      ...baseParams,
      ranksep: showAiSidebar.value ? 56 : 72,
      nodesep: showAiSidebar.value ? 32 : 48,
    };
  }

  return baseParams;
}

const baseSize = { width: 240, height: 36 };

// dagre 自动排版
function layoutGraph(nodes: Node<MindNodeData>[], edges: Edge<any>[]) {
  const g = new graphlib.Graph();
  const layoutParams = getDynamicLayoutParams();

  g.setGraph({
    rankdir: orientation.value, // LR: 左→右, TB: 上→下
    ...layoutParams,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    const w = (n as any).style?.width ?? baseSize.width;
    const h = (n as any).style?.height ?? baseSize.height;
    g.setNode(n.id, { width: Number(w), height: Number(h) });
  });

  edges.forEach(e => g.setEdge(e.source, e.target));

  dagreLayout(g);

  const srcPos = orientation.value === 'LR' ? Position.Right : Position.Bottom;
  const tgtPos = orientation.value === 'LR' ? Position.Left : Position.Top;

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const dynamicSize = baseSize;
    const width = pos?.width ?? dynamicSize.width;
    const height = pos?.height ?? dynamicSize.height;

    return {
      ...n,
      type: 'mind',
      sourcePosition: srcPos,
      targetPosition: tgtPos,
      position: pos
        ? { x: pos.x - width / 2, y: pos.y - height / 2 }
        : n.position ?? { x: 0, y: 0 },
    } as Node<MindNodeData>;
  });
}

const { fitView, updateNode } = useVueFlow();

function openPanel(id: string) {
  if (openId.value && openId.value !== id) {
    updateNode(openId.value, (n: any) => ({ ...n, zIndex: undefined }));
  }
  openId.value = id;
  updateNode(id, (n: any) => ({ ...n, zIndex: 2000 }));
}

function closePanel(id: string) {
  if (openId.value === id)
    openId.value = null;
  updateNode(id, (n: any) => ({ ...n, zIndex: undefined }));
}

const layoutedNodes = computed(() => layoutGraph(props.nodes, props.edges));

watch(
  () => orientation.value,
  async () => {
    await nextTick();
    await fitView({ padding: 0.1, duration: 500 });
  },
);

watch(
  () => [props.nodes, props.edges],
  async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await fitView({ padding: 0.1, duration: 500 });
  },
  { deep: true },
);

// 监听AI侧边栏状态变化，动态调整布局
watch(
  () => showAiSidebar.value,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // 等待DOM更新完成
      await nextTick();
      // 延迟一点时间让动画完成，然后重新布局
      setTimeout(async () => {
        // 重新计算布局
        const newLayoutedNodes = layoutGraph(props.nodes, props.edges);
        // 更新节点位置
        newLayoutedNodes.forEach((node) => {
          updateNode(node.id, (n: any) => ({
            ...n,
            position: node.position,
          }));
        });
        // 重新适应视图
        await fitView({ padding: 0.15, duration: 600 });
      }, 300);
    }
  },
);

onMounted(() => {
  // 组件挂载时的逻辑
  // 根据初始状态调整布局
  nextTick(() => {
    setTimeout(async () => {
      if (showAiSidebar.value) {
        // 如果初始就有侧边栏，使用更紧凑的布局
        const newLayoutedNodes = layoutGraph(props.nodes, props.edges);
        newLayoutedNodes.forEach((node) => {
          updateNode(node.id, (n: any) => ({
            ...n,
            position: node.position,
          }));
        });
        await fitView({ padding: 0.15, duration: 300 });
      }
    }, 100);
  });
});
</script>

<template>
  <div
    v-auto-animate
    class="w-full h-full flex gap-2"
    :class="{
      'grid grid-cols-[3fr_2fr]': showAiSidebar,
    }"
  >
    <!-- 思维导图容器 - 独立的最外层边框 -->
    <div
      v-auto-animate
      class="rounded-xl border bg-white shadow-sm flex flex-col overflow-hidden"
      :class="{
        'flex-1': !showAiSidebar,
      }"
    >
      <!-- 顶部工具条 -->
      <div class="flex items-center gap-2 p-2 border-b bg-white">
        <span class="text-sm text-gray-500">布局方向：</span>
        <div class="inline-flex rounded-xl border overflow-hidden">
          <button
            class="px-3 py-1 text-sm hover:bg-gray-50"
            :class="orientation === 'LR' ? 'bg-gray-100 font-medium' : ''"
            @click="orientation = 'LR'"
          >
            左右
          </button>
          <button
            class="px-3 py-1 text-sm hover:bg-gray-50 border-l"
            :class="orientation === 'TB' ? 'bg-gray-100 font-medium' : ''"
            @click="orientation = 'TB'"
          >
            上下
          </button>
        </div>

        <!-- AI辅导侧边栏开关 -->
        <Button
          variant="outline"
          size="sm"
          class="ml-auto transition-all pl-0"
          @click="showAiSidebar = !showAiSidebar"
        >
          <Icon :icon="showAiSidebar ? 'lucide:chevron-right' : 'lucide:chevron-left'" class="mr-1" />
          {{ showAiSidebar ? '收起AI辅导' : '展开AI辅导' }}
        </Button>
      </div>

      <!-- 思维导图区域 -->
      <div class="flex-1">
        <VueFlow
          :nodes="layoutedNodes"
          :edges="edges"
          :default-edge-options="{ type: 'smoothstep', markerEnd: MarkerType.ArrowClosed }"
          :fit-view-on-init="true"
          :nodes-draggable="false"
          :min-zoom="0.1"
          :max-zoom="2"
          :default-zoom="1"
        >
          <template #node-mind="{ id, data, targetPosition, sourcePosition }">
            <div
              class="select-none"
              @mouseenter="openPanel(id)"
              @mouseleave="closePanel(id)"
            >
              <div
                class="transition-all group relative rounded-2xl border shadow-sm px-3 py-2 md:px-4 md:py-3 min-w-[160px] md:min-w-[200px] hover:shadow-md hover:-translate-y-0.5 pointer-events-auto"
                :class="cn(levelClasses[(data?.level ?? 1) as 1 | 2 | 3], (orientation === 'TB' && 'max-w-48 md:max-w-60'))"
              >
                <Handle id="t" type="target" :position="targetPosition ?? (orientation === 'LR' ? Position.Left : Position.Top)" />
                <Handle id="s" type="source" :position="sourcePosition ?? (orientation === 'LR' ? Position.Right : Position.Bottom)" />

                <div class="flex items-center gap-2">
                  <div
                    class="rounded-full bg-current"
                    :class="{
                      'size-2': (data?.level ?? 1) === 1,
                      'size-1.5': (data?.level ?? 1) === 2,
                      'size-1': (data?.level ?? 1) === 3,
                    }"
                  />
                  <span class="font-medium text-sm md:text-base">{{ data?.label ?? '未命名' }}</span>
                </div>

                <p v-if="data?.description" class="mt-1 md:mt-2 text-xs/4 md:text-xs/5 opacity-70">
                  {{ data.description }}
                </p>
              </div>

              <div
                class="mt-1 rounded-xl border bg-white shadow-lg z-[3000] transition-all p-2 flex gap-2"
                :class="openId === id ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'"
              >
                <Button
                  v-if="data.level === 2"
                  class="w-full text-left px-3 py-2 "
                  @mousedown.stop.prevent
                  @click.stop="() => {
                    router.push({
                      name: 'DoQuestion',
                      params: { chapterId: id },
                    })
                  }"
                >
                  跳转到相关试题
                </Button>
                <Button
                  class="w-full text-left px-3 py-2"
                  variant="outline"
                  @mousedown.stop.prevent
                  @click.stop="() => openAiSidebar(data.label)"
                >
                  对该知识点有疑问
                </Button>
              </div>
            </div>
          </template>
          <Background pattern-color="#e5e7eb" :gap="16" />
          <MiniMap
            class="minimap-container" :class="[{ 'minimap-small': showAiSidebar }]"
            :position="showAiSidebar ? 'bottom-left' : undefined"
          />
          <Controls position="bottom-right" />
        </VueFlow>
      </div>
    </div>

    <!-- AI辅导容器 - 独立的最外层边框 -->
    <div
      v-if="showAiSidebar"
      v-auto-animate
      class="rounded-xl bg-white shadow-sm flex flex-col overflow-hidden"
    >
      <MindmapAiSidebar
        :current-knowledge-point="currentKnowledgePoint"
        :ai-messages="aiMessages"
        :ai-state="aiState"
        @quick-ask="quickAsk"
        @send-message="sendMessage"
        @stop="stopGenerating"
        @retry-from="retryFrom"
        @delete-message="(index) => aiMessages.splice(index, 1)"
        @close="showAiSidebar = false"
      />
    </div>
  </div>
</template>
