<script setup lang="ts">
import Plotly from 'plotly.js-dist';
import { onMounted, ref, watch, nextTick } from 'vue';

const props = defineProps<{
  mean1: number,
  mean2: number,
  sigma1: number,
  sigma2: number,
  density: number,
  isChart3: boolean,
  fixedX: number,
  fixedY: number,
}>();

const plotlyChart1 = ref<HTMLElement | null>(null); // 3D二维正态分布图
function createPlotlyChart1() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [props.sigma1 ** 2, props.density * props.sigma1 * props.sigma2], // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, props.sigma2 ** 2], // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  console.log(mean, cov);

  // 创建网格点
  const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  };

  const meshgrid = (x: number[], y: number[]) => {
    const X: number[][] = [];
    const Y: number[][] = [];
    for (let i = 0; i < y.length; i++) {
      X.push(x);
      Y.push(Array.from({ length: x.length }).fill(y[i]) as number[]);
    }
    return { X, Y };
  };

  const x = linspace(-10, 10, 200);
  const y = linspace(-10, 10, 200);
  const { X, Y } = meshgrid(x, y);

  // 创建二维正态分布的概率密度函数
  const rvPdf = (x: number, y: number) => {
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const invCov = [
      [cov[1][1] / det, -cov[0][1] / det],
      [-cov[1][0] / det, cov[0][0] / det],
    ];
    const diff = [x - mean[0], y - mean[1]];
    const expTerm = -0.5 * (diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1])
      + diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]));
    const norm = 2 * Math.PI * Math.sqrt(det);
    return Math.exp(expTerm) / norm;
  };

  const Z = X.map((row, i) => row.map((_, j) => rvPdf(X[i][j], Y[i][j])));

  // 计算边缘分布
  const normPdf = (x: number[], mean: number, stddev: number) => {
    return x.map((xVal) => {
      return (1 / Math.sqrt(2 * Math.PI * stddev ** 2)) * Math.exp(-0.5 * ((xVal - mean) / stddev) ** 2);
    });
  };

  const marginalX = normPdf(x, mean[0], Math.sqrt(cov[0][0]));
  const marginalY = normPdf(y, mean[1], Math.sqrt(cov[1][1]));

  // 创建图表
  const data = [
    {
      type: 'surface',
      z: Z,
      x: X, // 使用 X 和 Y 作为二维网格
      y: Y, // 使用 X 和 Y 作为二维网格
      colorscale: 'Viridis',
      opacity: 0.7,
      showscale: false, // 完全隐藏颜色条
    },
    {
      type: 'scatter3d',
      mode: 'lines',
      x,
      y: Array.from({ length: x.length }).fill(-3),
      z: marginalX,
      name: 'Marginal X',
      line: { color: 'blue' },
    },
    {
      type: 'scatter3d',
      mode: 'lines',
      x: Array.from({ length: y.length }).fill(7),
      y,
      z: marginalY,
      name: 'Marginal Y',
      line: { color: 'red' },
    },
  ];

  // 设置布局
  const layout = {
    scene: {
      xaxis: { title: '' },
      yaxis: { title: '' },
      zaxis: { title: 'Probability Density' },
    },
    margin: {
      t: 0,  // 顶部空白
      b: 30,  // 底部空白
      l: 30,  // 左侧空白
      r: 30,  // 右侧空白
    },
    title: '',
    showlegend: false,
  };
  const config = {
    displayModeBar: false,  // 禁用交互菜单
  };
  // 渲染图表
  if (plotlyChart1.value) {
    Plotly.react(plotlyChart1.value, data, layout, config);
  }
}

const plotlyChart2 = ref<HTMLElement | null>(null); // X的边缘分布图表
function createPlotlyChart2() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [props.sigma1 ** 2, props.density * props.sigma1 * props.sigma2], // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, props.sigma2 ** 2], // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  // 创建网格点
  const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  };

  const x = linspace(-10, 10, 200);

  // 计算边缘分布
  const normPdf = (x: number[], mean: number, stddev: number) => {
    return x.map((xVal) => {
      return (1 / Math.sqrt(2 * Math.PI * stddev ** 2)) * Math.exp(-0.5 * ((xVal - mean) / stddev) ** 2);
    });
  };

  const marginalX = normPdf(x, mean[0], Math.sqrt(cov[0][0]));

  // 创建柱状图数据
  const data = [
    {
      type: 'bar',
      x: x,
      y: marginalX,
      name: 'Marginal X',
      marker: { color: 'rgba(255, 0, 0, 0.9)' },
    },
  ];
 
  // 设置布局
  const layout = {
    xaxis: { title: '' },
    yaxis: { title: '' },
    margin: {
      t: 0,  // 顶部空白
      b: 30,  // 底部空白
      l: 50,  // 左侧空白
      r: 30,  // 右侧空白
    },
    title: '',
  };

  const config = {
    displayModeBar: false, // 禁用交互菜单
  };

  // 渲染图表
  if (plotlyChart2.value) {
    Plotly.react(plotlyChart2.value, data, layout, config);
  }
}

const plotlyChart3 = ref<HTMLElement | null>(null); // 二维正态分布样本散点图
function createPlotlyChart3() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [props.sigma1 ** 2, props.density * props.sigma1 * props.sigma2], // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, props.sigma2 ** 2], // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  // 手动计算协方差矩阵的 Cholesky 分解
  function choleskyDecomposition(cov: number[][]) {
    const L = [
      [0, 0],
      [0, 0],
    ];
    // Cholesky 分解：L * L^T = Cov
    L[0][0] = Math.sqrt(cov[0][0]);
    L[1][0] = cov[1][0] / L[0][0];
    L[1][1] = Math.sqrt(cov[1][1] - L[1][0] * L[1][0]);
    return L;
  }

  // 使用 Cholesky 分解生成二维正态分布样本
  function generateBivariateNormalSamples(n: number, mean: number[], cov: number[][]) {
    const samples = [];
    const L = choleskyDecomposition(cov); // 获取 Cholesky 分解的矩阵
    for (let i = 0; i < n; i++) {
      // 生成标准正态分布样本
      const z = [Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()), Math.sqrt(-2 * Math.log(Math.random())) * Math.sin(2 * Math.PI * Math.random())];
      const x = mean[0] + L[0][0] * z[0] + L[0][1] * z[1]; // 计算 x 样本
      const y = mean[1] + L[1][0] * z[0] + L[1][1] * z[1]; // 计算 y 样本
      samples.push([x, y]);
    }
    return samples;
  }

  // 生成 500 个样本点
  const n = 2000;
  const samples = generateBivariateNormalSamples(n, mean, cov);

  // 将样本点分解为 x 和 y 坐标
  const x = samples.map(point => point[0]);
  const y = samples.map(point => point[1]);

  // 创建散点图数据
  const data = [
    {
      type: 'scatter',
      mode: 'markers',
      x,
      y,
      name: 'Samples',
      marker: {
        color: 'rgba(255, 0, 0, 0.5)',
        size: 10,
      },
    },
  ];

  // 设置布局
  const layout = {
    margin: {
      t: 30,  // 顶部空白
      b: 30,  // 底部空白
      l: 50,  // 左侧空白
      r: 30,  // 右侧空白
    },
    xaxis: {
      title: 'X',
      zeroline: true,
    },
    yaxis: {
      title: 'Y',
      zeroline: true,
      scaleanchor: 'x',  // 将 y 轴的比例锚定到 x 轴
      scaleratio: 1,     // 确保 y 轴的比例与 x 轴相同
    },
    showlegend: false,
    grid: { rows: 1, columns: 1 }
  };

  const config = {
    displayModeBar: false, // 禁用交互菜单
  };

  // 渲染图表
  if (plotlyChart3.value) {
    Plotly.react(plotlyChart3.value, data, layout, config);
  }
}

const plotlyChart4 = ref<HTMLElement | null>(null); // Y的边缘分布图表
function createPlotlyChart4() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [props.sigma1 ** 2, props.density * props.sigma1 * props.sigma2], // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, props.sigma2 ** 2], // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  // 创建网格点
  const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  };

  const y = linspace(-10, 10, 200);

  // 计算边缘分布
  const normPdf = (x: number[], mean: number, stddev: number) => {
    return x.map((xVal) => {
      return (1 / Math.sqrt(2 * Math.PI * stddev ** 2)) * Math.exp(-0.5 * ((xVal - mean) / stddev) ** 2);
    });
  };

  const marginalY = normPdf(y, mean[1], Math.sqrt(cov[1][1]));

  // 创建柱状图数据
  const data = [
    {
      type: 'bar',
      x: marginalY,
      y,
      name: 'Marginal Y',
      orientation: 'h', // 设置柱状图为水平
      marker: { color: 'rgba(255, 0, 0, 0.9)' },
    },
  ];

  // 设置布局
  const layout = {
    xaxis: { title: '' },
    yaxis: { title: '' },
    margin: {
      t: 30,  // 顶部空白
      b: 30,  // 底部空白
      l: 30,  // 左侧空白
      r: 30,  // 右侧空白
    },
    title: '',
  };

  const config = {
    displayModeBar: false, // 禁用交互菜单
  };

  // 渲染图表
  if (plotlyChart4.value) {
    Plotly.react(plotlyChart4.value, data, layout, config);
  }
}

const plotlyChart5 = ref<HTMLElement | null>(null); // X的条件分布图表
function createPlotlyChart5() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [Math.pow(props.sigma1, 2), props.density * props.sigma1 * props.sigma2],  // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, Math.pow(props.sigma2, 2)]   // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  // 创建网格点
  const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  };

  const meshgrid = (x: number[], y: number[]) => {
    const X: number[][] = [];
    const Y: number[][] = [];
    for (let i = 0; i < y.length; i++) {
      X.push(x);
      Y.push(Array(x.length).fill(y[i]));
    }
    return { X, Y };
  };

  const x = linspace(-10, 10, 200);
  const y = linspace(-10, 10, 200);
  const { X, Y } = meshgrid(x, y);

  // 创建二维正态分布的概率密度函数
  const rvPdf = (x: number, y: number) => {
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const invCov = [
      [cov[1][1] / det, -cov[0][1] / det],
      [-cov[1][0] / det, cov[0][0] / det]
    ];
    const diff = [x - mean[0], y - mean[1]];
    const expTerm = -0.5 * (diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
      diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]));
    const norm = 2 * Math.PI * Math.sqrt(det);
    return Math.exp(expTerm) / norm;
  };

  const Z = X.map((row, i) => row.map((_, j) => rvPdf(X[i][j], Y[i][j])));

  // 选择一个固定的 x 值来创建截面
  const fixedX = props.fixedX;
  const fixedXIndex = Math.round((fixedX - x[0]) / (x[1] - x[0]));

  // 计算截面的交线
  const sectionX = X[fixedXIndex];
  const sectionY = Y[fixedXIndex];
  const sectionZ = Z[fixedXIndex];

  // 创建图表
  const data = [
    {
      type: 'surface',
      z: Z,
      x: X,  // 使用 X 和 Y 作为二维网格
      y: Y,  // 使用 X 和 Y 作为二维网格
      colorscale: 'Viridis',
      opacity: 0.7,
      showscale: false,  // 完全隐藏颜色条
    },
    {
      type: 'scatter3d',
      x: sectionX,
      y: sectionY,
      z: sectionZ,
      mode: 'lines',
      line: {
        color: 'red',
        width: 3
      }
    }
  ];

  // 设置布局
  const layout = {
    scene: {
      xaxis: { title: '' },
      yaxis: { title: '' },
      zaxis: { title: 'Y的条件分布' },
    },
    margin: {
      t: 5,  // 顶部空白
      b: 5,  // 底部空白
      l: 5,  // 左侧空白
      r: 5,  // 右侧空白
    },
    title: '',
    legend: {
      x: 1,  // 将图例放到右侧
      y: 1,  // 将图例放到上方
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 12,
        color: '#000',
      },
    },
  };
  const config = {
    displayModeBar: false,  // 禁用交互菜单
  };
  // 渲染图表
  if (plotlyChart5.value) {
    Plotly.react(plotlyChart5.value, data, layout, config);
  }
}

const plotlyChart6 = ref<HTMLElement | null>(null); // Y的条件分布图表
function createPlotlyChart6() {
  // 设置均值和协方差矩阵
  const mean = [props.mean1, props.mean2];
  const cov = [
    [Math.pow(props.sigma1, 2), props.density * props.sigma1 * props.sigma2],  // cov[0][0] = sigma1^2, cov[0][1] = rho * sigma1 * sigma2
    [props.density * props.sigma1 * props.sigma2, Math.pow(props.sigma2, 2)]   // cov[1][0] = rho * sigma1 * sigma2, cov[1][1] = sigma2^2
  ];

  // 创建网格点
  const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
  };

  const meshgrid = (x: number[], y: number[]) => {
    const X: number[][] = [];
    const Y: number[][] = [];
    for (let i = 0; i < y.length; i++) {
      X.push(x);
      Y.push(Array(x.length).fill(y[i]));
    }
    return { X, Y };
  };

  const x = linspace(-10, 10, 200);
  const y = linspace(-10, 10, 200);
  const { X, Y } = meshgrid(x, y);

  // 创建二维正态分布的概率密度函数
  const rvPdf = (x: number, y: number) => {
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const invCov = [
      [cov[1][1] / det, -cov[0][1] / det],
      [-cov[1][0] / det, cov[0][0] / det]
    ];
    const diff = [x - mean[0], y - mean[1]];
    const expTerm = -0.5 * (diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
      diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]));
    const norm = 2 * Math.PI * Math.sqrt(det);
    return Math.exp(expTerm) / norm;
  };

  const Z = X.map((row, i) => row.map((_, j) => rvPdf(X[i][j], Y[i][j])));

  const fixedY = props.fixedY;
  const fixedXIndex = Math.round((fixedY - x[0]) / (x[1] - x[0]));

  // 计算截面的交线
  const sectionX = X[fixedXIndex];
  const sectionY = Y[fixedXIndex];
  const sectionZ = Z[fixedXIndex];

  // 创建图表
  const data = [
    {
      type: 'surface',
      z: Z,
      x: X,  // 使用 X 和 Y 作为二维网格
      y: Y,  // 使用 X 和 Y 作为二维网格
      colorscale: 'Viridis',
      opacity: 0.7,
      showscale: false,  // 完全隐藏颜色条
    },
    {
      type: 'scatter3d',
      x: sectionX,
      y: sectionY,
      z: sectionZ,
      mode: 'lines',
      line: {
        color: 'red',
        width: 3
      }
    }
  ];

  // 设置布局
  const layout = {
    scene: {
      xaxis: { title: '' },
      yaxis: { title: '' },
      zaxis: { title: 'X的条件分布' },
    },
    margin: {
      t: 5,  // 顶部空白
      b: 5,  // 底部空白
      l: 5,  // 左侧空白
      r: 5,  // 右侧空白
    },
    title: '',
    legend: {
      x: 1,  // 将图例放到右侧
      y: 1,  // 将图例放到上方
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 12,
        color: '#000',
      },
    },
  };
  const config = {
    displayModeBar: false,  // 禁用交互菜单
  };
  // 渲染图表
  if (plotlyChart6.value) {
    Plotly.react(plotlyChart6.value, data, layout, config);
  }
}

onMounted(() => {
  createPlotlyChart1();
  createPlotlyChart2();
  createPlotlyChart3();
  createPlotlyChart4();
  createPlotlyChart5();
  createPlotlyChart6();
});
watch(() => [props.mean1, props.mean2, props.sigma1, props.sigma2, props.density, props.isChart3, props.fixedX, props.fixedY], () => {
  createPlotlyChart1();
  createPlotlyChart2();
  createPlotlyChart3();
  createPlotlyChart4();
  createPlotlyChart5();
  createPlotlyChart6();
});
watch(() => props.isChart3, async () => {
  await nextTick();
  createPlotlyChart2();
  createPlotlyChart4();
  createPlotlyChart5();
  createPlotlyChart6();
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex w-full h-full">
      <div id="plotly-chart2" ref="plotlyChart2" class="w-[550px] h-[320px]" v-if="!props.isChart3"></div>
      <div id="plotly-chart5" ref="plotlyChart5" class="w-96 h-96" v-if="props.isChart3"></div>
      <div id="plotly-chart1" ref="plotlyChart1" class="w-[400px] h-[320px]"></div>
    </div>
    <div class="flex w-full h-full">
      <div id="plotly-chart3" ref="plotlyChart3" class="w-[550px] h-[550px]"></div>
      <div id="plotly-chart4" ref="plotlyChart4" class="w-[400px] h-[550px]" v-if="!props.isChart3"></div>
      <div id="plotly-chart6" ref="plotlyChart6" class="w-96 h-96" v-if="props.isChart3"></div>
    </div>
  </div>
</template>
