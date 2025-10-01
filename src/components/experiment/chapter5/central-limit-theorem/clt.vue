<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **中心极限定理**

## **概念介绍**
中心极限定理是概率论与统计学中最具影响力的定理之一，它指出：**大量独立随机变量的和经过适当标准化后，其抽样分布近似服从正态分布**，无论原始变量服从何种分布。

数学表述：设随机变量$X_1,X_2,...,X_n$独立同分布，具有有限的数学期望$\\mu$和方差$\\sigma^2$，则当$n$充分大时，其样本均值$\\bar{X}$近似服从正态分布：
$$\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n})$$

### **高尔顿钉板实验验证**
高尔顿钉板（Galton Board）是中心极限定理的经典物理演示装置，由英国科学家弗朗西斯·高尔顿于1873年发明。装置由一块竖直放置的木板和规则排列的钉子组成：
- **结构特点**：木板上按三角形阵列分布着钉子，底部有等宽的收集槽
- **实验过程**：小球从顶部中央落下，每次碰到钉子有50%概率向左或向右偏转
- **实验结果**：大量小球最终在底部形成近似正态分布的堆积曲线

该实验直观展示了：**大量独立随机事件（小球碰撞钉子的左右偏转）的累积结果会呈现正态分布特征**，这正是中心极限定理的核心思想。当钉子层数或小球数量足够多时，二项分布（每次碰撞的左右选择）逐渐收敛为正态分布。

## **基本性质**
- **普适性**：无论原始总体服从何种分布（正态、均匀、二项等），只要方差有限，定理均成立
- **样本量要求**：总体偏离正态越远，所需样本量越大（通常$n \\geq 30$可满足近似要求）
- **分布收敛性**：样本均值的分布以正态分布为极限，收敛速度与总体分布形状相关
- **均值与方差**：极限分布的均值等于总体均值$\\mu$，方差等于$\\frac{\\sigma^2}{n}$
- **标准化特性**：$$\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\sim N(0,1)$$渐进服从标准正态分布

## **历史发展**
中心极限定理的发展历程跨越了两个世纪，凝聚了多位数学家的智慧：

### **早期萌芽 (18世纪)**
1733年，法国数学家亚伯拉罕·棣莫弗首次观察到二项分布的正态近似现象，为CLT奠定了基础。他在研究正态分布对二项分布的逼近时发现，当试验次数足够大时，二项分布可用正态曲线表示。

### **理论突破 (19世纪)**
1810年，皮埃尔-西蒙·拉普拉斯将棣莫弗的成果扩展到更一般的情况，证明了独立同分布随机变量和的极限分布为正态分布。但他的证明存在严格性缺陷，直到1901年，俄罗斯数学家亚历山大·李雅普诺夫利用特征函数方法给出了第一个严格证明。

### **现代框架 (20世纪)**
20世纪初，芬兰数学家林德伯格和莱维提出了更一般化的条件（林德伯格条件），放宽了对随机变量同分布的要求。1935年，勒维进一步发展了相关理论，形成了我们今天所熟知的中心极限定理体系。

## **应用案例**

### **质量控制**
在工业生产中，中心极限定理用于监控产品质量。例如：
- 某工厂生产的零件长度服从未知分布，均值5cm，标准差0.1cm
- 随机抽取30个样本，其平均长度服从$N(5, 0.0033)$分布
- 通过控制图监测样本均值，判断生产过程是否稳定

### **民意调查**
在统计调查中，CLT确保样本估计的可靠性：
- 调查1000名选民的支持率，尽管个体投票行为是二值分布
- 样本支持率近似服从正态分布，可计算置信区间
- 根据中心极限定理，在95%置信水平下，抽样误差约为$\\sqrt{p(1-p)/n} \\approx$ 3% 

### **金融风险评估**
在金融领域，CLT用于资产组合风险分析：
- 多种股票的日收益率可视为独立随机变量
- 组合收益率近似服从正态分布，便于计算VaR（风险价值）
- 利用CLT将复杂的多元分布简化为正态分布进行风险建模

### **教育测量**
在标准化考试中，CLT用于分数解释：
- 考生得分可能服从各种分布
- 大量考生的平均分服从正态分布
- 通过Z-score将原始分数转换为标准正态分布，进行百分位排名
`;

function onHtmlLoad() {
  console.log('中心极限定理HTML页面加载完成');
}

onMounted(() => {
  console.log('中心极限定理组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="70" :layout="1" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter5/clt.html"
          width="100%"
          height="100%"
          frameborder="0"
          class="rounded-lg shadow-lg"
          @load="onHtmlLoad"
        />
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

iframe {
  border: none;
  background: white;
}
</style>
