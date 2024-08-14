<script setup lang="ts">

import DistributionDiagram from "@/components/experiment/distribution/DistributionDiagram.vue";
</script>

<template>
  <Splitter class="mb-8 h-full !border-0">
    <SplitterPanel class="pr-1.5">
      <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
        <div class="mb-2 font-bold"> 实验区 </div>
        <router-view />
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5" :size="25">
      <Panel header="提示区" class="h-full">
        <p class="m-0">一些提示信息或总结</p>
      </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>

</style>