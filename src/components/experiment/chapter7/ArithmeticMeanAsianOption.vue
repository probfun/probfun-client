<script setup>
import Plotly from 'plotly.js-dist';
import { onMounted, reactive, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = ref(`
## **蒙特卡洛模拟计算算术平均亚式看涨期权价格**

在某些金融场景中，期权的收益不仅取决于**到期日的价格**，还依赖于**整个存续期间的价格轨迹**。这就是亚式期权（Asian Option）的特点。最常见的一种是**算术平均亚式看涨期权（Arithmetic Average Asian Call Option）**，它的定价较为复杂，但可以通过\\*\\*蒙特卡洛模拟（Monte Carlo Simulation）\\*\\*进行数值估计。

---

### **核心思想：**

算术平均亚式看涨期权赋予持有者在到期日以预定的**行权价**购买**标的资产在整个存续期价格的算术平均值**所对应的收益（如果有的话）。与欧式看涨期权不同，亚式期权通过平均价格来减少波动性带来的风险，因此更加稳定。

**定价目标：**
模拟大量标的资产价格路径，计算每条路径下算术平均价格对应的期权收益，最后取平均来估计其现值。

---

### **输入变量（与欧式期权类似）：**

1. **标的资产当前价格 (S)**：初始时刻的股票价格。
2. **行权价格 (K)**：期权规定的购买价格。
3. **到期时间 (T)**：期权的总期限，通常以年为单位。
4. **无风险利率 (r)**：折现未来现金流时使用的无风险利率。
5. **波动率 (\\$\\sigma\\$)**：标的资产价格的年化波动程度。
6. **模拟路径数 (N)**：用于蒙特卡洛模拟的路径数量，越多越精确。
7. **时间步数 (M)**：每条路径中的时间分割点数，决定了平均价格的精度。

---

### **模型假设（简化）：**

* 标的资产价格服从几何布朗运动。
* 市场无摩擦，利率恒定。
* 资产价格变化是连续且随机的。
* 无套利市场。

---

### **定价方法（核心公式）：**

由于算术平均下无法得到解析解，我们使用**蒙特卡洛模拟**来近似：

1. **模拟多个资产价格路径**，每条路径分为 \\$M\\$ 步，计算每条路径的算术平均价格：
   $A = \\frac{1}{M} \\sum_{i=1}^M S_i$
   其中 \\$S\\_i\\$ 为每一步的模拟价格。

2. **计算每条路径下的期权收益**：
   $\\text{Payoff} = \\max(A - K, 0)$

3. **对所有路径的收益取平均并贴现到当前时刻**：
   $C = e^{-rT} \\cdot \\frac{1}{N} \\sum_{j=1}^N \\text{Payoff}_j$

---

### **直观理解：**

* **算术平均**让期权价格更加“平滑”，对短期价格剧烈波动不敏感。
* **蒙特卡洛模拟**则是一种“以量取胜”的方法，通过大量随机路径模拟未来的可能性。
* 贴现的过程体现了“未来的钱不如现在的钱值钱”。

---

### **重要性：**

亚式期权广泛应用于商品、能源和外汇市场，尤其适用于那些价格波动剧烈但又需要长期对冲的场景。蒙特卡洛模拟方法灵活性高、适应性强，是处理无法解析求解的复杂金融衍生品的重要数值工具。尽管计算量大，但随着计算能力的提升，它在金融工程中的应用越来越广泛。

`);

// 初始化参数
const params = reactive({
  S0: 100,
  K: 100,
  T: 1.0,
  r: 0.05,
  sigma: 0.2,
  simulations: 10000,
  timeSteps: 252,
  optionType: 'call',
  averageType: 'arithmetic',
});

// 计算结果
const results = reactive({
  price: '-',
  stderr: '-',
  calcTime: '-',
});

// 加载状态
const isLoading = ref(false);

// 控制固定执行价格输入框的显示
const _showFixedStrike = ref(false);

// 绑定滑块事件
document.querySelectorAll('input[type="range"], select').forEach((element) => {
  element.addEventListener('input', function () {
    const id = this.id;
    const value = this.type === 'range' ? Number.parseFloat(this.value) : this.value;
    params[id] = value;
    if (this.type === 'range') {
      document.getElementById(`${id}-value`).textContent
        = ['r', 'sigma'].includes(id) ? value.toFixed(2) : value;
    }

    // 显示/隐藏固定执行价格滑块
    if (id === 'option-type') {
      const showFixed = value.startsWith('fixed');
      document.getElementById('fixed-strike-container').style.display
        = showFixed ? 'block' : 'none';
    }
  });
});

// 工具函数
function generateRandomNormals(n) {
  const randoms = Array.from({ length: n });
  for (let i = 0; i < n; i += 2) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    randoms[i] = z0;
    if (i + 1 < n)
      randoms[i + 1] = z1;
  }
  return randoms;
}

const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

function std(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
}

// 蒙特卡洛模拟计算
async function calculateOptionPrice() {
  const startTime = performance.now();
  isLoading.value = true;

  try {
    const { S0, K, T, r, sigma, simulations, timeSteps, optionType, averageType } = params;

    const dt = T / timeSteps;
    const discount = Math.exp(-r * T);

    // 生成随机数
    const z = generateRandomNormals(simulations * timeSteps);

    // 计算价格路径和极值
    const paths = Array.from({ length: simulations });
    const averages = Array.from({ length: simulations });
    const payoffs = Array.from({ length: simulations });

    for (let i = 0; i < simulations; i++) {
      paths[i] = Array.from({ length: timeSteps + 1 });
      paths[i][0] = S0;

      // 计算路径
      for (let j = 1; j <= timeSteps; j++) {
        const idx = i * timeSteps + (j - 1);
        paths[i][j] = paths[i][j - 1] * Math.exp(
          (r - 0.5 * sigma * sigma) * dt
          + sigma * Math.sqrt(dt) * z[idx],
        );

        // 计算平均值
        if (averageType === 'arithmetic') {
          // 算术平均
          let sum = 0;
          for (let j = 1; j <= timeSteps; j++) {
            sum += paths[i][j];
          }
          averages[i] = sum / timeSteps;
        }
        else {
          // 几何平均
          let product = 1;
          for (let j = 1; j <= timeSteps; j++) {
            product *= paths[i][j];
          }
          averages[i] = product ** (1 / timeSteps);
        }
      }

      // 计算收益
      if (optionType === 'call') {
        payoffs[i] = Math.max(averages[i] - K, 0);
      }
      else {
        payoffs[i] = Math.max(K - averages[i], 0);
      }
    }

    // 计算统计量
    results.price = (discount * mean(payoffs)).toFixed(4);
    results.stderr = (discount * std(payoffs) / Math.sqrt(simulations)).toFixed(6);
    results.calcTime = `${((performance.now() - startTime) / 1000).toFixed(2)}秒`;

    // 更新图表
    updateCharts(paths, averages);
  }
  catch (error) {
    console.error('计算期权价格时发生错误:', error);
  }
  finally {
    isLoading.value = false;
  }
}

// 更新图表
function updateCharts(paths, averages) {
  const { timeSteps, T } = params;
  const timePoints = Array.from({ length: timeSteps + 1 }, (_, i) => i * T / timeSteps);

  // 选择部分路径显示 (最多20条)
  const displayPaths = Math.min(20, paths.length);
  const pathTraces = [];

  for (let i = 0; i < displayPaths; i++) {
    pathTraces.push({
      x: timePoints,
      y: paths[i],
      type: 'line',
      line: { color: 'rgba(0, 128, 255, 0.5)', width: 1 },
      name: `路径 ${i + 1}`,
      showlegend: false,
      hoverinfo: 'none',
    });

    // 添加平均价格线
    pathTraces.push({
      x: timePoints,
      y: Array.from({ length: timeSteps + 1 }).fill(averages[0]),
      mode: 'lines',
      line: { color: 'red', width: 2 },
      name: '平均价格',
    });

    // 绘制价格路径图
    Plotly.newPlot('paths-chart', [...pathTraces], {
      title: '蒙特卡洛模拟路径及平均价格',
      xaxis: { title: '时间 (年)' },
      yaxis: { title: '标的资产价格' },
      margin: { t: 40, l: 50, r: 30, b: 50 },
      showlegend: true,
    });

    // 绘制平均价格直方图
    const histogramTrace = {
      x: averages,
      type: 'histogram',
      marker: { color: 'rgba(100,200,100,0.7)' },
      name: '平均价格分布',
    };

    const shapes = [{
      type: 'line',
      x0: params.K,
      y0: 0,
      x1: params.K,
      y1: 1,
      yref: 'paper',
      line: { color: 'red', width: 2, dash: 'dash' },
    }];

    Plotly.newPlot('histogram-chart', [histogramTrace], {
      title: '平均价格分布',
      xaxis: { title: '平均价格' },
      yaxis: { title: '频数' },
      margin: { t: 40, l: 50, r: 30, b: 50 },
      shapes,
    });
  }

  // 选项类型改变处理函数
  // function handleOptionTypeChange() {
  //   showFixedStrike.value = params.optionType.startsWith('fixed');
  // }
}
// 初始化计算
onMounted(() => {
  // 初始化
  calculateOptionPrice();
});
</script>

<template>
  <ExperimentBoard :panel-size="70">
    <template #experiment>
      <div class="bg-blue-50 rounded-lg p-5 shadow-md">
        <h3 class="text-xl font-semibold mb-4">
          计算结果
        </h3>
        <table class="w-full">
          <thead>
            <tr>
              <th class="bg-blue-500 text-white px-4 py-2 text-left">
                指标
              </th>
              <th class="bg-blue-500 text-white px-4 py-2 text-left">
                值
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">
                期权价格
              </td>
              <td class="border-b border-gray-200 px-4 py-2">
                {{ results.price }}
              </td>
            </tr>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">
                标准误差
              </td>
              <td class="border-b border-gray-200 px-4 py-2">
                {{ results.stderr }}
              </td>
            </tr>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">
                计算时间
              </td>
              <td class="border-b border-gray-200 px-4 py-2">
                {{ results.calcTime }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="bg-blue-50 p-4 rounded-lg mt-5">
          <h4 class="font-semibold mb-2">
            关于亚式期权:
          </h4>
          <p class="mb-2">
            亚式期权的收益取决于标的资产在期权有效期内的平均价格(而非到期价格)。
          </p>
          <p class="mb-2">
            <strong>算术平均</strong>亚式期权没有解析解，必须使用数值方法(如蒙特卡洛)定价。
          </p>
          <p class="mb-2">
            <strong>几何平均</strong>亚式期权有解析解，可作为算术平均期权的控制变量。
          </p>
        </div>

        <div class="flex-[2] min-w-[600px] mt-5">
          <div id="paths-chart" class="h-[400px] mb-5" />
          <div id="extrema-chart" class="h-[400px]" />
        </div>
      </div>
    </template>
    <template #parameter>
      <div class="flex flex-wrap gap-5">
        <div class="flex-1 min-w-[300px] bg-gray-50 p-5 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">
            参数设置
          </h2>

          <div class="mb-4">
            <label class="block mb-1 font-medium">初始价格 (S₀): <span>{{ params.S0 }}</span></label>
            <input v-model.number="params.S0" type="range" min="50" max="150" step="1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">执行价格 (K): <span>{{ params.K }}</span></label>
            <input v-model.number="params.S0" type="range" min="50" max="150" step="1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">到期时间 (T, 年): <span>{{ params.T.toFixed(1) }}</span></label>
            <input v-model.number="params.T" type="range" min="0.1" max="3" step="0.1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">无风险利率 (r): <span>{{ params.r.toFixed(2) }}</span></label>
            <input v-model.number="params.r" type="range" min="0" max="0.2" step="0.01" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">波动率 (σ): <span>{{ params.sigma.toFixed(2) }}</span></label>
            <input v-model.number="params.sigma" type="range" min="0.1" max="0.5" step="0.01" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">模拟路径数: <span>{{ params.simulations }}</span></label>
            <input v-model.number="params.simulations" type="range" min="1000" max="50000" step="1000" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">时间步数: <span>{{ params.timeSteps }}</span></label>
            <input v-model.number="params.timeSteps" type="range" min="10" max="500" step="1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">期权类型:</label>
            <select
              v-model="params.optionType" class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="call">
                看涨 (Call)
              </option>
              <option value="put">
                看跌 (Put)
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">平均类型:</label>
            <select
              v-model="params.optionType" class="w-full p-2 border border-gray-300 rounded"
            >
              <option value="arithmetic">
                算术平均
              </option>
              <option value="geometric">
                几何平均
              </option>
            </select>
          </div>

          <button
            :disabled="isLoading" class="w-full mt-4 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-base rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            @click="calculateOptionPrice"
          >
            计算期权价格
          </button>

          <div v-if="isLoading" class="text-center py-2.5 text-blue-500">
            计算中，请稍候...
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
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* Only essential styles that can't be handled by Tailwind */
</style>
