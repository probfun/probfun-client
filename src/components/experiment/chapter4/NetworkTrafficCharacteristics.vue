<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

// 响应式数据
const currentScenario = ref('normal');
const currentTimestamp = ref('');
const trafficCanvas = ref(null);
const autocorrelationCanvas = ref(null);
const chartsLoaded = ref(false);
const chartError = ref(null);
const chartJSLoaded = ref(false);

let trafficChart = null;
let autocorrelationChart = null;
let timestampInterval = null;
let loadAttempts = 0;
const maxLoadAttempts = 3;

// Chart.js动态加载函数 - 改进版
function loadChartJS() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (typeof window.Chart !== 'undefined') {
      chartJSLoaded.value = true;
      resolve(window.Chart);
      return;
    }

    // 检查是否已经有脚本标签在加载
    const existingScript = document.querySelector('script[src*="chart"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (typeof window.Chart !== 'undefined') {
          chartJSLoaded.value = true;
          resolve(window.Chart);
        }
        else {
          reject(new Error('Chart.js loaded but not available'));
        }
      });
      return;
    }

    const script = document.createElement('script');
    // 使用更稳定的Chart.js版本
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js';
    script.async = true;

    script.onload = () => {
      // 等待一小段时间确保Chart.js完全初始化
      setTimeout(() => {
        if (typeof window.Chart !== 'undefined') {
          chartJSLoaded.value = true;
          resolve(window.Chart);
        }
        else {
          reject(new Error('Chart.js loaded but not available'));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Chart.js'));
    };

    // 设置超时
    setTimeout(() => {
      if (!chartJSLoaded.value) {
        reject(new Error('Chart.js loading timeout'));
      }
    }, 10000);

    document.head.appendChild(script);
  });
}

// 静态数据
const features = ['源IP计数', '目的IP计数', '端口号计数', '数据包大小', '流量速率'];

const correlationMatrix = ref([
  [1.00, 0.85, 0.62, 0.45, 0.78],
  [0.85, 1.00, 0.55, 0.38, 0.72],
  [0.62, 0.55, 1.00, 0.68, 0.58],
  [0.45, 0.38, 0.68, 1.00, 0.42],
  [0.78, 0.72, 0.58, 0.42, 1.00],
]);

const content = ref(`
## **网络流量分析与异常检测系统**

特征相关系数矩阵（Feature Correlation Matrix）是该系统的**数学心脏**和**检测逻辑的基石**。它远不止是一个简单的显示指标，而是一个驱动整个检测过程的动态计算模型。

它的核心作用体现在以下**三个**层面：

---

### **一、根本性作用：量化特征间的动力学关系**

网络流量不是多个孤立指标的集合，而是一个由多个相互关联、相互影响的动态特征构成的复杂系统。相关系数矩阵使用数学语言精确地描述了这种关系。

**1. 数学定义：**
对于特征 $X$（如用户数量）和特征 $Y$（如流量速率），其相关系数 $\\rho_{XY}$ 的计算公式为：
$$
\\rho_{XY} = \\frac{\\text{cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{\\mathbb{E}[(X - \\mu_X)(Y - \\mu_Y)]}{\\sigma_X \\sigma_Y}
$$

其中：$\\text{cov}(X, Y)$ 是协方差, $\\sigma$ 是标准差, $\\mu$ 是均值, $\\mathbb{E}$ 是期望值

**2. 物理意义：**
- $\\rho_{XY} \\approx 1$：强正相关。用户数量增加时，流量速率也同步增加。
- $\\rho_{XY} \\approx -1$：强负相关。数据包大小增加时，可能每秒包数下降。
- $\\rho_{XY} \\approx 0$：无线性关系。两个特征变化互不影响。

**您提供的矩阵中：**
- 源IP计数 vs 流量速率 的相关系数从 0.48 到 0.72，这表明它们是中等到较强的正相关关系，符合预期。
- 其他特征间的不同系数值共同构成了系统正常运行的“指纹”或“基线模式”。

---

### **二、核心应用：基于多元统计的异常检测**

这是相关系数矩阵最关键的应用。系统的检测逻辑不是基于单个特征的阈值，而是基于**特征间关系模式是否被破坏**。

**1. 建立正常基线（Profiling）：**
系统首先在正常流量期间学习并计算出一个**基准相关系数矩阵** $\\Sigma_{\\text{normal}}$。这代表了“健康”状态下网络流量各特征之间的内在关系。

**2. 实时检测异常（Detection）：**
系统会以一个滑动窗口（例如，过去5分钟）为单位，实时计算一个**当前相关系数矩阵** $\\Sigma_{\\text{current}}$。

**3. 计算差异度（Deviation Measurement）：**
通过比较当前矩阵与基准矩阵的差异来检测异常。一个关键的工具是**马氏距离（Mahalanobis Distance）**，它本质上是考虑了特征相关性的距离度量。

马氏距离的计算公式为：
$$
D_M(\\mathbf{X}) = \\sqrt{(\\mathbf{X} - \\mathbf{\\mu})^T \\Sigma^{-1} (\\mathbf{X} - \\mathbf{\\mu})}
$$
其中 $\\Sigma^{-1}$ 是协方差矩阵（与相关系数矩阵紧密相关）的逆。当特征间关系异常时，$D_M$ 值会显著增大。

---

### **三、具体场景中的诊断作用（示例）**

结合您图片中的场景，相关系数矩阵的变化如何揭示特定攻击：

**1.DDoS攻击**: 用户数量 ⬄ 流量速率：强正相关($\\rho \\approx 0.7$), 攻击来自大量傀儡机（用户数↑），但目标服务瘫痪，有效响应数据很少（流量速率↓）。  **正相关减弱甚至变为负相关**。例如，$\\rho$ 从 0.7 骤降到 0.1 或 -0.2。系统检测到这种关系“断裂”，立即触发警报。

**2.端口扫描**: 数据大小 ⬄ 流量速率：较弱相关($\\rho \\approx 0.2$), 扫描者发送大量小数据包（数据大小↓，包速率↑）。  **出现异常的强负相关**。$\\rho$ 从 0.2 变为 -0.8。这种反常的、强烈的特征关系是扫描的典型标志。

**3.数据外泄 (Exfiltration)**: 数据类型 ⬄ 数据大小：关系稳定，攻击者持续传输特定类型（如压缩文件）的大批量数据。 **相关性模式发生突变**。原本稳定的关系被一种新的、持续的强相关模式所取代。系统识别到这种“模式迁移”，判断为异常。

### 总结：为什么它不可或缺？

1.  **超越单维阈值：** 传统基于单一特征阈值（如“CPU利用率>90%”）的方法极易误报和漏报。相关系数矩阵引入了**上下文感知**，只有特征间的关系违背了历史模式才报警，准确性极高。
2.  **早期预警：** 在某些攻击的早期阶段，单个特征可能仍在正常范围内，但它们之间的**关系已经开始瓦解**。矩阵分析能在攻击全面爆发前提供早期预警。
3.  **攻击分类与诊断：** 不同的攻击会以独特的方式扭曲相关系数矩阵。分析矩阵的变化模式不仅能够发现异常，还能帮助安全分析师**初步判断攻击类型**。
4.  **降维与去冗余：** 通过分析矩阵，可以发现高度相关的特征对。这有助于在建模时进行降维处理，去除冗余信息，提高模型效率和泛化能力。

综上所述，特征相关系数矩阵将网络流量从一个多指标的集合，提升为一个**相互关联的生态系统**。异常检测的核心任务就是从**维护这个系统的稳定关系**的角度出发，任何导致这种关系失衡的行为，无论其单个指标看起来多么正常，都会被判定为异常。这是现代智能流量检测系统区别于传统规则引擎的根本所在。


---

### **深化对特征相关系数矩阵的理解**

#### **问题一：相关系数矩阵捕捉的是线性关系，网络流量中的非线性依赖关系该如何处理？**



**深化分析**：
1.  **非线性扩展**：成熟的系统不会仅依赖一种指标。我们会并行计算其他类型的相关性度量：
    *   **互信息 (Mutual Information)**：基于信息论，能够捕捉任意形式的统计依赖关系，包括非线性的。公式为:
    $$
    I(X;Y) = \\sum_{y \\in Y} \\sum_{x \\in X} p(x,y) \\log(\\frac{p(x,y)}{p(x)p(y)})
    $$
    *   它的值越大，表明两个变量的关联越紧密，无论其形式如何。
    *   **最大信息系数 (MIC)**：一种更强大的非参数统计方法，用于检测变量间的广泛功能性关联。
2.  **实战策略**：在实际系统中，**Pearson相关系数因其计算效率高、解释性强，常作为第一道快速检测的关卡**。当Pearson系数未发现异常，但其他检测模块（如流量总量异常）告警时，我们会启动计算成本更高的互信息等指标进行深度分析，以避免漏报。

#### **问题二：网络流量具有显著的周期性（如白天/夜晚），一个静态的“正常”基线矩阵是否足够？**

（将理论应用于实践时最常见的错误——使用僵化的基线。一个全局静态基线必然导致高误报率。）

**深化分析**：
1.  **多时间尺度基线**：专家系统会构建一个**动态基线库**。这意味着系统会为不同时间段学习并存储不同的正常矩阵：
    *   $\\Sigma_{\\text{workday-morning}}$
    *   $\\Sigma_{\\text{workday-afternoon}}$
    *   $\\Sigma_{\\text{weekend-night}}$
    *   ...
    *   实时检测时，系统会选取当前时间对应的历史基线进行比较。
2.  **在线学习与自适应**：对于业务增长或网络结构缓慢变化带来的“概念漂移”（Concept Drift），最佳实践是采用**加权滑动窗口**或**指数衰减**模型来更新基线。最近的流量数据拥有更高权重，使得基线能够缓慢演化，适应新常态，而不需要人工干预。

#### **问题三：高维特征下的相关系数矩阵计算逆矩阵（$Σ^{-1}$）开销巨大，如何保证实时性？**


**深化分析**：
1.  **降维技术**：在执行检测前，使用**主成分分析（PCA）** 或**自编码器（Autoencoder）** 对原始特征进行降维。在低维空间计算相关矩阵和马氏距离，计算量大幅下降。
2.  **增量计算**：绝不重复计算整个矩阵。采用**Welford等在线算法**，对均值和协方差进行增量更新。每到来一个新的数据窗口，只需基于旧结果和新区间进行少量计算即可得到新的相关系数矩阵，效率极高。
3.  **近似计算**：对于大规模网络，有时会采用随机投影（Random Projection）等近似计算方法来估计相关关系，以时间换空间。

#### **问题四：一次攻击可能导致大量特征关系同时异常，如何避免“警报风暴”并精准定位根因？**

（检测只是第一步，让警报可操作、可调查才是最终目的。）

**深化分析**：
1.  **警报聚合与根因分析**：系统不会为每一个失调的相关系数都发送一条独立警报。而是会使用**图模型**，将本次检测中所有异常的关系变化点构建成一个“异常关系图”。
2.  **中心性分析**：在这个图中，计算每个特征节点的**度中心性**或**特征向量中心性**。那些连接了大量其他异常关系的特征，很可能就是本次攻击的**根因或关键影响点**。例如，一次DDoS攻击可能使得“源IP数量”这个特征与几乎所有其他特征的关系都出现异常，那么它就会被识别为根因特征，系统最终聚合生成一条：“检测到以【源IP数量】为核心的网络关系异常，疑似DDoS攻击”的精准警报。

#### **问题五：相关系数矩阵告诉我们“关系变了”，但如何让安全分析师相信并理解“为什么这是攻击”？**

**深化分析**：
1.  **可解释性AI（XAI）集成**：将相关系数矩阵的变化作为特征，输入到可解释性框架（如SHAP或LIME）中。这些框架可以量化每一个关系变化对最终“异常”判定结果的贡献度。
2.  **生成可读报告**：系统可以自动生成分析结论，例如：“此次警报92%的置信度由以下变化贡献：用户数量-流量速率的正相关性下降70%（贡献度50%），数据大小-包速率出现强负相关（贡献度30%）... 该模式与历史端口扫描攻击案例匹配度85%。” 这样的报告使得分析师能够快速理解警报背后的逻辑，并采取精准的应对措施。


`);

// 计算属性
const anomalyStatus = computed(() => {
  const statusMap = {
    normal: '正常状态',
    ddos: 'DDoS攻击检测',
    scan: '端口扫描检测',
    worm: '蠕虫爆发检测',
  };
  return statusMap[currentScenario.value];
});

const anomalyIndicatorClass = computed(() => {
  const classMap = {
    normal: 'bg-green-100 text-green-800',
    ddos: 'bg-red-100 text-red-800 animate-pulse',
    scan: 'bg-yellow-100 text-yellow-800 animate-pulse',
    worm: 'bg-purple-100 text-purple-800 animate-pulse',
  };
  return classMap[currentScenario.value];
});

const networkStatus = computed(() => {
  const statusMap = {
    normal: '正常运行',
    ddos: 'DDoS攻击进行中',
    scan: '端口扫描活动',
    worm: '蠕虫传播中',
  };
  return statusMap[currentScenario.value];
});

const statusTextColor = computed(() => {
  const colorMap = {
    normal: '#10b981',
    ddos: '#ef4444',
    scan: '#f59e0b',
    worm: '#8b5cf6',
  };
  return colorMap[currentScenario.value];
});

const statusDotClass = computed(() => {
  return currentScenario.value === 'normal'
    ? 'bg-green-500'
    : 'bg-red-500 animate-ping';
});

const scenarioDescription = computed(() => {
  const descriptions = {
    normal: '正常网络流量模式，各项指标在正常范围内波动，特征间相关性稳定。',
    ddos: 'DDoS攻击模式，大量恶意流量同时访问少数目标，源IP激增但目标IP集中。',
    scan: '端口扫描模式，攻击者系统性地探测目标端口，端口访问模式异常。',
    worm: '蠕虫传播模式，恶意软件在网络中传播，感染主机数量逐步增加。',
  };
  return descriptions[currentScenario.value];
});

// 方法
function scenarioButtonClass(scenario) {
  return currentScenario.value === scenario
    ? 'border-blue-500 bg-blue-50 text-blue-700'
    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300';
}

function getMatrixCellColor(value, isDiagonal) {
  if (isDiagonal) {
    return '#6b7280'; // gray-500
  }

  if (value > 0.7) {
    return `rgba(16, 185, 129, ${0.6 + value * 0.4})`; // green with opacity based on value
  }
  else if (value > 0.4) {
    return `rgba(245, 158, 11, ${0.6 + (value - 0.4) * 1.3})`; // yellow
  }
  else {
    return `rgba(239, 68, 68, ${0.6 + (0.4 - value) * 1.5})`; // red
  }
}

function setScenario(scenario) {
  currentScenario.value = scenario;
  updateCorrelationMatrix();

  // 只有在图表已初始化后才更新
  if (chartsLoaded.value && !chartError.value) {
    updateCharts();
  }
}

function updateTimestamp() {
  const now = new Date();
  currentTimestamp.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function generateTrafficData(scenario) {
  const data = {
    srcIP: [],
    destIP: [],
    trafficRate: [],
  };

  // 生成24小时的时间标签
  const timeLabels = [];
  for (let i = 0; i < 24; i++) {
    timeLabels.push(`${String(i).padStart(2, '0')}:00`);
  }

  // 基础正常数据
  for (let i = 0; i < 24; i++) {
    data.srcIP.push(Math.floor(Math.random() * 200 + 300));
    data.destIP.push(Math.floor(Math.random() * 150 + 200));
    data.trafficRate.push(Math.floor(Math.random() * 200 + 300));
  }

  // 根据场景修改数据
  if (scenario === 'ddos') {
    for (let i = 18; i < 24; i++) {
      data.srcIP[i] = Math.floor(Math.random() * 1000 + 1500);
      data.destIP[i] = Math.floor(Math.random() * 10 + 5);
      data.trafficRate[i] = Math.floor(Math.random() * 800 + 1200);
    }
  }
  else if (scenario === 'scan') {
    for (let i = 16; i < 24; i++) {
      data.srcIP[i] = Math.floor(Math.random() * 100 + 150);
      data.destIP[i] = Math.floor(Math.random() * 500 + 300);
      data.trafficRate[i] = Math.floor(Math.random() * 100 + 150);
    }
  }
  else if (scenario === 'worm') {
    for (let i = 10; i < 24; i++) {
      const factor = Math.min(1, (i - 10) / 5);
      data.srcIP[i] = Math.floor((Math.random() * 200 + 300) * (1 + factor * 2));
      data.destIP[i] = Math.floor((Math.random() * 150 + 200) * (1 + factor * 1.5));
      data.trafficRate[i] = Math.floor((Math.random() * 200 + 300) * (1 + factor * 3));
    }
  }

  return { data, timeLabels };
}

function generateAutocorrelationData(scenario) {
  const scenarios = {
    normal: [0.85, 0.72, 0.62, 0.55, 0.48, 0.42, 0.38, 0.35],
    ddos: [0.92, 0.35, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02],
    scan: [0.78, 0.68, 0.75, 0.62, 0.58, 0.65, 0.55, 0.52],
    worm: [0.88, 0.82, 0.78, 0.75, 0.72, 0.68, 0.65, 0.62],
  };
  return scenarios[scenario] || scenarios.normal;
}

function updateCorrelationMatrix() {
  const matrices = {
    normal: [
      [1.00, 0.85, 0.62, 0.45, 0.78],
      [0.85, 1.00, 0.55, 0.38, 0.72],
      [0.62, 0.55, 1.00, 0.68, 0.58],
      [0.45, 0.38, 0.68, 1.00, 0.42],
      [0.78, 0.72, 0.58, 0.42, 1.00],
    ],
    ddos: [
      [1.00, 0.25, 0.18, 0.12, 0.92],
      [0.25, 1.00, 0.15, 0.10, 0.28],
      [0.18, 0.15, 1.00, 0.65, 0.20],
      [0.12, 0.10, 0.65, 1.00, 0.15],
      [0.92, 0.28, 0.20, 0.15, 1.00],
    ],
    scan: [
      [1.00, 0.72, 0.85, 0.38, 0.65],
      [0.72, 1.00, 0.60, 0.32, 0.58],
      [0.85, 0.60, 1.00, 0.75, 0.55],
      [0.38, 0.32, 0.75, 1.00, 0.35],
      [0.65, 0.58, 0.55, 0.35, 1.00],
    ],
    worm: [
      [1.00, 0.92, 0.68, 0.52, 0.95],
      [0.92, 1.00, 0.62, 0.48, 0.88],
      [0.68, 0.62, 1.00, 0.70, 0.65],
      [0.52, 0.48, 0.70, 1.00, 0.50],
      [0.95, 0.88, 0.65, 0.50, 1.00],
    ],
  };
  correlationMatrix.value = matrices[currentScenario.value] || matrices.normal;
}

function updateCharts() {
  if (!chartsLoaded.value || chartError.value)
    return;

  try {
    const { data: trafficData, timeLabels } = generateTrafficData(currentScenario.value);
    const autocorrData = generateAutocorrelationData(currentScenario.value);

    // 更新流量图表
    if (trafficChart) {
      trafficChart.data.labels = timeLabels;
      trafficChart.data.datasets[0].data = trafficData.srcIP;
      trafficChart.data.datasets[1].data = trafficData.destIP;
      trafficChart.data.datasets[2].data = trafficData.trafficRate;
      trafficChart.update('none'); // 使用'none'模式提高性能
    }

    // 更新自相关图表
    if (autocorrelationChart) {
      autocorrelationChart.data.datasets[0].data = autocorrData;

      // 根据场景更改颜色
      const colors = {
        normal: { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgb(16, 185, 129)' },
        ddos: { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
        scan: { bg: 'rgba(245, 158, 11, 0.7)', border: 'rgb(245, 158, 11)' },
        worm: { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' },
      };

      const color = colors[currentScenario.value];
      autocorrelationChart.data.datasets[0].backgroundColor = color.bg;
      autocorrelationChart.data.datasets[0].borderColor = color.border;
      autocorrelationChart.update('none');
    }
  }
  catch (error) {
    console.error('Error updating charts:', error);
    chartError.value = '图表更新失败';
  }
}

function destroyCharts() {
  try {
    if (trafficChart) {
      trafficChart.destroy();
      trafficChart = null;
    }
    if (autocorrelationChart) {
      autocorrelationChart.destroy();
      autocorrelationChart = null;
    }
  }
  catch (error) {
    console.warn('Error destroying charts:', error);
  }
}

async function initCharts() {
  try {
    // 确保DOM元素存在
    if (!trafficCanvas.value || !autocorrelationCanvas.value) {
      throw new Error('Canvas elements not found');
    }

    // 确保Chart.js已加载
    if (!window.Chart) {
      throw new Error('Chart.js not loaded');
    }

    // 销毁现有图表
    destroyCharts();

    // 等待DOM更新
    await nextTick();

    const Chart = window.Chart;

    // 初始化流量特征趋势图
    const { data: trafficData, timeLabels } = generateTrafficData(currentScenario.value);

    trafficChart = new Chart(trafficCanvas.value, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: '源IP计数',
            data: trafficData.srcIP,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: '目的IP计数',
            data: trafficData.destIP,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: '流量速率 (Mbps)',
            data: trafficData.trafficRate,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            yAxisID: 'y1',
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // 禁用动画提高性能
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
          },
          y: {
            position: 'left',
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: 'IP计数',
              color: '#374151',
            },
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: '流量速率 (Mbps)',
              color: '#374151',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#374151',
              usePointStyle: true,
              padding: 20,
            },
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#d1d5db',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
          },
        },
      },
    });

    // 初始化自相关图表
    const autocorrData = generateAutocorrelationData(currentScenario.value);

    autocorrelationChart = new Chart(autocorrelationCanvas.value, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [{
          label: '自相关系数',
          data: autocorrData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // 禁用动画提高性能
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1.0,
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
              stepSize: 0.2,
            },
          },
          x: {
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: '时间窗口 (分钟)',
              color: '#374151',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#d1d5db',
            borderWidth: 1,
            padding: 12,
          },
        },
      },
    });

    chartsLoaded.value = true;
    chartError.value = null;
  }
  catch (error) {
    console.error('Chart initialization failed:', error);
    chartError.value = `图表初始化失败: ${error.message}`;
    chartsLoaded.value = false;
  }
}

async function retryChartLoad() {
  loadAttempts++;
  if (loadAttempts >= maxLoadAttempts) {
    chartError.value = '图表加载失败，已达到最大重试次数';
    return;
  }

  chartError.value = null;
  chartsLoaded.value = false;

  try {
    await loadChartJS();
    await nextTick();
    await initCharts();
  }
  catch (error) {
    console.error('Retry failed:', error);
    chartError.value = `重试失败: ${error.message}`;
  }
}

// 生命周期钩子
onMounted(async () => {
  updateTimestamp();
  timestampInterval = setInterval(updateTimestamp, 1000);
  updateCorrelationMatrix();

  try {
    await loadChartJS();
    // 等待DOM完全渲染
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    await initCharts();
  }
  catch (error) {
    console.error('Failed to initialize charts:', error);
    chartError.value = `图表加载失败: ${error.message}`;
  }
});

onUnmounted(() => {
  if (timestampInterval) {
    clearInterval(timestampInterval);
  }
  destroyCharts();
});
</script>

<template>
  <ExperimentBoard :layout="1" :panel-size="50">
    <template #experiment>
      <div class="container mx-auto p-4">
        <!-- 流量特征趋势图 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              流量特征趋势
            </h3>
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="anomalyIndicatorClass"
            >
              {{ anomalyStatus }}
            </div>
          </div>
          <div class="h-80 relative">
            <canvas v-show="chartsLoaded" ref="trafficCanvas" />
            <div v-if="!chartsLoaded || chartError" class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <div v-if="!chartError" class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <div v-else class="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>{{ chartError || '正在加载图表...' }}</p>
                <button v-if="chartError" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600" @click="retryChartLoad">
                  重试
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 流量速率自相关图 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            流量速率自相关
          </h3>
          <div class="h-80 relative">
            <canvas v-show="chartsLoaded" ref="autocorrelationCanvas" />
            <div v-if="!chartsLoaded || chartError" class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <div v-if="!chartError" class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <div v-else class="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>{{ chartError || '正在加载图表...' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 特征相关系数矩阵 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            特征相关系数矩阵
          </h3>
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full">
              <div class="grid grid-cols-6 gap-1 text-sm">
                <!-- 矩阵标题行 -->
                <div class="bg-gray-100 p-3 text-center font-semibold" />
                <div
                  v-for="feature in features" :key="feature"
                  class="bg-gray-100 p-3 text-center font-semibold text-gray-700"
                >
                  {{ feature }}
                </div>

                <!-- 矩阵数据行 -->
                <template v-for="(row, rowIndex) in correlationMatrix" :key="rowIndex">
                  <div class="bg-gray-100 p-3 text-center font-semibold text-gray-700">
                    {{ features[rowIndex] }}
                  </div>
                  <div
                    v-for="(value, colIndex) in row" :key="colIndex"
                    class="p-3 text-center font-medium text-white rounded"
                    :style="{ backgroundColor: getMatrixCellColor(value, rowIndex === colIndex) }"
                  >
                    {{ value.toFixed(2) }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <div class="text-gray-600">
            {{ currentTimestamp }}
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="statusDotClass" />
            <span class="text-sm font-medium" :style="{ color: statusTextColor }">
              网络状态: {{ networkStatus }}
            </span>
          </div>
          <div class="text-gray-600">
            检测灵敏度: 高
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="container mx-auto p-4">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            场景选择
          </h3>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <button
              :class="scenarioButtonClass('normal')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('normal')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-green-500" />
                <span class="font-medium">正常流量</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('ddos')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('ddos')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-red-500" />
                <span class="font-medium">DDoS攻击</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('scan')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('scan')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-yellow-500" />
                <span class="font-medium">端口扫描</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('worm')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('worm')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-purple-500" />
                <span class="font-medium">蠕虫爆发</span>
              </div>
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">
              当前场景说明
            </h4>
            <p class="text-blue-700 text-sm">
              {{ scenarioDescription }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="network-traffic-analysis" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 添加一些自定义样式 */
.container {
  max-width: 1200px;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
