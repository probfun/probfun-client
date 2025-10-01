<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **互斥与独立**

### **互斥事件**

#### **1. 定义**
如果事件 $A$ 与事件 $B$ **不可能同时发生**，则称事件 $A$ 与 $B$ **互斥**（或称**互不相容**）。

用集合论的语言说，就是事件 $A$ 和事件 $B$ 的交集为空集。
$$ 
A \\cap B = \\varnothing 
$$

#### **2. 概率公式**
如果 A 和 B 互斥，那么它们并集的概率等于它们概率之和。
$$
P(A \\cup B) = P(A) + P(B) 
$$
这个公式是概率的**加法公式**在互斥情况下的特例。

**注意**：如果两个事件互斥，则 $P(A \\cap B) = 0$。

#### **3. 要点与示例**
*   **本质**：强调的是“能否同时发生”。互斥事件在同一个试验结果中是非此即彼的。
*   **示例**：
    *   抛一枚骰子：事件 A = “点数为 1”，事件 B = “点数为 2”。A 和 B 是互斥的。
    *   抽查一个产品：事件 A = “产品是合格品”，事件 B = “产品是废品”。A 和 B 是互斥的。

---

### **独立事件**

#### **1. 定义**
如果事件 $A$ 的发生 **不影响** 事件 $B$ 发生的概率，反之亦然，则称事件 $A$ 与 $B$ **相互独立**。

用概率语言说，就是 $A$ 发生的条件下 $B$ 发生的概率等于 $B$ 本身的无条件概率。
$$ 
P(B|A) = P(B) 
$$
同理，$ P(A|B) = P(A) $。

#### **2. 概率公式（判定准则）**
事件 A 和 B 独立的 **充要条件** 是：
$$
P(A \\cap B) = P(A) \\cdot P(B) 
$$
这个公式非常重要，它既是独立的定义，也是最常用的判断和证明独立的工具。

#### **3. 要点与示例**
*   **本质**：强调的是“是否相互影响发生概率”。独立事件允许同时发生，但一个事件的发生不会改变另一个事件发生的几率。
*   **示例**：
    *   抛两次硬币：事件 A = “第一次是正面”，事件 B = “第二次是反面”。A 和 B 是独立的。第一次的结果不会影响第二次。
    *   从两个不同的工厂各抽一个产品：事件 A = “甲厂产品合格”，事件 B = “乙厂产品合格”。通常可以认为 A 和 B 是独立的。

#### **4. 推广到多个事件**
*   **两两独立**：事件组中任意两个事件都是独立的。
*   **相互独立**：一个更强条件。不仅任意两个事件独立，而且任意一个事件的发生都不受其他任意多个事件组合的影响。
    *   例如，对于三个事件 A, B, C，相互独立要求同时满足：
        1.  $P(A \\cap B) = P(A)P(B)$
        2.  $P(A \\cap C) = P(A)P(C)$
        3.  $P(B \\cap C) = P(B)P(C)$
        4.  $P(A \\cap B \\cap C) = P(A)P(B)P(C)$
    *   **注意**：两两独立 ≠ 相互独立。存在反例表明，即使所有事件都是两两独立的，它们也可能不是相互独立的。

---

### **互斥与独立的对比与辨析**

这是最容易出错的地方，请务必仔细理解。

1. **本质区别**  
   - 互斥：事件在结果层面不能同时发生（即“非此即彼”）。  
   - 独立：事件在概率层面互不影响（即“彼此结果无关联”）。  

2. **集合关系**  
   - 互斥：两事件的交集为空集（$A \\cap B = \\varnothing$）。  
   - 独立：两事件的交集不一定为空集（可能有重叠）。  

3. **概率关系（交集）**  
   - 互斥：两事件同时发生的概率为0（$P(A \\cap B) = 0$）。  
   - 独立：两事件同时发生的概率等于各自概率的乘积（$P(A \\cap B) = P(A) \\cdot P(B)$）。  

4. **概率关系（并集）**  
   - 互斥：并集概率等于两事件概率之和（$P(A \\cup B) = P(A) + P(B)$）。  
   - 独立：并集概率需用减法公式修正（$P(A \\cup B) = P(A) + P(B) - P(A)P(B)$）。  

5. **事件间的影响**  
   - 互斥：存在极强依赖关系——若A发生，则B必定不发生。  
   - 独立：无依赖关系——A发生与否不影响B的发生概率，反之亦然。  

6. **与概率值的关联**  
   - 互斥：与事件本身的概率值无关，仅由样本空间的结构决定（如“掷骰子得1点”和“得2点”必然互斥）。  
   - 独立：与概率值密切相关，必须通过公式$P(A \\cap B) = P(A)P(B)$验证（如“降雨”和“股票上涨”是否独立需计算概率）。  

#### **核心结论：**

1.  **当 $P(A) > 0$ 且 $P(B) > 0$ 时，互斥事件必然不独立！**
    *   **推理**：如果 A 和 B 互斥，则 $P(A \\cap B) = 0$。但如果它们独立，则应有 $P(A \\cap B) = P(A) \\cdot P(B) > 0$（因为 $P(A)$ 和 $P(B)$ 都大于零）。这产生了矛盾。
    *   **通俗理解**：如果 A 和 B 互斥，那么 A 的发生（$P(A)>0$）直接导致了 B 一定不发生（$P(B|A)=0$），这显然**影响**了 B 发生的概率（$P(B|A) \\neq P(B)$），所以它们不独立。

2.  **独立事件必然不互斥（除非其中一个是概率为零的不可能事件）**。
    *   因为如果独立且 $P(A), P(B) > 0$，则 $P(A \\cap B) = P(A)P(B) > 0$，这说明它们**有可能同时发生**，所以不互斥。

---

### **总结与常见误区**

*   **互斥看交集是否为空**：问“它们能同时发生吗？” 不能 -> 互斥。
*   **独立看概率是否相乘**：问“一个发生影响另一个的概率吗？” 不影响 -> 独立。用公式 $P(A \\cap B) = P(A) \\cdot P(B)$ 验证。
*   **切记**：不要凭直觉认为“一件事分不同情况就是互斥”或“两件事没关系就是独立”。必须严格根据定义和公式进行判断。
*   **最大的误区**：将互斥和独立混淆。记住这个关键点：**对于正概率事件，互斥和独立是互斥的（不能同时成立）**。

`;

function onHtmlLoad() {
  console.log('互斥与独立HTML页面加载完成');
}

onMounted(() => {
  console.log('互斥与独立实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="互斥与独立" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter1/mutually-exclusive-and-independent.html"
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
      <CommentPanel exp-id="mutually-exclusive-and-independent" />
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
