<template>
  <ExperimentBoard title="二维向量场的线积分" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <geo-gebra-applet filename="/vector.ggb" :showToolBar="false" class="w-full h-full"></geo-gebra-applet>
      </div>
    </template>>
    <template #conclusion></template>
    <template #comment>
      <CommentPanel exp-id="" />
    </template>
  </ExperimentBoard>
</template>

<script setup>
import GeoGebraApplet from '@/components/experiment/GeoGebraApplet.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
</script>

<style scoped>
/* ... */
</style>