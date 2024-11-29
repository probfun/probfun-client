import { GraduationCap, Lightbulb, MessagesSquare, NotebookPen } from 'lucide-vue-next';
import { computed } from 'vue';

const documentStyle = getComputedStyle(document.documentElement)

const discussTabList = [
  {
    id: 0,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,

  },
  {
    id: 1,
    label: '相关讨论',
    name: 'discuss',
    icon: Lightbulb,
  },

  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
  {
    id: 3,
    label: '拓展训练',
    name: 'exercise',
    icon: NotebookPen,
  },

];

function hslToHex(hsl: string) {
  // 将 HSL 拆分为三个值
  const [h, s, l] = hsl.split(' ').map((value, index) => {
    return index === 0 ? Number.parseFloat(value) : Number.parseFloat(value) / 100;
  });
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255);
  };
  const r = f(0);
  const g = f(8);
  const b = f(4);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const chartOptions = computed(() => {
  const textColor = hslToHex(documentStyle.getPropertyValue('--foreground')); // Maps to primary foreground color
  const textColorSecondary = hslToHex(documentStyle.getPropertyValue('--muted-foreground')); // Maps to muted foreground color
  const surfaceBorder = hslToHex(documentStyle.getPropertyValue('--border')); // Maps to border color
  console.log(textColor, textColorSecondary, surfaceBorder);
  return {
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 3.14152,
            yMax: 3.14152,
            borderColor: 'orange', // 橘红色
            borderWidth: 2,
            borderDash: [10, 5], // 虚线样式
            label: {
              content: 'π ≈ 3.14152',
              position: 'top',
              backgroundColor: 'orange',
              color: 'black',
              padding: 4,
            },
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
});

function getChartData(data: number[]) {
  const kValues = Array.from({ length: data.length }, (_, i) => i + 1);
  return ({
    labels: kValues,
    datasets: [
      {
        label: '估算的 Pi 值',
        data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // 浅绿色
        tension: 0.4,
      },
      {
        label: 'Pi = 3.14152', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 3.14152 : 3.14152), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: hslToHex(documentStyle.getPropertyValue('--destructive')) || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

function getChartDataAver(data: number[]) {
  const kValues = Array.from({ length: data.length }, (_, i) => i + 1);
  const averagePi = [];
  let sum = 0;
  let cnt = 0;
  for (let i = 0; i < data.length; i++) {
    if (Number.isFinite(data[i])) {
      sum += data[i];
      averagePi[i] = sum / ++cnt;
    }
  }
  return ({
    labels: kValues,
    datasets: [
      {
        label: '平均估算的 Pi 值',
        data: averagePi,
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // 蓝色
        tension: 0.4,
      },
      {
        label: 'Pi = 3.14152', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 3.14152 : 3.14152), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: hslToHex(documentStyle.getPropertyValue('--destructive')) || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

export { chartOptions, discussTabList, getChartData, getChartDataAver };
