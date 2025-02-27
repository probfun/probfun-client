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

function getChartOptionMulti(yn: number[][], y2: number[]) {
  // const textColor = hslToHex(documentStyle.getPropertyValue('--foreground')); // Maps to primary foreground color
  const textColorSecondary = hslToHex(documentStyle.getPropertyValue('--muted-foreground')); // Maps to muted foreground color
  const surfaceBorder = hslToHex(documentStyle.getPropertyValue('--border')); // Maps to border color
  const computeMaxY = (yn: number[][], y2: number[]) => {
    const maxVal = Math.max(...yn.flat(), ...y2); // 找到 yn 和 y2 中的最大值
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
        display: false,
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
        max: computeMaxY(yn, y2),
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
        pointRadius: 0,
      },
      {
        label: '对应的正态分布', // 第二条曲线的标签
        data: y2,
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // 另一种颜色
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });
}

function getChartDataMulti(x: number[], yn: number[][], y2: number[]) {
  const startColor = { r: 75, g: 192, b: 192 };
  const endColor = { r: 0, g: 128, b: 0 };
  const datasets = [];
  datasets.push({
    label: '对应的正态分布',
    data: y2,
    fill: false,
    borderColor: 'rgb(255, 99, 132)', // 另一种颜色
    tension: 0.4,
    borderWidth: 3,
    pointRadius: 0,
  });
  yn.forEach((y, index) => {
    const n = yn.length;
    const ratio = index / (n - 1);
    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r)); // 计算渐变色的红色分量
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g)); // 计算渐变色的绿色分量
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b)); // 计算渐变色的蓝色分量

    datasets.push({
      label: `${index + 1}个分布的叠加`,
      data: y,
      fill: false,
      borderColor: `rgb(${r}, ${g}, ${b})`,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    });
  });

  return ({
    labels: x,
    datasets,
  });
}

export { getChartData, getChartDataMulti, getChartOption, getChartOptionMulti };
