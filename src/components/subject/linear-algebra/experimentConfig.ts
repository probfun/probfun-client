import type { DrawerItem } from '@/components/subject/configs.ts';

const experiments: DrawerItem[] = [
  {
    title: '第二章 行列式',
    icon: 'lucide:folder',
    children: [
      { title: '二元一次方程组', icon: 'lucide:flask-conical', route: `/experiment/linear-equation` },
      { title: '三元一次方程组', icon: 'lucide:flask-conical', route: `/experiment/linear-equation-3` },
    ],
  },
  {
    title: '第三章 n维向量空间',
    icon: 'lucide:folder',
    children: [
      { title: '二维平面向量的线性组合', icon: 'lucide:flask-conical', route: `/experiment/linear-combination` },
    ],
  },
  {
    title: '第五章 矩阵的相抵与相似',
    icon: 'lucide:folder',
    children: [
      { title: '二阶矩阵的特征值与特征向量', icon: 'lucide:flask-conical', route: `/experiment/matrix-eigen` },
    ],
  },
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
