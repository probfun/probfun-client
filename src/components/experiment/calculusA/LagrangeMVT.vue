<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const conclusionContent = `
### **拉格朗日中值定理实验**

拉格朗日中值定理是微积分中的重要定理，其表述如下：

如果函数$f(x)$满足：
1. 在闭区间$[a,b]$上连续
2. 在开区间$(a,b)$内可导

则在开区间$(a,b)$内至少存在一点$\\xi$，使得：

$$f'(\\xi) = \\frac{f(b) - f(a)}{b - a}$$

几何意义：在曲线$y=f(x)$上至少存在一点$(\\xi,f(\\xi))$，使得该点的切线与连接点$(a,f(a))$和$(b,f(b))$的割线平行。
`;

function onHtmlLoad() {
  console.log('拉格朗日中值定理HTML页面加载完成');
}

onMounted(() => {
  console.log('拉格朗日中值定理实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/calculus/mvt.html"
          width="100%"
          height="800px"
          frameborder="0"
          class="integration-iframe"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(conclusionContent)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="lagrange-mvt" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.integration-iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
