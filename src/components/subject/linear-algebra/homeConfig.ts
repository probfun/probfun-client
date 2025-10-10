import type { HomeConfig } from '@/components/subject/configs.ts';

const homeConfig: HomeConfig = {
  experiments: [
    {
      title: '二元一次方程组',
      description: '通过交互探索二元一次方程组的解法，理解图像与代数之间的关系。',
      path: '/experiment/linear-equation',
      img: '/linearAlgebra/linear-equation.png',
    },
    {
      title: '三元一次方程组',
      description: '通过交互探索三元一次方程组的解法，理解图像与代数之间的关系。',
      path: '/experiment/linear-equation-3',
      img: '/linearAlgebra/linear-equation-3.png',
    },
  ],
  mindMaps: [

  ],
};

export { homeConfig };
