const documentStyle = getComputedStyle(document.documentElement)

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

function getChartOption(y1: number[], y2: number[]) {
  const textColor = hslToHex(documentStyle.getPropertyValue('--foreground')); // Maps to primary foreground color
  const textColorSecondary = hslToHex(documentStyle.getPropertyValue('--muted-foreground')); // Maps to muted foreground color
  const surfaceBorder = hslToHex(documentStyle.getPropertyValue('--border')); // Maps to border color
  const computeMaxY = (y1: number[], y2: number[]) => {
    const maxVal = Math.max(...y1, ...y2); // 找到 y1 和 y2 中的最大值
    console.log(maxVal);
    return maxVal * 1.1; // 加 10% 作为额外的缓冲
  };
  return {
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
      },
    },
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
        beginAtZero: true, // 确保 y 轴从 0 开始
        min: 0, // 强制 y 轴最小值为 0
        max: computeMaxY(y1, y2),
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
}

function getChartData(x: number[], y1: number[], y2: number[]) {
  return ({
    labels: x,
    datasets: [
      {
        label: 'n个分布的叠加',
        data: y1,
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // 浅绿色
        tension: 0.4,
      },
      {
        label: '对应的正态分布', // 第二条曲线的标签
        data: y2,
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // 另一种颜色
        tension: 0.4,
      },
    ],
  });
}

export { getChartData, getChartOption };
