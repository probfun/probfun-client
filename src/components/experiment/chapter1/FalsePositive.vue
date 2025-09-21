<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **假阳性问题**

### **1. 问题提出**

假阳性问题，也称为**医学检验悖论**，是一个经典的贝叶斯概率问题。它描述了一个反直觉的现象：

> 即使某种疾病的检测方法**非常准确**（高灵敏度和高特异度），当用于检测一种**非常罕见**的疾病时，一个检测结果呈**阳性**的人，其**真正患病**的概率也可能非常低。

**核心矛盾点**：一个“高准确率”的检测，在真实世界中给出的“阳性”信号，其可信度（即预测价值）高度依赖于疾病的**基础发病率**。忽略基础发病率，会导致对检测结果的严重误解。

### **2. 记号设定与概念定义**

为了进行数学描述，我们首先明确定义所有概念和符号：

*   **$D$** (Disease)： 一个人真正患病的事件。
*   **$¬D$** (No Disease)： 一个人未患病的事件。
*   **$T⁺$** (Positive Test)： 检测结果呈阳性的事件。
*   **$T⁻$** (Negative Test)： 检测结果呈阴性的事件。

**已知概率（输入参数）**：

*   **$P(D)$** - 发病率 (Prevalence)：
    *   定义：人群中随机抽取一个人，他患病的先验概率。
    *   例如：$P(D) = 0.001$ 表示发病率为 0.1%。
*   **$P(T⁺ | D)$** - 灵敏度 (Sensitivity) / 真阳性率 (True Positive Rate, TPR)：
    *   定义：在一个人确实患病的前提下，检测结果呈阳性的概率。
    *   衡量检测发现真实患者的能力。$P(T⁺ | D) = 0.99$ 表示能找出 99% 的患者。
*   **$P(T⁻ | ¬D)$** - 特异度 (Specificity) / 真阴性率 (True Negative Rate, TNR)：
    *   定义：在一个人确实未患病的前提下，检测结果呈阴性的概率。
    *   衡量检测排除非患者的能力。$P(T⁻ | ¬D) = 0.95$ 表示能正确排除 95% 的健康人。
*   **$P(T⁺ | ¬D)$** - 假阳性率 (False Positive Rate, FPR)：
    *   定义：在一个人确实未患病的前提下，检测结果却呈阳性的概率。
    *   它与特异度互补：$P(T⁺ | ¬D) = 1 - P(T⁻ | ¬D) = 1 - 0.95 = 0.05$。

**目标概率（输出结果）**：

*   **$P(D | T⁺)$** - 阳性预测值 (Positive Predictive Value, PPV)： 
    *   定义：在检测结果呈**阳性**的前提下，一个人**真正患病**的概率。
    *   这是我们最终想要知道的、也是反直觉的核心概率。

### **3. 数学计算：贝叶斯定理**

我们使用贝叶斯定理来计算目标概率 $P(D | T⁺)$。

**贝叶斯公式**：
$$
P(D | T^+) = \\frac{P(T^+ | D) \\cdot P(D)}{P(T^+)}
$$

其中，$P(T⁺)$ 是检测结果呈阳性的总概率，需要通过**全概率公式**计算：
$$
P(T^+) = P(T^+ | D) \\cdot P(D) + P(T^+ | \\neg D) \\cdot P(\\neg D)
$$

**代入经典示例的数值**：
*   $P(D) = 0.001$
*   $P(¬D) = 1 - P(D) = 0.999$
*   $P(T⁺ | D) = 0.99$
*   $P(T⁺ | ¬D) = 0.05$

1.  计算 $P(T⁺)$：
    $P(T⁺) = (0.99 * 0.001) + (0.05 * 0.999) = 0.00099 + 0.04995 = 0.05094$
2.  计算 $P(D | T⁺)$：
    $P(D | T⁺) = (0.99 * 0.001) / 0.05094 ≈ 0.0194 ≈ 1.94%$

**结论**：尽管检测看起来很准确，但一个检测呈阳性的人真正患病的概率只有 **1.94%**。


### **4. 迭代检测的分析**

可视化中的“迭代次数”模拟了**同一人多次独立检测且结果均为阳性**的场景。

*   **数学原理**：每次独立的阳性检测结果都会应用贝叶斯定理，并将当前的后验概率 $P(D | T⁺)$ 作为下一次计算的新先验概率 $P(D)$。
*   **效果**：随着连续阳性次数的增加，真正患病的概率会急剧上升。
*   **解释**：
    *   对于真患者：多次检测都返回阳性的概率很高 $(0.99^n)$。
    *   对于健康人：多次检测都返回假阳性的概率极低 $(0.05^n)$，并且随着次数 $n$ 增加而指数级下降。
    *   因此，经过几次迭代后，假阳性的可能性被迅速剔除，剩下的阳性结果极大概率来自真正的患者。这正是在医学实践中用**确认测试**来验证初次筛查阳性结果的数学基础。

### **5. 核心启示与总结**

1.  **基础率忽视 (Base Rate Neglect)**：这是导致直觉错误的主要原因。人类大脑倾向于关注检测的“准确率”（如99%），而忽视疾病的“基础发病率”（如0.1%）。概率推理必须始终考虑先验概率。
2.  **假阳性的主导作用**：在罕见病筛查中，由于健康人基数巨大，即使很低的假阳性率也会产生数量庞大的假阳性人群，远超真正的患者。
3.  **沟通的重要性**：医生和公共卫生官员需要理解这一点，以便向患者和公众准确解释筛查结果，避免不必要的恐慌。阳性结果通常意味着“需要进一步检查”，而不是“你很可能得了这种病”。
4.  **贝叶斯思维的威力**：该问题完美展示了贝叶斯定理如何根据新证据（检测结果）动态更新我们对事件的信念（患病可能性）。


`;

function onHtmlLoad() {
  console.log('假阳性问题HTML页面加载完成');
}

onMounted(() => {
  console.log('假阳性问题实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="假阳性问题" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter1/false-positive.html"
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
          <div v-html="toMarkdown(content)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="false-positive" />
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
