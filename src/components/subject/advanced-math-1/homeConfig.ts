import type { HomeConfig } from '@/components/subject/configs.ts';

const homeConfig: HomeConfig = {
  experiments: [
    {
      title: '函数极限',
      description: '通过交互探索函数在点处与区间内的极限概念，理解ε-δ语言和直观图像之间的对应。',
      path: '/experiment/function-limit',
      img: '/calculusA/function-limit.png',
    },
    {
      title: '导数的几何意义',
      description: '可视化切线与割线，理解导数作为瞬时变化率与切线斜率的几何含义。',
      path: '/experiment/derivative-geometry',
      img: '/calculusA/derivative-geometry.png',
    },
    {
      title: '泰勒展开',
      description: '通过泰勒多项式近似函数，观察展开阶数对近似精度的影响。',
      path: '/experiment/taylor-expansion',
      img: '/calculusA/taylor-expansion.png',
    },
    {
      title: '可积条件',
      description: '从分割与上、下和出发，直观理解黎曼可积与不连续点集合的关系。',
      path: '/experiment/integrability-conditions',
      img: '/calculusA/integrability-conditions.png',
    },
  ],
  mindMaps: [

  ],
  thinking: [
  ],
};

export { homeConfig };
