<script setup lang="ts">
import { generateDistributionFunctionApi } from '@/api/ai/aiApi.ts';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import { getConvergeFuncData, getConvergeFuncOption } from '@/components/experiment/chapter5/distribution-clt/config.ts';
import DistributionCltDiagram from '@/components/experiment/chapter5/distribution-clt/DistributionCltDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { renderLatex, toMarkdown } from '@/utils/markdown';

import { GraduationCap, Lightbulb, MessagesSquare } from 'lucide-vue-next'; // 或者使用 MathJax
import { all, create } from 'mathjs'; // 引入 KaTeX 样式
import { nextTick, onMounted, ref, watch } from 'vue'; // 用于 Markdown 渲染
import { content } from './content';
import 'katex/dist/katex.min.css';
// import 'nerdamer/Calculus';
// import 'nerdamer/Algebra';
// import 'nerdamer/Solve';

const distributionCltDiagram = ref<typeof DistributionCltDiagram | null>(null);
const latexInput = ref('e^{-x^2}');
const aiInput = ref('T分布');
const displayLatexInput = ref('e^{-x^2}');
const range = ref([0, 10]);
const math = create(all);

// 目录项
const chapter1Items = [
  {
    index: 0,
    title: '\\(1713\\) 年 – 雅各布·伯努利（\\(Jacob Bernoulli\\)）',
    label: '\\(\\scriptsize\\mathbf{大数定律}\\)：雅各布·伯努利提出了大数定律，表明在大量重复试验下，事件频率会趋近于其理论概率。这是研究随机现象极限行为的起点。然而，大数定律只说明了平均结果的收敛，却没有描述随机波动的分布情况。',
    icon: 'pi pi-chart-bar',

  },
  // 可以添加更多章节项
  {
    index: 1,
    title: '\\(1733\\) 年 – 亚伯拉罕·棣莫弗（\\(Abraham de Moivre\\)）',
    label: '\\(\\scriptsize\\mathbf{中心极限定理的雏形}\\)：棣莫弗在\\(1733\\)年的论文中使用正态分布近似估计抛硬币所得正面次数的分布，这是正态分布在概率论中的首次出现。他利用\\(\\scriptsize\\mathbf{斯特林公式}\\)推导出了二项分布的正态近似。这一成果可被视为伯努利大数定律的延伸，进一步给出了大量抛硬币时正面次数分布的近似形状。不过，棣莫弗当时仅将此视为二项分布的特殊近似，并未意识到正态近似在更一般情形下的普遍性。',
    icon: 'pi pi-chart-bar',

  },
  {
    index: 2,
    title: '\\(1812\\) 年 – 皮埃尔-西蒙·拉普拉斯（\\(Pierre-Simon Laplace\\)）',
    label: '\\(\\scriptsize\\mathbf{更一般形式的中心极限定理}\\)：拉普拉斯在著作《概率论的解析理论》中给出了更一般形式的中心极限定理。他早在\\(1785\\)年就引入了特征函数这一工具，并在\\(1812\\)年发表了较为全面的定理。拉普拉斯证明了对于有界独立随机变量，其和经标准化后趋于正态分布。这是第一个比较一般的中心极限定理，标志着该理论从特殊案例走向普适规律。不过，拉普拉斯的工作在当时并未引起太大反响。',
    icon: 'pi pi-chart-bar',
  },
  {
    index: 3,
    title: '\\(1824–1829\\) 年 – 西莫恩-德尼·泊松（\\(Siméon-Denis Poisson\\)）',
    label: '\\(\\scriptsize\\mathbf{更严格的论证}\\)：泊松连续发表两篇论文，试图对拉普拉斯的中心极限定理给出更加严格的论证。他引入了类似于现代\\(\\scriptsize\\mathbf{“随机变量”}\\)的概念，并指出中心极限定理并非在任何情形都成立，给出了反例（如具有“厚尾”的柯西分布不满足中心极限定理的条件）。这些工作使人们开始意识到，使用中心极限定理需要对随机变量的条件作出限定。',
    icon: 'pi pi-chart-bar',
  },
  {
    index: 4,
    title: '\\(19\\) 世纪中期 – 更严格的论证尝试',
    label: '\\(\\scriptsize\\mathbf{德国数学家的贡献}\\)：狄利克雷和贝塞尔在证明中引入了\\(\\scriptsize\\mathbf{“不连续因子”}\\)等技巧，改进了泊松的论证方法，并尝试估计正态近似的误差项。虽然他们对误差界的研究并不完全成功，但这是首次对近似误差进行更深入的探讨。与此同时，法国数学家柯西是最早认真以纯数学视角对待概率论的人之一，他在与比奈讨论\\(\\scriptsize\\mathbf{最小二乘法}\\)时，推导出了正态近似误差的一个上界。然而，这一时期的大多数证明严格性仍不足，定理所需条件往往假设隐含而未明确列出。',
    icon: 'pi pi-chart-bar',
  },
];

const chapter2Items = [
  {
    index: 0,
    title: '\\(1887\\) 年 – 帕夫努蒂·切比雪夫（\\(Pafnuty Chebyshev\\)）',
    label: '\\(\\scriptsize\\mathbf{清晰的定理条件}\\)：切比雪夫在\\(1887\\)年发表论文，首次清晰地阐明了中心极限定理成立所需的条件，并将其明确视为一个\\(\\scriptsize\\mathbf{极限分布定理}\\)来研究。他采用\\(\\scriptsize\\mathbf{矩方法}\\)进行论证，证明了适当标准化后的和的各阶矩趋近于相应正态分布的矩。尽管切比雪夫的证明当时仍不够完整严谨，但他开创了用数学分析方法研究中心极限定理的先河。',
    icon: 'pi pi-chart-bar',

  },
  // 可以添加更多章节项
  {
    index: 1,
    title: '\\(1898\\) 年 – 安德烈·马尔可夫（\\(Andrey Markov\\)）',
    label: '\\(\\scriptsize\\mathbf{补充必要条件}\\)：马尔可夫细致审视了切比雪夫的结果，补充指出了一项必要条件：即参与求和的随机变量的方差不能随着样本规模增大而趋近于0。这一附加条件避免了平凡情形的干扰。马尔可夫同样使用矩的方法来说明中心极限定理，当随机变量独立同分布且满足上述条件时，规范化后和的分布的矩逐步逼近标准正态分布的矩。',
    icon: 'pi pi-chart-bar',

  },
  {
    index: 2,
    title: '\\(1901\\) 年 – 亚历山大·李亚普诺夫（\\(Aleksandr Lyapunov\\)）',
    label: '\\(\\scriptsize\\mathbf{现代严格证明}\\)：李亚普诺夫在\\(1901\\)年发表论文，给出了第一个现代严格证明的中心极限定理。不同于前辈采用的矩方法，李亚普诺夫重新拾起了拉普拉斯早在\\(1810\\)年就使用过的\\(\\scriptsize\\mathbf{特征函数}\\)方法来处理问题。在\\(\\scriptsize\\mathbf{李亚普诺夫条件}\\)（要求随机变量有有限的第三阶矩等条件）下，他严格证明了独立随机变量和的标准化分布会收敛于正态分布。他的证明本质上证明了规范化和的特征函数收敛到标准正态分布的特征函数，再利用特征函数与分布之间的一一对应关系得出结论。李亚普诺夫的工作标志着中心极限定理从经验事实升华为严格的数学定理。',
    icon: 'pi pi-chart-bar',
  },

];

const chapter3Items = [
  {
    index: 0,
    title: '\\(1920\\) 年 – 乔治·波利亚（\\(George Pólya\\)）',
    label: ' \\(\\scriptsize\\mathbf{定理的命名}\\)：波利亚在\\(1920\\)年的论文标题中首次引入“中心极限定理”（\\(Central Limit Theorem\\)）这一名称。他之所以称之为“中心”，一方面是因为该定理在概率论中居于核心地位，另一方面也是指相对于分布两端的尾部行为，它刻画的是分布中心部分的极限行为。波利亚在文章摘要中指出：高斯（正态）分布在反复试验、测量误差的合成以及扩散过程等各种现象中频繁出现，这正是由一个起关键作用的极限定理所解释的。',
    icon: 'pi pi-chart-bar',

  },
  // 可以添加更多章节项
  {
    index: 1,
    title: '\\(1922\\) 年 – 雅尔·林德伯格（\\(Jarl Lindeberg\\)）',
    label: ' \\(\\scriptsize\\mathbf{林德伯格条件}\\)：林德伯格发表了中心极限定理的一个新证明，提出了更宽松的充分条件，即后来著名的林德伯格条件。林德伯格定理表明：即使随机变量不完全同分布，只要满足林德伯格条件，独立随机变量之和的标准化仍收敛于正态分布。林德伯格条件比李亚普诺夫条件更弱（要求更少），因此从理论上扩大了定理适用范围。不过，林德伯格条件在某些情形下较难验证，而可以证明凡满足李亚普诺夫条件者必满足林德伯格条件。',
    icon: 'pi pi-chart-bar',

  },
  {
    index: 2,
    title: '\\(1935\\) 年 – 威廉·费勒（\\(William Feller\\)）',
    label: ' \\(\\scriptsize\\mathbf{充要条件}\\)：费勒在\\(1935\\)年前后给出了\\(\\scriptsize\\mathbf{独立同分布情形下}\\)中心极限定理成立的必要和充分条件，使这一极限定理达到了“定理”应有的严谨程度。这一成果后来被称作\\(\\scriptsize\\mathbf{林德伯格-费勒定理}\\)，因为费勒的证明建立在林德伯格条件的基础上，并证明了在一定技术性假设下该条件也是必要的。值得一提的是，保罗·莱维（\\(Paul Lévy\\)）几乎在同一时期独立地找到了类似的结论。',
    icon: 'pi pi-chart-bar',
  },
  {
    index: 3,
    title: '\\(1936\\) 年 – 哈拉尔德·克拉梅尔（\\(Harald Cramér\\)）',
    label: ' \\(\\scriptsize\\mathbf{克拉梅尔定理}\\)：克拉梅尔证明了费勒和莱维在证明中心极限定理充要条件时所需的一项关键假设。具体来说，他证明了：\\(\\scriptsize\\mathbf{如果两个独立}\\)\\(\\scriptsize\\mathbf{随机变量之和服从正态分布，那么这两个随机变量本身也必定是正态分布。}\\)这一结果（后称为克拉梅尔定理）确保了正态分布在独立和的极限中的独特地位，为中心极限定理的最终严谨证明铺平了道路。',
    icon: 'pi pi-chart-bar',
  },
  {
    index: 4,
    title: '\\(1937\\) 年 – 定理的完备形式',
    label: ' \\(\\scriptsize\\mathbf{费勒和莱维的最终证明}\\)：利用克拉梅尔的结论，费勒和莱维分别修正并完善了各自对于中心极限定理的证明，在\\(1937\\)年发表了更新的结果。至此，独立随机变量序列的中心极限定理的理论大厦已基本建成。从\\(1733\\)年棣莫弗的先驱性发现到\\(1937\\)年费勒和莱维给出完备条件，经过两百多年的累积，多位数学家的卓越贡献使中心极限定理成为概率论中体系完备、不可或缺的核心定理。',
    icon: 'pi pi-chart-bar',
  },
];

const chapter4Items = [
  {
    index: 0,
    title: '',
    label: `
      <p>&emsp;&emsp;中心极限定理在概率论和统计学中具有基础性的作用。</p>
      <p>&emsp;&emsp;一方面，它揭示了\\(\\scriptsize\\mathbf{极限分布}\\)的存在：大数定律说明样本平均值会收敛到期望值，而中心极限定理进一步指出平均值围绕期望值的波动分布近似服从正态分布。这解释了为何\\(\\scriptsize\\mathbf{正态分布}\\)在自然和社会现象中如此常见——许多独立随机因素的累加往往会产生接近正态的结果。</p>
      <p>&emsp;&emsp;例如，在误差理论中，多重微小误差叠加后总体误差呈正态分布；在物理学中，扩散运动等现象中的粒子位移分布也接近于正态。</p>
      <p>&emsp;&emsp;另一方面，在统计学中，中心极限定理是许多推断方法的理论支柱。它保证了\\(\\scriptsize\\mathbf{抽样分布}\\)的近似正态性：即使总体分布不服从正态，当样本容量足够大时，样本均值等统计量的分布将趋近正态。这一性质使得我们可以在未知总体分布的情况下，使用正态分布模型来构建\\(\\scriptsize\\mathbf{置信区间}\\)、进行\\(\\scriptsize\\mathbf{假设检验}\\)等，从而大大简化统计推断。在工程、金融等领域，大量随机变量的和（如测量误差的总和、股票收益的累积等）常常被近似为正态，以方便建模和分析。</p>
      <p>&emsp;&emsp;总之，中心极限定理不仅是概率论中的理论瑰宝，也是在各应用领域中广泛发挥作用的重要工具。</p>
    `,
    icon: 'pi pi-chart-bar',
  },
];

const chapters = [
  {
    title: '18 世纪–19 世纪中期：中心极限定理的起源',
    items: chapter1Items,
  },
  {
    title: '19 世纪后期：俄国学派的严谨化',
    items: chapter2Items,
  },
  {
    title: '20 世纪前期：定理的命名与现代完善',
    items: chapter3Items,
  },
  {
    title: '中心极限定理的影响与应用',
    items: chapter4Items,
  },
]

function uniform(x: number): number {
  if (x >= 0 && x <= 1) {
    return 1;
  }
  else {
    return 0;
  }
}

function normal(x: number): number {
  const mean = 0;
  const stdDev = 1;
  return (1 / (Math.sqrt(2 * Math.PI) * stdDev)) * Math.exp(-0.5 * ((x - mean) / stdDev) ** 2);
}

function exponential(x: number): number {
  const lambda = 1;
  if (x < 0)
    return 0;
  return lambda * Math.exp(-lambda * x);
}

function gamma(x: number): number {
  const k = 2; // shape
  const theta = 2; // scale
  if (x < 0)
    return 0;
  return (x ** (k - 1) * Math.exp(-x / theta)) / (theta ** k * gammaFunction(k));
}

function beta(x: number): number {
  const alpha = 2;
  const beta = 2;
  if (x < 0 || x > 1)
    return 0;
  return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / betaFunction(alpha, beta);
}

function cauchy(x: number): number {
  const x0 = 0; // location parameter
  const gamma = 1; // scale parameter
  return (1 / (Math.PI * gamma)) * (gamma / ((x - x0) ** 2 + gamma ** 2));
}

function pareto(x: number): number {
  const xm = 1; // scale parameter
  const alpha = 3; // shape parameter
  if (x < xm)
    return 0;
  return (alpha * xm ** alpha) / x ** (alpha + 1);
}

function gammaFunction(n: number): number {
  if (n === 1)
    return 1;
  if (n === 0.5)
    return Math.sqrt(Math.PI);
  return (n - 1) * gammaFunction(n - 1);
}

function betaFunction(a: number, b: number): number {
  return (gammaFunction(a) * gammaFunction(b)) / gammaFunction(a + b);
}

const fAny = ref<((x: number) => number) | null>(null);
const fCustom = ref<((x: number) => number) | null>(null);
const multi = ref(false);

const functionList = {
  uniform: {
    name: 'Uniform',
    f: uniform,
    chinese: '均匀分布',
    latex: 'f(x) = \\begin{cases} 1, & 0 \\leq x \\leq 1 \\\\ 0, & \\text{其他} \\end{cases}',
    left: 0,
    right: 1,
  },
  normal: {
    name: 'Normal',
    f: normal,
    chinese: '正态分布',
    latex: 'f(x) = \\frac{1}{\\sqrt{2\\pi}}*e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}',
    left: -5,
    right: 5,
  },
  exponential: {
    name: 'Exponential',
    f: exponential,
    chinese: '指数分布',
    latex: 'f(x) = \\lambda e^{-\\lambda x}',
    left: 0,
    right: 10,
  },
  gamma: {
    name: 'Gamma',
    f: gamma,
    chinese: '伽玛分布',
    latex: 'f(x) = \\frac{x^{k-1} e^{-\\frac{x}{\\theta}}}{\\theta^k \\Gamma(k)}',
    left: 0,
    right: 10,
  },
  beta: {
    name: 'Beta',
    f: beta,
    chinese: '贝塔分布',
    latex: 'f(x) = \\frac{x^{\\alpha-1} (1-x)^{\\beta-1}}{B(\\alpha, \\beta)}',
    left: 0,
    right: 1,
  },
  cauchy: {
    name: 'Cauchy',
    f: cauchy,
    chinese: '柯西分布',
    latex: 'f(x) = \\frac{1}{\\pi\\gamma} \\frac{\\gamma}{(x-x_0)^2 + \\gamma^2}',
    left: -10,
    right: 10,
  },
  pareto: {
    name: 'Pareto',
    f: pareto,
    chinese: '帕累托分布',
    latex: 'f(x) = \\frac{\\alpha x_m^\\alpha}{x^{\\alpha+1}}',
    left: 0,
    right: 10,
  },
  custom: {
    name: 'Custom',
    f: fCustom.value,
    chinese: '自定义...',
    latex: '',
    left: 0,
    right: 1,
  },
  ai: {
    name: 'AI',
    f: fCustom.value,
    chinese: 'AI 生成',
    latex: '',
    left: 0,
    right: 1,
  },
};

type FunctionLabel = keyof typeof functionList;

const functionLabel: FunctionLabel[] = [
  'uniform',
  'normal',
  'exponential',
  'gamma',
  'beta',
  'cauchy',
  'pareto',
  'custom',
  'ai',
]

function latexToMath(latex: string): ((x: number) => number) | null {
  const expression = latex
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)') // 处理分数
    .replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)') // 处理平方根
    .replace(/\\left|\\right/g, '') // 移除括号修饰符
    .replace(/\\cdot/g, '*') // 处理乘号
    .replace(/\\times/g, '*') // 处理乘号
    .replace(/\\div/g, '/') // 处理除号
    .replace(/\\pi/g, 'PI') // 处理 π
    .replace(/\\sin/g, 'sin') // 处理正弦函数
    .replace(/\\cos/g, 'cos') // 处理余弦函数
    .replace(/\\tan/g, 'tan') // 处理正切函数
    .replace(/\\log/g, 'log') // 处理对数函数
    .replace(/\\exp/g, 'exp') // 处理指数函数
    .replace(/\\left\(/g, '(') // 处理左括号
    .replace(/\\right\)/g, ')') // 处理右括号
    .replace(/\\,/g, '') // 移除逗号
    .replace(/\\ /g, '')
    .replace(/\{([^}]*)\}/g, (match, p1) => `(${p1})`)
    .replace(/\\\^/g, '^');
  try {
    const node = math.parse(expression);
    const code = node.compile();
    Number.parseFloat(code.evaluate({ x: 0 }));
    displayLatexInput.value = latex;
    return (x: number) => {
      return Number.parseFloat(code.evaluate({ x }));
    }
  }
  catch (error: any) {
    console.error(error);
    return null;
  }
}

function convert() {
  try {
    fAny.value = latexToMath(latexInput.value);
    range.value = [range.value[0], range.value[1]];
  }
  catch (error) {
    console.error(error);
  }
  console.log(fAny.value)
}

function fAnyWrap(f: ((xx: number) => number) | null) {
  return (x: number) => {
    if (f === null) {
      return 0;
    }
    if (x < range.value[0] || x > range.value[1]) {
      return 0;
    }
    return f(x);
  }
}

const selected = ref<FunctionLabel>(functionLabel[0]);

const n_list = ref<number[]>([2]);
const n = ref(2);

const xs = ref<number[]>([]);
const ys = ref<number[]>([]);
const chartData = ref(getConvergeFuncData(xs.value, ys.value));
const chartOption = ref(getConvergeFuncOption());

watch(() => n_list, () => {
  n.value = n_list.value[0];
}, { deep: true });

function refreshConvergeFunc() {
  if (distributionCltDiagram.value) {
    const { x, y } = distributionCltDiagram.value.calculateConvergeFuncPoints();
    xs.value = x;
    ys.value = y;
    chartData.value = getConvergeFuncData(xs.value, ys.value);
  }
}

watch([fAny, range, n], () => {
  nextTick(() => {
    refreshConvergeFunc();
  });
}, { deep: true });

onMounted(() => {
  fAny.value = fAnyWrap(functionList[selected.value].f);
  range.value = [functionList[selected.value].left, functionList[selected.value].right];
  refreshConvergeFunc();
});

const generating = ref(false);
async function generate() {
  if (generating.value) {
    return;
  }
  try {
    generating.value = true;
    const response = await generateDistributionFunctionApi(aiInput.value);
    const funcStr = response.function;
    const functionMatch = funcStr.match(/function\s+(\w+)\s*\((.*?)\)\s*\{([\s\S]*)\}/);
    if (functionMatch) {
      const functionName = functionMatch[1]; // "distribution"
      const args = functionMatch[2]; // "x"
      const body = functionMatch[3]; // function body
      console.log(functionName, args, body);
      // eslint-disable-next-line no-new-func
      fAny.value = new Function(args, body) as (x: number) => number;
    }
    displayLatexInput.value = response.latex;
    range.value[0] = response.min;
    range.value[1] = response.max;
  }
  catch (error) {
    console.error(error);
  }
  finally {
    generating.value = false;
  }
}

const distanceContent = String.raw`
我们使用 $ D_{KS}(P||Q) = \max_x |P(x) - Q(x)|$ 衡量两个分布之间的距离。有：

$$
\text{Distance}(i) = D_{KS}(F_i||N_i), \quad i = 1,\ 2, \dots,\ 30
$$

作为叠加 $i$ 个分布后的分布 $F_i$ 与其对应的正态分布 $N_i$ 之间的距离。可以以此判断叠加分布是否收敛于正态分布。
`;

const discussTabList = [
  {
    id: 0,
    label: '发展历程',
    name: 'formula',
    icon: Lightbulb,
  },
  {
    id: 1,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,
  },
  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
];
</script>

<template>
  <ExperimentBoard :discuss-tab-list="discussTabList">
    <template #experiment>
      <DistributionCltDiagram
        v-if="fAny" ref="distributionCltDiagram"
        :args="{ f: fAny, dx: 0.01, left: range[0], right: range[1], n, multi }"
      />
    </template>
    <template #parameter>
      <div class="p-2 grid grid-cols-2 gap-2 h-full w-full">
        <div class="flex flex-col gap-2">
          <Card>
            <CardHeader class="p-4">
              <CardTitle> 分布选择 </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-2">
              <div class="grid grid-cols-[1fr_3fr] gap-4 items-center">
                <Label class="flex-shrink-0">
                  选择分布：
                </Label>
                <Select
                  v-model="selected" @update:model-value="() => {
                    fAny = fAnyWrap(functionList[selected].f);
                    range = [functionList[selected].left, functionList[selected].right];
                    if (selected === 'custom') {
                      convert();
                    }
                  }"
                >
                  <SelectTrigger>
                    {{ functionList[selected].chinese }}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="func in functionLabel" :key="functionList[func].name" :value="func">
                      {{ functionList[func].chinese }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Label v-if="selected === 'custom'" class="flex-shrink-0">
                  自定义分布：
                </Label>
                <div v-if="selected === 'custom'" class="gap-2 flex">
                  <Input v-model="latexInput" />
                  <Button @click="convert">
                    确定
                  </Button>
                </div>
                <Label v-if="selected === 'ai'" class="flex-shrink-0">
                  想要生成的分布名称：
                </Label>
                <div v-if="selected === 'ai'" class="gap-2 flex">
                  <Input v-model="aiInput" />
                  <Button :disabled="generating" @click="generate">
                    生成
                  </Button>
                </div>
              </div>
              <div
                v-if="fAny" class="w-full prose items-center mt-3"
                v-html="toMarkdown(`$$\n${selected === 'ai' ? displayLatexInput : selected === 'custom' ? `f(x)=${displayLatexInput}` : functionList[selected].latex}\n$$`)"
              />
              <div v-else class="w-full pt-3 flex justify-center items-center">
                <Label class="text-destructive">
                  你输入的概率密度函数无法解析，请检查输入
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle> 参数调整 </CardTitle>
            </CardHeader>
            <CardContent class="flex items-center justify-center flex-1">
              <div class="grid w-full grid-cols-[1fr_3fr] gap-4 items-center">
                <Label class="flex-shrink-0">
                  叠加分布数量：
                </Label>
                <div class="gap-2 flex items-center">
                  <Slider v-model="n_list" :disabled="multi" :min="1" :max="30" />
                  <Input v-model="n" :disabled="multi" :min="1" :max="30" type="number" class="w-16" />
                  <Label class="flex-shrink-0">
                    个
                  </Label>
                </div>
                <Label class="flex-shrink-0">
                  分布定义域：
                </Label>
                <div class="flex gap-2">
                  <!--                  <Label class="flex-shrink-0"> -->
                  <!--                    {{ range[0] }} -->
                  <!--                  </Label> -->
                  <Input
                    v-model="range[0]" :disabled="selected !== 'custom'" :min="-10" :max="range[1]" type="number"
                    class="w-16"
                  />
                  <Slider v-model="range" :disabled="selected !== 'custom'" :min="-10" :max="10" />
                  <!--                  <Label class="flex-shrink-0"> -->
                  <!--                    {{ range[1] }} -->
                  <!--                  </Label> -->
                  <Input
                    v-model="range[1]" :disabled="selected !== 'custom'" :min="range[0]" :max="10" type="number"
                    class="w-16"
                  />
                </div>
                <Label class="flex-shrink-0">
                  展示方式：
                </Label>
                <div class="flex justify-center py-2">
                  <RadioGroup
                    default-value="option-one" class="flex flex-row gap-5" @update:model-value="(value) => {
                      multi = value === 'option-two';
                      console.log(multi);
                    }"
                  >
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option-one" value="option-one" />
                      <Label for="option-one">动态调整</Label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option-two" value="option-two" />
                      <Label for="option-two">对比展示</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card class="flex flex-col">
          <CardHeader class="p-4">
            <CardTitle> 收敛速度 </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col">
            <div class="w-full" v-html="toMarkdown(distanceContent)" />
            <chart type="line" :data="chartData" class="w-full flex-1" :options="chartOption" />
          </CardContent>
        </Card>
      </div>
    </template>
    <template #formula>
      <!-- 目录部分 -->
      <div class="">
        <Accordion type="multiple" collapsible>
          <AccordionItem v-for="(chapter, index) in chapters" :key="chapter.title" :value="chapter.title">
            <AccordionTrigger>
              <div class="px-4">
                {{ chapter.title }}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul v-if="index !== 3" class="space-y-0 px-3">
                <li v-for="item in chapter.items" :key="item.title" class="cursor-pointer py-2">
                  <details>
                    <summary>
                      <span v-html="renderLatex(item.title)" />
                    </summary>
                    <div class="p-3" v-html="renderLatex(item.label)" />
                  </details>
                </li>
              </ul>
              <div v-else class="px-6" v-html="renderLatex(chapter.items[0].label)" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="distribution-clt" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
summary {
  font-size: 1.0em;
  margin-bottom: 0.1em;
  margin-top: 0.5em;
  margin-left: 0.7em;
}
</style>
