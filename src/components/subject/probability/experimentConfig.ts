import type { DrawerItem } from '@/components/subject/configs.ts';

const experiments: DrawerItem[] = [
  {
    title: '第一章 概率论的基本概念',
    icon: 'lucide:folder',
    children: [
      { title: '事件的关系与运算', icon: 'lucide:flask-conical', route: '/dashboard/experiment/event-relationship' },
      { title: '互斥与独立', icon: 'lucide:flask-conical', route: '/dashboard/experiment/mutually-exclusive-and-independent' },
      { title: '生日问题', icon: 'lucide:flask-conical', route: '/dashboard/experiment/birthday-problem' },
      { title: '蒲丰投针', icon: 'lucide:flask-conical', route: '/dashboard/experiment/buffon' },
      { title: '贝特朗悖论', icon: 'lucide:flask-conical', route: '/dashboard/experiment/bertrand' },
      // { title: '阳性检测', icon: 'lucide:flask-conical', route: '/dashboard/experiment/positive-test' },
      { title: '三门问题', icon: 'lucide:flask-conical', route: '/dashboard/experiment/three-doors' },
      { title: '假阳性问题', icon: 'lucide:flask-conical', route: '/dashboard/experiment/false-positive' },
      { title: '垃圾邮件过滤', icon: 'lucide:flask-conical', route: '/dashboard/experiment/spam-filtering',
      },
    ],
  },
  {
    title: '第二章 一维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: '离散型随机变量的PMF', icon: 'lucide:flask-conical', route: '/dashboard/experiment/discrete-pmf' },
      { title: '概率密度函数与分布函数', icon: 'lucide:flask-conical', route: '/dashboard/experiment/pdf-cdf' },
      { title: '二项分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/binomial-distribution' },
      { title: '泊松分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/poisson-distribution' },
      { title: '几何分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/geometric-distribution' },
      { title: '均匀分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/uniform-distribution' },
      { title: '指数分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/exponential-distribution' },
      { title: '正态分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/normal-distribution' },
      {
        title: '分布的对比',
        icon: 'lucide:folder',
        children: [
          { title: '二项分布与泊松分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/binomial-poisson' },
          { title: '二项分布与正态分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/binomial-normal' },
          { title: '泊松分布与指数分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/poisson-exponential' },
          { title: '泊松分布与正态分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/poisson-normal' },
        ],
      },
    ],
  },
  {
    title: '第三章 多维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: '二维均匀分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/2d-uniform-distribution' },
      { title: '二维正态分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/2d-normal-distribution' },
    ],
  },
  {
    title: '第四章 数字特征',
    icon: 'lucide:folder',
    children: [
      { title: '分组检测', icon: 'lucide:flask-conical', route: '/dashboard/experiment/group-detection' },
      { title: '投资组合收益', icon: 'lucide:flask-conical', route: '/dashboard/experiment/portfolio' },
      { title: '网络流量特征相关系数矩阵', icon: 'lucide:flask-conical', route: '/dashboard/experiment/NetworkTrafficCharacteristics' },
    ],
  },
  {
    title: '第五章 极限定理',
    icon: 'lucide:folder',
    children: [
      { title: '抛硬币实验', icon: 'lucide:flask-conical', route: '/dashboard/experiment/CoinFliping' },
      { title: '蒙特卡罗方法估算π值', icon: 'lucide:flask-conical', route: '/dashboard/experiment/EstimationOfPai' },
      { title: '高尔顿钉板实验', icon: 'lucide:flask-conical', route: '/dashboard/experiment/central-limit-theorem' },
    ],
  },
  {
    title: '第六章 随机过程',
    icon: 'lucide:folder',
    children: [
      { title: '布朗运动模拟', icon: 'lucide:flask-conical', route: '/dashboard/experiment/brownian-motion' },
      { title: '几何布朗运动模拟', icon: 'lucide:flask-conical', route: '/dashboard/experiment/geometric-brownian-motion' },
      { title: '泊松过程模拟', icon: 'lucide:flask-conical', route: '/dashboard/experiment/poisson-process' },
      // { title: '二维向量场的线积分', icon: 'lucide:flask-conical', route: '/dashboard/experiment/vector' },
    ],
  },
  {
    title: '第七章 数理统计',
    icon: 'lucide:folder',
    children: [
      { title: 't分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/t-distribution' },
      { title: '卡方分布', icon: 'lucide:flask-conical', route: '/dashboard/experiment/chi-square-distribution' },
      { title: 't分布上分位点', icon: 'lucide:flask-conical', route: '/dashboard/experiment/t-distribution-quantile' },
      { title: '卡方分布上分位点', icon: 'lucide:flask-conical', route: '/dashboard/experiment/chi-square-distribution-quantile' },
    ],
  },
];

const experimentConfig = {
  experiments,
};

export { experimentConfig };
