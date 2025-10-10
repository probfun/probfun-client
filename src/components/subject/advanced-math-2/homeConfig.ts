import type { HomeConfig } from '@/components/subject/configs.ts';

const homeConfig: HomeConfig = {
  experiments: [
    {
      title: '邻域',
      description: '交互探索邻域的几何形态，观察半径变化对范围的影响，理解点与邻域的包含关系及数学表达。',
      path: '/experiment/neighborhood',
      img: '/calculusB/neighborhood.png',
    },
    {
      title: '偏导数',
      description: '可视化多元函数的截面曲线，观察固定变量时的切线斜率，理解偏导数的方向变化率含义。',
      path: '/experiment/partial-derivative',
      img: '/calculusB/partial-derivative.png',
    },
    {
      title: '全微分',
      description: '通过切平面近似曲面，对比全微分与函数增量的差异，直观理解局部线性近似的精度特征。',
      path: '/experiment/total-derivative',
      img: '/calculusB/total-derivative.png',
    },
  ],
  mindMaps: [

  ],
};

export { homeConfig };
