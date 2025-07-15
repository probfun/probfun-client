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

const args = withDefaults(defineProps<{
  discussTabList?: Tab[];
  panelSize?: number;
  layout?: number;
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
  <div class="w-full flex p-1 gap-1">
    <ResizablePanelGroup
      id="demo-group-1"
      direction="horizontal"
      class="rounded-lg"
    >
      <ResizablePanel id="demo-panel-2" :default-size="70" :min-size="20" :max-size="80">
        <ResizablePanelGroup id="demo-group-2" :direction="layout === 1 ? 'horizontal' : 'vertical'">
          <ResizablePanel id="demo-panel-3" :default-size="panelSize">
            <div class="flex h-full items-center justify-center p-1">
              <Container class="h-full w-full" :tabs="displayTabList">
                <slot name="experiment" />
              </Container>
            </div>
          </ResizablePanel>
          <ResizableHandle id="demo-handle-2" class="bg-transparent" />
          <ResizablePanel id="demo-panel-4">
            <div class="flex h-full items-center justify-center p-1">
              <Container class="h-full w-full" :tabs="parameterTabList">
                <slot name="parameter" />
              </Container>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-1" class="bg-transparent" />
      <ResizablePanel id="demo-panel-1" :default-size="30">
        <div class="flex h-full items-center justify-center p-1">
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
