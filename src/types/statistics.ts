// 雷达图数据类型
export interface RadarData {
  subject: string;
}

// 进步曲线数据类型
export interface ProgressData {
  date: string;
}

// 完整统计数据类型
export interface StatisticsData {
  radarData: RadarData[];
  progressData: ProgressData[];
}