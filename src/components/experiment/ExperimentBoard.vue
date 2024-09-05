<template>
  <div class="w-full flex px-2 pb-2 gap-1">
    <div class="flex flex-col gap-1 w-1/2">
      <container class="h-1/2" :tabs="displayTabList">
        <slot name="experiment"></slot>
      </container>
      <div class="h-1 hover:bg-blue-600 cursor-row-resize transition-all" @mousedown="startResizeRow"></div>
      <container class="flex-1" :tabs="parameterTabList">
        <slot name="parameter"></slot>
      </container>
    </div>
    <div class="w-1 hover:bg-blue-600 cursor-col-resize transition-all" @mousedown="startResizeCol"></div>
    <container class="flex-1" :tabs="discussTabList">
      <template #default="{ activeTab }">
        <div v-for="tab in discussTabList" :key="tab.id">
          <div v-if="activeTab === tab.id">
            <slot :name="tab.name"></slot>
          </div>
        </div>
      </template>
    </container>
  </div>
</template>

<script setup lang="ts">
import Container from "@/components/Container.vue";
import {onMounted, onUnmounted, PropType, ref} from "vue";

interface DiscussTab {
  id: number;
  label: string;
  name: string;
  icon: string;
}

defineProps({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: Array as PropType<string[]>,
    required: true
  },
  discussTabList: {
    type: Array as PropType<DiscussTab[]>,
    required: true,
    default:  [
      {
        id: 0,
        label: '实验结论',
        name: 'conclusion',
        icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5' />
           </svg>`
      },
      {
        id: 1,
        label: '讨论区',
        name: 'discuss',
        icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
            <path stroke-linecap='round' stroke-linejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' />
           </svg>`
      }
    ]
  }
});

const displayTabList = ref([{
  id: 0,
  label: '实验展示',
  icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
          <path stroke-linecap='round' stroke-linejoin='round' d='M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' />
         </svg>`
}]);

const parameterTabList = ref([{
  id: 0,
  label: '调整参数',
  icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
          <path stroke-linecap='round' stroke-linejoin='round' d='M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' />
         </svg>`
}]);

// const discussTabList = ref([
//   {
//     id: 0,
//     label: '实验结论',
//     name: 'conclusion',
//     icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
//             <path stroke-linecap='round' stroke-linejoin='round' d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5' />
//            </svg>`
//   },
//   {
//     id: 1,
//     label: '讨论区',
//     name: 'discuss',
//     icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
//             <path stroke-linecap='round' stroke-linejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' />
//            </svg>`
//   }
// ]);

const startResizeRow = (event: MouseEvent) => {
  const resizer = event.target as HTMLDivElement;
  const container = resizer.parentElement as HTMLElement;
  const top = resizer.previousElementSibling as HTMLElement;

  const startY = event.clientY;
  const containerRect = container.getBoundingClientRect();
  const startTopHeight = top.offsetHeight;

  const onMouseMove = (e: MouseEvent) => {
    const containerHeight = containerRect.height;
    const deltaY = e.clientY - startY;
    let newHeightTop = startTopHeight + deltaY;
    const newTopRatio = newHeightTop / containerHeight;
    const constrainedTopRatio = Math.max(0.2, Math.min(newTopRatio, 0.8));
    top.style.height = `${constrainedTopRatio * containerHeight}px`;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const startResizeCol = (event: MouseEvent) => {
  const resizer = event.target as HTMLDivElement;
  const container = resizer.parentElement as HTMLElement;
  const left = resizer.previousElementSibling as HTMLElement;

  const startX = event.clientX;
  const containerRect = container.getBoundingClientRect();
  const startWidthLeft = left.offsetWidth;

  const onMouseMove = (e: MouseEvent) => {
    const containerWidth = containerRect.width;
    const deltaX = e.clientX - startX;

    let newWidthLeft = startWidthLeft + deltaX;
    const newLeftRatio = newWidthLeft / containerWidth;
    const constrainedLeftRatio = Math.max(0.5, Math.min(newLeftRatio, 0.8));
    left.style.width = `${constrainedLeftRatio * containerWidth}px`;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const resizeObserver = ref<ResizeObserver | null>(null);

// const resizeUpdate = () => {
//   console.log('ok');
// };
//
// onMounted(() => {
//   if (container.value) {
//     resizeObserver.value = new ResizeObserver(resizeUpdate);
//     resizeObserver.value.observe(container.value);
//   }
// });
//
// onUnmounted(() => {
//   if (resizeObserver.value) {
//     resizeObserver.value.disconnect();
//   }
// });


</script>

<style scoped>

</style>
