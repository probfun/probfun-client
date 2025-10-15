<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **身高数据分析实验结论**

通过本次实验，我们可以对男性身高数据分布有以下几点观察和结论：

### **一、数据分布特征**

1. **正态分布特性**：实验生成的男性身高数据呈现出典型的正态分布特征，数据主要集中在均值附近区域。

2. **数据集中趋势**：样本数据的平均值大约在170-180cm之间，这符合正常成年男性身高的普遍范围。

3. **离散程度**：身高数据的标准差相对较小，表明身高数据的离散程度有限，符合人类生理特征的实际情况。

### **二、区间宽度选择的影响**

1. **直方图分辨率**：
   - 较大的区间宽度（如3-5cm）会减少直方图的条形数量，更清晰地展示整体分布趋势。
   - 较小的区间宽度（如0.5-1cm）能够展示更详细的数据分布，但可能会突出一些随机波动。

2. **单位选择提示**：
   - **特别提醒**：当选择**0.5cm**的区间宽度时，建议切换到毫米单位进行显示，这样可以获得更精确的数据可视化效果，避免数值显示过于密集。
   - 对于一般分析需求，1-2cm的区间宽度通常能在显示细节和整体趋势之间取得良好平衡。

### **三、样本量的影响**

1. **样本规模与分布稳定性**：增加样本数量可以使分布更加稳定，减少随机因素的影响，更好地反映真实的数据分布特征。

2. **数据浏览建议**：使用"切换视图"功能可以在查看100条和500条数据记录之间切换，便于在不同层面了解数据特征。

### **四、实验意义**

本实验帮助我们理解了数据分布分析的基本方法，特别是区间宽度选择对数据可视化效果的重要影响。在实际数据分析工作中，选择合适的区间宽度和单位可以帮助我们更准确地解读数据特征。
`;

function onHtmlLoad() {
  console.log('身高数据分析HTML页面加载完成');
}

onMounted(() => {
  console.log('身高数据分析实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="身高数据分析实验" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/height-stats.html"
          width="100%"
          height="100%"
          frameborder="0"
          class="integration-iframe"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(content)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="height-stats" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 900px;
}

.integration-iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
