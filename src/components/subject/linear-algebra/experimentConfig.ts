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
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
