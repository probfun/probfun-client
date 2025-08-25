<script setup lang="ts">
import type { Tab } from '@/components/Container.vue';
import { ChartColumnIncreasing, GraduationCap, MessagesSquare, Presentation } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import Container from '@/components/Container.vue';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChartColumnIncreasing, GraduationCap, MessagesSquare, Presentation } from 'lucide-vue-next';
import { ref } from 'vue';

<<<<<<< Updated upstream
//
defineProps({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: Array as PropType<string[]>,
    required: true,
  },
  discussTabList: {
    type: Array as PropType<Tab[]>,
    required: false,
    default: [
      {
        id: 0,
        label: '实验结论',
        name: 'conclusion',
        icon: GraduationCap,
      },
      {
        id: 1,
        label: '讨论区',
        name: 'comment',
        icon: MessagesSquare,
      },
    ],
  },
=======
const args = withDefaults(defineProps<{
  discussTabList?: Tab[];
  panelSize?: number;
  layout?: number;
  showParameterPanel?: boolean;
}>(), {
  discussTabList: () => [
    {
      id: 0,
      label: '实验结论',
      name: 'conclusion',
      icon: GraduationCap,
    },
    {
      id: 1,
      label: '讨论区',
      name: 'comment',
      icon: MessagesSquare,
    },
  ],
  panelSize: 40,
  layout: 0,
  showParameterPanel: true
>>>>>>> Stashed changes
});

const displayTabList = ref([{
  id: 0,
  label: '实验展示',
  icon: Presentation,
}]);

const parameterTabList = ref([{
  id: 0,
  label: '调整参数',
  icon: ChartColumnIncreasing,
}]);

onMounted(() => {
  console.log(args.layout);
});

// const resizeObserver = ref<ResizeObserver | null>(null);
//
// // const resizeUpdate = () => {
// //   console.log('ok');
// // };
// //
// // onMounted(() => {
// //   if (container.value) {
// //     resizeObserver.value = new ResizeObserver(resizeUpdate);
// //     resizeObserver.value.observe(container.value);
// //   }
// // });
// //
// // onUnmounted(() => {
// //   if (resizeObserver.value) {
// //     resizeObserver.value.disconnect();
// //   }
// // });
//
</script>

<template>
  <div class="w-full flex gap-2">
    <ResizablePanelGroup
      id="demo-group-1"
      direction="horizontal"
      class="rounded-lg"
    >
      <ResizablePanel id="demo-panel-2" :default-size="70" :min-size="20" :max-size="80">
        <ResizablePanelGroup id="demo-group-2" :direction="layout === 1 ? 'horizontal' : 'vertical'">
          <ResizablePanel id="demo-panel-3" :default-size="panelSize">
            <div class="flex h-full items-center justify-center">
              <Container class="h-full w-full" :tabs="displayTabList">
                <slot name="experiment" />
              </Container>
            </div>
          </ResizablePanel>
<<<<<<< Updated upstream
          <ResizableHandle id="demo-handle-2" />
          <ResizablePanel id="demo-panel-4" :default-size="60">
            <div class="flex h-full items-center justify-center p-1">
=======
          <ResizableHandle id="demo-handle-2" class="bg-transparent p-1" />
          <ResizablePanel id="demo-panel-4" v-if="showParameterPanel">
            <div class="flex h-full items-center justify-center">
>>>>>>> Stashed changes
              <Container class="h-full w-full" :tabs="parameterTabList">
                <slot name="parameter" />
              </Container>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-1" class="bg-transparent p-1" />
      <ResizablePanel id="demo-panel-1" :default-size="30">
        <div class="flex h-full items-center justify-center">
          <Container class="flex-1 h-full" :tabs="discussTabList">
            <template #default="{ activeTab }">
              <slot :name="activeTab.name" />
            </template>
          </Container>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<style scoped>

</style>
