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
      title: '二维平面向量的线性组合',
      description: '通过交互探索二维平面向量的线性组合，理解向量的几何意义。',
      path: '/experiment/linear-combination',
      img: '/linearAlgebra/linear-combination.png',
    },
    {
      title: '三元一次方程组',
      description: '通过交互探索三元一次方程组的解法，理解图像与代数之间的关系。',
      path: '/experiment/linear-equation-3',
      img: '/linearAlgebra/linear-equation-3.png',
    },
    {
      title: '二阶矩阵的特征值与特征向量',
      description: '通过交互探索二阶矩阵的特征值与特征向量，理解矩阵的几何意义。',
      path: '/experiment/matrix-eigen',
      img: '/linearAlgebra/matrix-eigen.png',
    },
  ],
  mindMaps: [

  ],
  thinking: [
  ],
};

export { homeConfig };
