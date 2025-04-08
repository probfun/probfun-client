<script setup lang="ts">
import type { NodeOptions } from '@/api/distribution/distributionType';
import type { GraphEdge } from '@vue-flow/core';
import { generateDistributionDescriptionApi } from '@/api/distribution/distributionApi.ts';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { HoverCard } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useConfigStore, useDistributionStore } from '@/store';
import { toMarkdown } from '@/utils/markdown.ts';
import { vAutoAnimate } from '@formkit/auto-animate';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { Bot, Check, ChevronsLeftRightEllipsis, CircuitBoard, RectangleEllipsis } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  id: string
  data: NodeOptions
}>();

const { getConnectedEdges, getEdges } = useVueFlow();
const configStore = useConfigStore();
const isHighlight = ref(false);
const nodeDataRef = ref<NodeOptions | undefined>(undefined);
const customSubject = ref('');

function updateEdgeStyle() {
  const connectedEdges = getConnectedEdges(props.id);
  isHighlight.value = false;
  for (const edge of connectedEdges) {
    const target = edge.target;
    const source = edge.source;

    if (target !== configStore.targetNodeId && source !== configStore.targetNodeId) {
      continue;
    }

    isHighlight.value = (target === props.id || source === props.id);
  }

  if (configStore.targetNodeId !== props.id) {
    return;
  }
  const edges = getEdges.value as unknown as (GraphEdge & { defaultStroke: string })[];
  for (const edge of edges) {
    edge.style = {
      stroke: edge.defaultStroke,
      strokeWidth: 3, // 设置默认边宽为 2
    }
  }
  for (const edge of connectedEdges) {
    edge.style = {
      stroke: 'red',
      strokeWidth: 4, 
    }
  }
}

watch(() => configStore.targetNodeId, () => {
  updateEdgeStyle();
})

function onSelect() {
  if (configStore.targetNodeId === props.id) {
    configStore.targetNodeId = null;
  }
  else {
    configStore.targetNodeId = props.id;
  }
}

const generating = ref(false);
const isError = ref(false);

function replaceKeywords(text: string): string {
  return text.replace(/&&(.+?)&&/g, (match, p1) => ` [${p1}](../ai?query=${encodeURIComponent(`请解释一下${p1}是什么`)}) `);
}

async function generateDescription(subject: string = 'default') {
  console.log('Generating description');
  if (generating.value) {
    return;
  }
  const distribution = props.data.chineseTranslation;
  generating.value = true;
  isError.value = false;
  if (nodeDataRef.value === undefined) {
    return;
  }
  nodeDataRef.value.description = undefined;
  try {
    const response = await generateDistributionDescriptionApi(distribution, subject);
    nodeDataRef.value.description = response.description;
  }
  catch (error) {
    console.error('Error during generating description:', error);
    isError.value = true;
  }
  finally {
    generating.value = false;
  }
}

onMounted(() => {
  updateEdgeStyle();
  const nodeData = useDistributionStore().nodeData;
  nodeDataRef.value = nodeData.find(item => item.label === props.data.label);
  if (nodeDataRef.value?.description === undefined && configStore.targetNodeId === props.id) {
    generateDescription();
  }
});

function getDescriptionTitle(description: string) {
  return description?.split('\n\n')[0].split(':')[1].replace(/&/g, '');
}

function getDescriptionBody(description: string) {
  return replaceKeywords(description.split('\n\n')[1]);
}
</script>

<template>
  <HoverCard
    :open="configStore.targetNodeId === id && !configStore.isMoving" @update:open="(isOpen) => {
      if (isOpen) {
        if (nodeDataRef?.description === undefined) {
          generateDescription();
        }
      }
    }"
  >
    <HoverCardTrigger>
      <div
        :class="cn('border-1 rounded-lg p-3 bg-blue-500 text-white transition-all border-primary', isHighlight && 'border-destructive border-4')"
        @click="onSelect"
      >
        <div class="text-xl whitespace-pre text-center">
          {{ data.label }}
        </div>

        <Handle id="a" type="source" :position="Position.Top" />
        <Handle id="b" type="source" :position="Position.Bottom" />
      </div>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto z-20">
      <Label class="text-base font-bold select-none"> 概率密度函数（PDF） </Label>
      <div class="w-full flex items-center justify-center pt-3 select-none">
        <div v-if="data.pdf" class="prose" v-html="toMarkdown(data.pdf)" />
        <div v-else class="">
          <Label>
            这个分布的概率密度函数暂未收录
          </Label>
        </div>
      </div>
      <div v-auto-animate :class="cn('mt-3')">
        <div v-if="nodeDataRef?.description" class="p-0">
          <div class="p-2">
            <Label class="text-base font-bold select-none"> 应用案例： {{ getDescriptionTitle(nodeDataRef.description) }} </Label>
            <div class="w-full flex items-center justify-center select-none">
              <div class="prose" v-html="toMarkdown(getDescriptionBody(nodeDataRef.description))" />
            </div>
          </div>

          <div class="flex items-center justify-end mr-2 text-muted-foreground">
            <Label> 该内容由 AI 提供，</Label>
            <!--            <Popover> -->
            <!--              <PopoverTrigger> -->

            <!--              </PopoverTrigger> -->
            <!--              <PopoverContent> -->
            <!--                <Button @click="generateDescription('人工智能')"> 人工智能 </Button> -->
            <!--                <Button @click="generateDescription('通信工程')"> 通信工程 </Button> -->
            <!--                <Button @click="generateDescription('电子信息工程')"> 电子信息工程 </Button> -->
            <!--              </PopoverContent> -->
            <!--            </Popover> -->
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="link" class="p-0">
                  想要探索更多应用领域？
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem @click="generateDescription('人工智能')">
                  <Bot class="mr-1 h-4 w-4" />人工智能
                </DropdownMenuItem>
                <DropdownMenuItem @click="generateDescription('通信工程')">
                  <ChevronsLeftRightEllipsis class="mr-1 h-4 w-4" />
                  通信工程
                </DropdownMenuItem>
                <DropdownMenuItem @click="generateDescription('电子信息工程')">
                  <CircuitBoard class="mr-1 h-4 w-4" />
                  电子信息工程
                </DropdownMenuItem>
                <DropdownMenuLabel class="flex items-center gap-2 hover:bg-secondary transition-all">
                  <RectangleEllipsis class="mr-1 h-4 w-4" />
                  <Input v-model="customSubject" class="flex-1 max-w-20 h-6" />
                  <Button size="icon" class="size-5" variant="outline" @click="generateDescription(customSubject)">
                    <Check class="size-4" />
                  </Button>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div v-else-if="generating" class="w-full p-0">
          <Label class="text-base font-bold select-none"> 应用案例：</Label>
          <Label>
            AI 生成中...
          </Label>
        </div>
        <div v-else-if="isError" class="w-full text-destructive">
          <Label class="text-base font-bold select-none"> 应用案例：</Label>
          <Label>
            生成遇到了一些问题，请
          </Label>
          <Button variant="link" class="p-0" @click="generateDescription()">
            重试
          </Button>
        </div>
      </div>

      <div v-if="data.expId">
        <div class="w-full flex items-center justify-center pt-3">
          <Button>
            <router-link :to="`/dashboard/experiment/${data.expId}`">
              进入实验
            </router-link>
          </Button>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<style scoped></style>
