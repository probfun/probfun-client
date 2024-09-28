<script setup lang="ts">
import type { Tab } from '@/components/Container.vue';
import type { PropType } from 'vue';
import Container from '@/components/Container.vue';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChartColumnIncreasing, GraduationCap, MessagesSquare, Presentation } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: Array as PropType<string[]>,
    required: true,
  },
  experimentTitle: {
    type: String,
    required: false,
    default: '实验',
  },
  experimentTags: {
    type: Array as PropType<string[]>,
    required: false,
    default: [],
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
        name: 'discuss',
        icon: MessagesSquare,
      },
    ],
  },
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
      <ResizablePanel id="demo-panel-2" :default-size="50" :min-size="20" :max-size="80">
        <ResizablePanelGroup id="demo-group-2" direction="vertical">
          <ResizablePanel id="demo-panel-3" :default-size="50">
            <div class="flex h-full items-center justify-center p-1">
              <display-container
                class="h-full w-full"
                :tabs="displayTabList"
                :title="experimentTitle"
                :tags="experimentTags"
              >
                <slot name="experiment" />
              </display-container>
            </div>
          </ResizablePanel>
          <ResizableHandle id="demo-handle-2" />
          <ResizablePanel id="demo-panel-4" :default-size="50">
            <div class="flex h-full items-center justify-center p-1">
              <Container class="h-full w-full" :tabs="parameterTabList">
                <slot name="parameter" />
              </Container>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-1" />
      <ResizablePanel id="demo-panel-1" :default-size="50">
        <div class="flex h-full items-center justify-center p-1">
          <Container class="flex-1 h-full" :tabs="discussTabList">
            <template #default="{ activeTab }">
              <div v-for="tab in discussTabList" :key="tab.id">
                <div v-if="activeTab === tab">
                  <slot :name="tab.name" />
                </div>
              </div>
            </template>
          </Container>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<style scoped>

</style>
