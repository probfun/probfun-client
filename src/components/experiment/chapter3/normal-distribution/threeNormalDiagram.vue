<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Plotly from 'plotly.js-dist';

const props = defineProps<{
    mean1: number,
    mean2: number,
    sigma1: number,
    sigma2: number,
    density: number
}>();

const plotlyChart = ref<HTMLElement | null>(null);

function createPlotlyChart() {
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
        const exp1 = Math.exp(-0.5 * (
            Math.pow((x - mean[0]) / Math.sqrt(cov[0][0]), 2) +
            Math.pow((y - mean[1]) / Math.sqrt(cov[1][1]), 2) -
            2 * (x - mean[0]) * (y - mean[1]) / (Math.sqrt(cov[0][0]) * Math.sqrt(cov[1][1]))));
        const norm = 2 * Math.PI * Math.sqrt(cov[0][0] * cov[1][1] - Math.pow(cov[0][1], 2));
        return exp1 / norm;
    };

    const Z = X.map((row, i) => row.map((_, j) => rvPdf(X[i][j], Y[i][j])));

    // 计算边缘分布
    const normPdf = (x: number[], mean: number, stddev: number) => {
        return x.map(xVal => {
            return (1 / Math.sqrt(2 * Math.PI * Math.pow(stddev, 2))) * Math.exp(-0.5 * Math.pow((xVal - mean) / stddev, 2));
        });
    };

    const marginalX = normPdf(x, mean[0], Math.sqrt(cov[0][0]));
    const marginalY = normPdf(y, mean[1], Math.sqrt(cov[1][1]));

    // 创建图表
    const data = [
        {
            type: 'surface',
            z: Z,
            x: X,  // 使用 X 和 Y 作为二维网格
            y: Y,  // 使用 X 和 Y 作为二维网格
            colorscale: 'Viridis',
            opacity: 0.7,
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            x: x,
            y: Array(x.length).fill(-3),
            z: marginalX,
            name: 'Marginal X',
            line: { color: 'blue' },
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            x: Array(y.length).fill(7),
            y: y,
            z: marginalY,
            name: 'Marginal Y',
            line: { color: 'red' },
        },
    ];

    // 设置布局
    const layout = {
        scene: {
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            zaxis: { title: 'Probability Density' },
        },
        margin: {
            t: 5,  // 顶部空白
            b: 5,  // 底部空白
            l: 5,  // 左侧空白
            r: 5,  // 右侧空白
        },
        title: '',
        legend: {
            x: 0,  // 将图例放到右侧
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
    if (plotlyChart.value) {
        Plotly.react(plotlyChart.value, data, layout, config);
    }
}

onMounted(() => {
    createPlotlyChart();
});
watch(() => [props.mean1, props.mean2, props.sigma1, props.sigma2, props.density], () => {
    createPlotlyChart();
});
</script>

<template>
    <div id="plotly-chart" ref="plotlyChart" class="w-full h-full"></div>
</template>