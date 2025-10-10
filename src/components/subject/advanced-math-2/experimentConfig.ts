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
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
