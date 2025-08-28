import type { StatisticsData } from '../types/statistics';

// 生成随机数的辅助函数
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// 生成雷达图模拟数据
function generateRadarData(): any[] {
  const subjects = ['数学', '物理', '化学', '生物', '英语', '语文'];
  return subjects.map(subject => ({
    subject,
    score: random(60, 95),
    fullMark: 100,
  }));
}

// 生成进步曲线模拟数据
function generateProgressData(days = 30): any[] {
  const data = [];
  let score = random(60, 75);
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 随机波动，但总体呈上升趋势
    score += random(-3, 5);
    score = Math.max(60, Math.min(score, 98));

    data.push({
      date: `${month}/${day}`,
      score: Number.parseFloat(score.toFixed(1)),
    });
  }

  return data;
}

// 生成简单统计数据
export function generateSimpleStatisticsData(): StatisticsData {
  return {
    radarData: generateRadarData(),
    progressData: generateProgressData(),
  };
}

// 导出简单的模拟数据供直接使用
export const simpleRadarData = generateRadarData();
export const simpleProgressData = generateProgressData();
