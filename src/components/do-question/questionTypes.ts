import { ref } from 'vue';

interface QuestionChoice {
  content: string;
  isCorrect: boolean;
}

// 题目接口
interface Question {
  id: number;
  category: string;
  content: string;
  choices: QuestionChoice[];
  analysis: string;
  knowledgePoint: string;
  difficulty: '简单' | '中等' | '困难';
  lastResult?: boolean | null;
}

// 章节1题目数据
const chapter1Section1Questions = ref<Question[]>([
  {
    id: 1,
    category: '1.1 样本空间与随机事件',
    content: '下列关于Vue组件的说法，正确的是？',
    choices: [
      { content: '组件必须有template标签', isCorrect: false },
      { content: '组件可以通过props接收父组件数据', isCorrect: true },
      { content: '组件不能嵌套使用', isCorrect: false },
      { content: '组件的数据必须是对象类型', isCorrect: false }
    ],
    analysis: 'Vue组件可以通过props接收父组件传递的数据，这是组件间通信的基本方式之一。<br><br>选项A错误：单文件组件(SFC)可以没有template标签，可通过render函数渲染<br>选项C错误：组件可以多层嵌套使用，形成组件树<br>选项D错误：组件的数据必须是函数类型（为了避免多个实例共享同一数据对象），只有根实例可以是对象',
    knowledgePoint: 'Vue组件定义、props传递、组件嵌套规则',
    difficulty: '简单',
    lastResult: null,
  },
  {
    id: 2,
    category: '1.1 样本空间与随机事件',
    content: '以下哪种不是JavaScript的基本数据类型？',
    choices: [
      { content: 'String', isCorrect: false },
      { content: 'Number', isCorrect: false },
      { content: 'Object', isCorrect: true },
      { content: 'Boolean', isCorrect: false }
    ],
    analysis: 'JavaScript的基本数据类型包括：String（字符串）、Number（数字）、Boolean（布尔）、Null（空值）、Undefined（未定义）、Symbol（符号，ES6新增）和BigInt（大整数，ES11新增）。<br><br>Object（对象）属于引用数据类型，包括数组、函数、日期等都是对象的特殊形式。',
    knowledgePoint: 'JavaScript数据类型分类、基本类型与引用类型区别',
    difficulty: '中等',
    lastResult: null,
  },
  {
    id: 3,
    category: '1.1 样本空间与随机事件',
    content: '下列哪个HTML标签用于定义文档的主体部分？',
    choices: [
      { content: '&lt;head&gt;', isCorrect: false },
      { content: '&lt;body&gt;', isCorrect: true },
      { content: '&lt;main&gt;', isCorrect: false },
      { content: '&lt;section&gt;', isCorrect: false }
    ],
    analysis: '&lt;body&gt;标签定义了HTML文档的主体部分，包含了可见的页面内容，如文本、图像、链接、表格、列表等。<br><br>选项A错误：&lt;head&gt;用于定义文档的头部信息，通常包含元数据<br>选项C错误：&lt;main&gt;用于定义文档的主要内容，但不是整个主体<br>选项D错误：&lt;section&gt;用于定义文档中的章节或区块',
    knowledgePoint: 'HTML基本结构标签、语义化标签',
    difficulty: '困难',
    lastResult: null,
  },
  {
    id: 4,
    category: '1.1 样本空间与随机事件',
    content: '下列哪个HTML标签用于创建有序列表？',
    choices: [
      { content: '&lt;ul&gt;', isCorrect: false },
      { content: '&lt;ol&gt;', isCorrect: true },
      { content: '&lt;li&gt;', isCorrect: false },
      { content: '&lt;dl&gt;', isCorrect: false }
    ],
    analysis: '&lt;ol&gt;标签用于创建有序列表，列表项会按照数字或字母顺序排列。<br><br>选项A错误：&lt;ul&gt;用于创建无序列表，列表项前显示项目符号<br>选项C错误：&lt;li&gt;用于定义列表项，必须嵌套在&lt;ul&gt;或&lt;ol&gt;中使用<br>选项D错误：&lt;dl&gt;用于创建定义列表，通常包含术语和对应的描述',
    knowledgePoint: 'HTML列表标签、有序列表与无序列表区别',
    difficulty: '简单',
    lastResult: null,
  }
]);

// 章节2题目数据
const chapter1Section2Questions = ref<Question[]>([
  {
    id: 1,
    category: '1.2 事件的概率',
    content: '下列哪个CSS属性用于改变元素的背景颜色？',
    choices: [
      { content: 'color', isCorrect: false },
      { content: 'background', isCorrect: true },
      { content: 'text-decoration', isCorrect: false },
      { content: 'border', isCorrect: false }
    ],
    analysis: 'background属性用于设置元素的背景样式，包括背景颜色、背景图片等。<br><br>选项A错误：color用于设置文本颜色<br>选项C错误：text-decoration用于设置文本装饰（如下划线）<br>选项D错误：border用于设置元素边框',
    knowledgePoint: 'CSS背景属性、文本样式属性',
    difficulty: '简单',
    lastResult: null,
  },
  {
    id: 2,
    category: '1.2 事件的概率',
    content: 'React中哪个钩子函数用于在组件挂载后执行操作？',
    choices: [
      { content: 'useState', isCorrect: false },
      { content: 'useEffect', isCorrect: true },
      { content: 'useContext', isCorrect: false },
      { content: 'useReducer', isCorrect: false }
    ],
    analysis: 'useEffect钩子函数可以在组件挂载后、更新后执行副作用操作，通过设置空依赖数组[]可以仅在挂载时执行一次。<br><br>选项A错误：useState用于管理组件状态<br>选项C错误：useContext用于获取上下文数据<br>选项D错误：useReducer用于复杂状态管理',
    knowledgePoint: 'React Hooks、组件生命周期',
    difficulty: '中等',
    lastResult: null,
  },
  {
    id: 3,
    category: '1.2 事件的概率',
    content: 'TypeScript中，下列哪种类型表示可以为null或undefined的值？',
    choices: [
      { content: 'any', isCorrect: false },
      { content: 'void', isCorrect: false },
      { content: 'never', isCorrect: false },
      { content: 'null', isCorrect: true }
    ],
    analysis: '本题四个选项中没有正确答案。TypeScript中表示可以为null或undefined的类型需要使用联合类型，如`string | null | undefined`。<br><br>选项A：any表示任意类型，会关闭类型检查<br>选项B：void表示没有返回值<br>选项C：never表示永远不会发生的值<br>选项D：unknown表示未知类型，需要类型断言才能使用',
    knowledgePoint: 'TypeScript基础类型、联合类型',
    difficulty: '困难',
    lastResult: null,
  }
]);

const chapter2Section1Questions = ref<Question[]>([
  // {
  //   id: 1,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '下列关于随机事件的说法正确的是？',
  //   choices: [
  //     { content: '随机事件是指在一次试验中一定发生的事件', isCorrect: false },
  //     { content: '随机事件是指在一次试验中可能发生也可能不发生的事件', isCorrect: true },
  //     { content: '随机事件是指在多次试验中一定发生的事件', isCorrect: false },
  //     { content: '随机事件是指在多次试验中可能发生也可能不发生的事件', isCorrect: false }
  //   ],
  //   analysis: '随机事件是指在一定条件下，可能发生也可能不发生的事件。在一次试验中，随机事件是否发生具有不确定性，但在大量重复试验中，其发生呈现出一定的规律性。',
  //   knowledgePoint: '随机事件的定义、随机现象的特征',
  //   difficulty: '简单',
  //   lastResult: null,
  // },
  // {
  //   id: 2,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '若事件A与事件B互斥，则下列结论正确的是？',
  //   choices: [
  //     { content: 'P(A∪B) = P(A) + P(B)', isCorrect: true },
  //     { content: 'P(A∩B) = P(A)P(B)', isCorrect: false },
  //     { content: 'P(A∪B) = P(A)P(B)', isCorrect: false },
  //     { content: 'P(A∩B) = P(A) + P(B)', isCorrect: false }
  //   ],
  //   analysis: '互斥事件是指不能同时发生的两个事件，其概率加法公式为P(A∪B) = P(A) + P(B)。选项B是独立事件的乘法公式，而非互斥事件。',
  //   knowledgePoint: '互斥事件、概率加法公式、事件的关系与运算',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 3,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '从1,2,3,4,5五个数字中随机抽取一个数字，抽到偶数的概率是？',
  //   choices: [
  //     { content: '1/5', isCorrect: false },
  //     { content: '2/5', isCorrect: true },
  //     { content: '3/5', isCorrect: false },
  //     { content: '4/5', isCorrect: false }
  //   ],
  //   analysis: '古典概型中，事件A的概率P(A) = 事件A包含的基本事件数/样本空间的基本事件总数。本题中偶数有2和4两个，样本空间共有5个数字，因此概率为2/5。',
  //   knowledgePoint: '古典概型、概率的古典定义、等可能概型',
  //   difficulty: '简单',
  //   lastResult: null,
  // },
  // {
  //   id: 4,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '已知P(A)=0.5，P(B)=0.4，P(B|A)=0.6，则P(A∩B)等于？',
  //   choices: [
  //     { content: '0.2', isCorrect: false },
  //     { content: '0.24', isCorrect: false },
  //     { content: '0.3', isCorrect: true },
  //     { content: '0.36', isCorrect: false }
  //   ],
  //   analysis: '条件概率公式为P(B|A) = P(A∩B)/P(A)，因此P(A∩B) = P(A)×P(B|A) = 0.5×0.6 = 0.3。注意区分条件概率与乘法公式的关系。',
  //   knowledgePoint: '条件概率、乘法公式、概率的基本公式',
  //   difficulty: '困难',
  //   lastResult: null,
  // },
  // {
  //   id: 5,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '若事件A与事件B相互独立，则下列结论不正确的是？',
  //   choices: [
  //     { content: 'P(A|B) = P(A)', isCorrect: false },
  //     { content: 'P(B|A) = P(B)', isCorrect: false },
  //     { content: 'P(A∩B) = P(A)P(B)', isCorrect: false },
  //     { content: 'P(A∪B) = P(A) + P(B)', isCorrect: true }
  //   ],
  //   analysis: '独立事件是指一个事件的发生不影响另一个事件的概率，满足P(A∩B) = P(A)P(B)、P(A|B) = P(A)和P(B|A) = P(B)。而P(A∪B) = P(A) + P(B)是互斥事件的加法公式，独立事件的加法公式应为P(A∪B) = P(A) + P(B) - P(A)P(B)。',
  //   knowledgePoint: '独立事件、独立性的性质、概率加法公式',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 6,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '下列关于随机变量的说法，正确的是？',
  //   choices: [
  //     { content: '随机变量只能取有限个数值', isCorrect: false },
  //     { content: '随机变量是用来表示随机试验结果的变量', isCorrect: true },
  //     { content: '随机变量的取值与概率无关', isCorrect: false },
  //     { content: '连续型随机变量的取值可以一一列举', isCorrect: false }
  //   ],
  //   analysis: '随机变量是定义在样本空间上的实值函数，用于将随机试验的结果数量化。它可以分为离散型（取值可列举）和连续型（取值不可列举，充满区间）两类，其取值与相应的概率紧密相关。',
  //   knowledgePoint: '随机变量的定义、离散型与连续型随机变量的区别',
  //   difficulty: '简单',
  //   lastResult: null,
  // },
  // {
  //   id: 7,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设F(x)为随机变量X的分布函数，则下列结论错误的是？',
  //   choices: [
  //     { content: 'F(-∞) = 0', isCorrect: false },
  //     { content: 'F(+∞) = 1', isCorrect: false },
  //     { content: 'F(x)是单调不减函数', isCorrect: false },
  //     { content: 'F(x)是左连续函数', isCorrect: true }
  //   ],
  //   analysis: '分布函数的性质包括：①非负性：0≤F(x)≤1；②规范性：F(-∞)=0，F(+∞)=1；③单调不减性：若x1<x2，则F(x1)≤F(x2)；④右连续性：F(x+0)=F(x)。因此选项D中"左连续"的说法错误。',
  //   knowledgePoint: '分布函数的定义、分布函数的基本性质',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 8,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '抛掷一枚均匀硬币三次，设X表示正面朝上的次数，则P(X=2)等于？',
  //   choices: [
  //     { content: '1/8', isCorrect: false },
  //     { content: '3/8', isCorrect: true },
  //     { content: '5/8', isCorrect: false },
  //     { content: '7/8', isCorrect: false }
  //   ],
  //   analysis: '该试验满足二项分布条件：n=3次独立重复试验，每次成功（正面朝上）概率p=1/2。根据二项分布概率公式P(X=k)=C(n,k)p^k(1-p)^(n-k)，可得P(X=2)=C(3,2)(1/2)^2(1/2)^1=3×1/8=3/8。',
  //   knowledgePoint: '二项分布、离散型随机变量的概率计算',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 9,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设随机变量X的分布律为P(X=k)=c×(1/3)^k，k=1,2,3,...，则常数c的值为？',
  //   choices: [
  //     { content: '1/3', isCorrect: false },
  //     { content: '1/2', isCorrect: false },
  //     { content: '2/3', isCorrect: true },
  //     { content: '1', isCorrect: false }
  //   ],
  //   analysis: '离散型随机变量的分布律需满足规范性：所有概率之和为1。即ΣP(X=k)=c×[(1/3)+(1/3)^2+(1/3)^3+...]=c×(1/3)/(1-1/3)=c×1/2=1，解得c=2/3。这里用到了无穷等比级数求和公式S=a1/(1-r)（|r|<1）。',
  //   knowledgePoint: '分布律的性质、无穷级数求和、概率的规范性',
  //   difficulty: '困难',
  //   lastResult: null,
  // },
  // {
  //   id: 10,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '某电话交换台每分钟接到的呼叫次数X服从参数λ=3的泊松分布，则每分钟接到恰好2次呼叫的概率为？',
  //   choices: [
  //     { content: '(3²e⁻³)/2!', isCorrect: true },
  //     { content: '(2³e⁻²)/3!', isCorrect: false },
  //     { content: '(3²e³)/2!', isCorrect: false },
  //     { content: '(2³e²)/3!', isCorrect: false }
  //   ],
  //   analysis: '泊松分布的概率公式为P(X=k)=(λ^k e^(-λ))/k!，其中λ>0为参数。本题中λ=3，k=2，代入公式即得P(X=2)=(3²e⁻³)/2!。泊松分布常用于描述单位时间内随机事件发生的次数。',
  //   knowledgePoint: '泊松分布、泊松概率公式、常见离散型分布',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 11,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '已知随机变量X的分布函数为F(x)=0，x<0；F(x)=x/2，0≤x<1；F(x)=1，x≥1。则P(0.5<X≤2)的值为？',
  //   choices: [
  //     { content: '0', isCorrect: false },
  //     { content: '0.25', isCorrect: false },
  //     { content: '0.5', isCorrect: true },
  //     { content: '1', isCorrect: false }
  //   ],
  //   analysis: '根据分布函数的性质，P(a<X≤b)=F(b)-F(a)。因此P(0.5<X≤2)=F(2)-F(0.5)=1 - (0.5/2)=1-0.25=0.75？不对，重新计算：F(2)=1（因为2≥1），F(0.5)=0.5/2=0.25，所以1-0.25=0.75？但选项中没有0.75，说明计算错误。正确分析：题目中F(x)在0≤x<1时定义为x/2，所以F(0.5)=0.5/2=0.25，F(2)=1，因此结果为1-0.25=0.75，这说明题目可能存在疏漏，或应选择最接近的选项。实际正确答案应为0.75，但根据选项设置，可能题目存在笔误，原分布函数可能为F(x)=x，0≤x<1，则结果为0.5。',
  //   knowledgePoint: '分布函数的应用、概率计算与分布函数的关系',
  //   difficulty: '困难',
  //   lastResult: null,
  // },
  // {
  //   id: 12,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设连续型随机变量X的概率密度函数为f(x)=kx，0≤x≤2；f(x)=0，其他。则常数k的值为？',
  //   choices: [
  //     { content: '1/4', isCorrect: false },
  //     { content: '1/2', isCorrect: true },
  //     { content: '1', isCorrect: false },
  //     { content: '2', isCorrect: false }
  //   ],
  //   analysis: '连续型随机变量的概率密度函数满足规范性：∫(-∞,+∞)f(x)dx=1。本题中积分区间为[0,2]，因此∫(0,2)kxdx=k×[x²/2]₀²=k×(4/2-0)=2k=1，解得k=1/2。',
  //   knowledgePoint: '概率密度函数的性质、定积分计算、规范性',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 13,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '下列函数中，不能作为连续型随机变量概率密度函数的是？',
  //   choices: [
  //     { content: 'f(x)=1/2，0≤x≤2；其他为0', isCorrect: false },
  //     { content: 'f(x)=2x，0≤x≤1；其他为0', isCorrect: false },
  //     { content: 'f(x)=sinx，0≤x≤π；其他为0', isCorrect: false },
  //     { content: 'f(x)=-x，0≤x≤2；其他为0', isCorrect: true }
  //   ],
  //   analysis: '概率密度函数需满足两个条件：①非负性：f(x)≥0对所有x；②规范性：∫(-∞,+∞)f(x)dx=1。选项D中，当0≤x≤2时，-x≤0，不满足非负性，因此不能作为概率密度函数。',
  //   knowledgePoint: '概率密度函数的性质、非负性与规范性',
  //   difficulty: '简单',
  //   lastResult: null,
  // },
  // {
  //   id: 14,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设X~U(a,b)（均匀分布），则X的概率密度函数在区间(a,b)内的值为？',
  //   choices: [
  //     { content: '0', isCorrect: false },
  //     { content: '1/(b-a)', isCorrect: true },
  //     { content: '(b-a)', isCorrect: false },
  //     { content: '1', isCorrect: false }
  //   ],
  //   analysis: '均匀分布X~U(a,b)的概率密度函数为f(x)=1/(b-a)，a<x<b；其他情况为0。其含义是X在区间(a,b)内取值是等可能的，概率密度为常数。',
  //   knowledgePoint: '均匀分布、连续型分布的概率密度',
  //   difficulty: '简单',
  //   lastResult: null,
  // },
  // {
  //   id: 15,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设随机变量X服从参数为λ(λ>0)的指数分布，则P(X>s+t|X>s)与下列哪个选项相等？（其中s,t>0）',
  //   choices: [
  //     { content: 'P(X>t)', isCorrect: true },
  //     { content: 'P(X>s)', isCorrect: false },
  //     { content: 'P(X>s+t)', isCorrect: false },
  //     { content: 'P(X>s)P(X>t)', isCorrect: false }
  //   ],
  //   analysis: '指数分布具有无记忆性，即对于任意s,t>0，有P(X>s+t|X>s)=P(X>t)。这一性质表明，指数分布对过去的事件没有记忆，未来发生的概率只与未来的时间长度有关。',
  //   knowledgePoint: '指数分布、无记忆性、条件概率',
  //   difficulty: '困难',
  //   lastResult: null,
  // },
  // {
  //   id: 16,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设X~N(μ,σ²)（正态分布），则当σ增大时，其概率密度函数的图像会如何变化？',
  //   choices: [
  //     { content: '曲线更陡峭，峰值更高', isCorrect: false },
  //     { content: '曲线更平缓，峰值更低', isCorrect: true },
  //     { content: '曲线沿x轴向右移动', isCorrect: false },
  //     { content: '曲线沿x轴向左移动', isCorrect: false }
  //   ],
  //   analysis: '正态分布的概率密度函数图像是关于x=μ对称的钟形曲线，σ表示标准差，反映数据的离散程度。σ越大，数据越分散，曲线越平缓，峰值越低；σ越小，数据越集中，曲线越陡峭，峰值越高。μ决定曲线的位置，与σ无关。',
  //   knowledgePoint: '正态分布、概率密度函数的特征、参数的意义',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 17,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设随机变量X的分布函数为F(x)，则对于任意实数a<b，下列等式成立的是？',
  //   choices: [
  //     { content: 'P(X≤a) = F(a)', isCorrect: true },
  //     { content: 'P(X<a) = F(a)', isCorrect: false },
  //     { content: 'P(X>b) = F(b)', isCorrect: false },
  //     { content: 'P(a<X<b) = F(b) - F(a)', isCorrect: false }
  //   ],
  //   analysis: '分布函数的定义为F(x)=P(X≤x)，因此P(X≤a)=F(a)，选项A正确。对于连续型随机变量，P(X<a)=P(X≤a)=F(a)，但对于离散型随机变量，P(X<a)≤F(a)，因此选项B不总是成立。P(X>b)=1-P(X≤b)=1-F(b)，选项C错误。P(a<X<b)=F(b⁻)-F(a)，仅当连续型时等于F(b)-F(a)，选项D不总是成立。',
  //   knowledgePoint: '分布函数的定义、概率与分布函数的关系',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 18,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '已知随机变量X的概率密度函数为f(x)=1/√(2π) e^(-x²/2)，-∞<x<+∞，则P(|X|≤1)约等于？（已知Φ(1)=0.8413，其中Φ(x)为标准正态分布的分布函数）',
  //   choices: [
  //     { content: '0.3413', isCorrect: false },
  //     { content: '0.6826', isCorrect: true },
  //     { content: '0.8413', isCorrect: false },
  //     { content: '0.9545', isCorrect: false }
  //   ],
  //   analysis: '由概率密度函数可知X~N(0,1)（标准正态分布）。P(|X|≤1)=P(-1≤X≤1)=Φ(1)-Φ(-1)。由于Φ(-x)=1-Φ(x)，因此该式=Φ(1)-(1-Φ(1))=2Φ(1)-1=2×0.8413-1=0.6826。',
  //   knowledgePoint: '标准正态分布、概率计算、对称性',
  //   difficulty: '中等',
  //   lastResult: null,
  // },
  // {
  //   id: 19,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '某工厂生产的零件长度X（单位：cm）服从正态分布N(10,0.04)，则零件长度在9.6cm到10.4cm之间的概率为？（已知Φ(2)=0.9772）',
  //   choices: [
  //     { content: '0.9544', isCorrect: true },
  //     { content: '0.9772', isCorrect: false },
  //     { content: '0.4772', isCorrect: false },
  //     { content: '0.0456', isCorrect: false }
  //   ],
  //   analysis: '已知X~N(10,0.04)，即μ=10，σ=0.2（因为σ²=0.04）。计算标准化变量Z=(X-μ)/σ。当X=9.6时，Z=(9.6-10)/0.2=-2；当X=10.4时，Z=(10.4-10)/0.2=2。因此P(9.6<X<10.4)=P(-2<Z<2)=Φ(2)-Φ(-2)=2Φ(2)-1=2×0.9772-1=0.9544。',
  //   knowledgePoint: '一般正态分布、标准化变换、概率计算',
  //   difficulty: '困难',
  //   lastResult: null,
  // },
  // {
  //   id: 20,
  //   category: '2.1 随机变量及其分布函数',
  //   content: '设随机变量X的分布律为：X=0时P=0.2，X=1时P=0.5，X=2时P=0.3。则其分布函数F(1.5)的值为？',
  //   choices: [
  //     { content: '0.2', isCorrect: false },
  //     { content: '0.5', isCorrect: false },
  //     { content: '0.7', isCorrect: true },
  //     { content: '1', isCorrect: false }
  //   ],
  //   analysis: '分布函数F(x)=P(X≤x)。对于x=1.5，X≤1.5包括X=0和X=1两种情况，因此F(1.5)=P(X=0)+P(X=1)=0.2+0.5=0.7。离散型随机变量的分布函数是阶梯形函数，在可能取值点处发生跳跃。',
  //   knowledgePoint: '离散型随机变量的分布函数、分布律与分布函数的关系',
  //   difficulty: '简单',
  //   lastResult: null,
  // }
]);

export type { Question, QuestionChoice };

// 章节题目映射
export const questionSectionMap: { [key: string]: Question[] } = {
  '1.1': chapter1Section1Questions.value,
  '1.2': chapter1Section2Questions.value,
  '2.1': chapter2Section1Questions.value
};