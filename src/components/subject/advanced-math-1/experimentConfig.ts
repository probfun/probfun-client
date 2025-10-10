import type { DrawerItem } from '@/components/subject/configs.ts';

const experiments: DrawerItem[] = [
  {
    title: '第一章 函数、极限与连续',
    icon: 'lucide:folder',
    children: [
      { title: '数列的极限', icon: 'lucide:flask-conical', route: `/experiment/sequence-limit` },
      { title: '函数的极限', icon: 'lucide:flask-conical', route: `/experiment/function-limit` },
    ],
  },
  {
    title: '第二章 导数与微分',
    icon: 'lucide:folder',
    children: [
      { title: '导数的几何意义', icon: 'lucide:flask-conical', route: `/experiment/derivative-geometry` },
    ],
  },
  {
    title: '第三章 微分中值定理及其应用',
    icon: 'lucide:folder',
    children: [
      { title: '拉格朗日中值定理', icon: 'lucide:flask-conical', route: `/experiment/lagrange-mvt` },
      { title: '泰勒展开', icon: 'lucide:flask-conical', route: `/experiment/taylor-expansion` },
    ],
  },
  {
    title: '第五章 定积分',
    icon: 'lucide:folder',
    children: [
      { title: '可积条件', icon: 'lucide:flask-conical', route: `/experiment/integrability-conditions` },
      { title: '加百利喇叭', icon: 'lucide:flask-conical', route: `/experiment/gabriel-horn` },
    ],
  },
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
