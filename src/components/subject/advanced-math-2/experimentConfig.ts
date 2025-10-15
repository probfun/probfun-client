import type { DrawerItem } from '@/components/subject/configs.ts';

const experiments: DrawerItem[] = [
  {
    title: '第五章 多元函数微分学及其应用',
    icon: 'lucide:folder',
    children: [
      { title: '邻域', icon: 'lucide:flask-conical', route: `/experiment/neighborhood` },
      { title: '偏导数', icon: 'lucide:flask-conical', route: `/experiment/partial-derivative` },
      { title: '全微分', icon: 'lucide:flask-conical', route: `/experiment/total-derivative` },
    ],
  },
  {
    title: '第六章 多元函数积分学及其应用',
    icon: 'lucide:folder',
    children: [
      { title: '二重积分', icon: 'lucide:flask-conical', route: `/dashboard/experiment/double-integral` },
      { title: '空间曲线弧长', icon: 'lucide:flask-conical', route: `/dashboard/experiment/space-curve` },
    ],
  },
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
