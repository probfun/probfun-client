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
      title: '二重积分',
      description: '可视化多元函数的截面曲线，观察固定变量时的切线斜率，理解偏导数的方向变化率含义。',
      path: '/experiment/double-integral',
      img: '/calculusB/double-integral.png',
    },
    {
      title: '全微分',
      description: '通过切平面近似曲面，对比全微分与函数增量的差异，直观理解局部线性近似的精度特征。',
      path: '/experiment/total-derivative',
      img: '/calculusB/total-derivative.png',
    },
    {
      title: '空间曲线',
      description: '可视化曲面与空间曲线的交点，理解空间曲线的参数方程与函数的联系，掌握空间曲线的几何性质。',
      path: '/experiment/space-curve',
      img: '/calculusB/space-curve.png',
    },
  ],
  mindMaps: [

  ],
  thinking: [
  ],
};

export { homeConfig };
