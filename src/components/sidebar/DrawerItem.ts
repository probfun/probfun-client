import { ref } from 'vue';

interface DrawerItem {
  title: string;
  icon: string;
  children?: DrawerItem[];
  route?: string;
}

const experimentItems = ref<DrawerItem[]>([
  {
    title: '第一章 概率论的基本概念',
    icon: 'lucide:folder',
    children: [
      { title: '生日问题', icon: 'lucide:flask-conical', route: '/dashboard/experiment/birthday-problem' },
      { title: '蒲丰投针', icon: 'lucide:flask-conical', route: '/dashboard/experiment/buffon' },
      { title: '贝特朗悖论', icon: 'lucide:flask-conical', route: '/dashboard/experiment/bertrand' },
      { title: '阳性检测', icon: 'lucide:flask-conical', route: '/dashboard/experiment/positive-test' },
      { title: '三门问题', icon: 'lucide:flask-conical', route: '/dashboard/experiment/three-doors' },
    ],
  },
  {
    title: '第二章 一维随机变量',
    icon: 'lucide:folder',
    children: [
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
      { title: '投资组合优化', icon: 'lucide:flask-conical', route: '/dashboard/experiment/portfolio' },
      { title: '网络流量分析与异常检测系统', icon: 'lucide:flask-conical', route: '/dashboard/experiment/NetworkTrafficCharacteristics' },
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
]);

const questionItems = ref<DrawerItem[]>([
  {
    title: '第一章 概率论的基本概念',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob1思维导图', icon: 'lucide:network' },
      { title: '1.1样本空间与随机事件', icon: 'lucide:book', route: '/dashboard/question/1.1%20样本空间与随机事件' },
      { title: '1.2事件的概率', icon: 'lucide:book', route: '/dashboard/question/1.2%20事件的概率' },
      { title: '1.3条件概率', icon: 'lucide:book', route: '/dashboard/question/1.3%20条件概率' },
      { title: '1.4事件的独立性', icon: 'lucide:book', route: '/dashboard/question/1.4%20事件的独立性' },
    ],
  },
  {
    title: '第二章 一维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob2思维导图', icon: 'lucide:network' },
      { title: '2.1随机变量及其分布函数', icon: 'lucide:book', route: '/dashboard/question/2.1%20随机变量及其分布函数' },
      { title: '2.2离散型随机变量', icon: 'lucide:book', route: '/dashboard/question/2.2%20离散型随机变量' },
      { title: '2.3连续型随机变量', icon: 'lucide:book', route: '/dashboard/question/2.3%20连续型随机变量' },
      { title: '2.4一维随机变量函数的分布', icon: 'lucide:book', route: '/dashboard/question/2.4%20一维随机变量函数的分布' },
    ],
  },
  {
    title: '第三章 多维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob3思维导图', icon: 'lucide:network' },
      { title: '3.1二维随机变量及其联合分布', icon: 'lucide:book', route: '/dashboard/question/3.1%20二维随机变量及其联合分布' },
      { title: '3.2边缘分布', icon: 'lucide:book', route: '/dashboard/question/3.2%20边缘分布' },
      { title: '3.3条件分布', icon: 'lucide:book', route: '/dashboard/question/3.3%20条件分布' },
      { title: '3.4随机变量的独立性', icon: 'lucide:book', route: '/dashboard/question/3.4%20随机变量的独立性' },
      { title: '3.5两个随机变量的函数分布', icon: 'lucide:book', route: '/dashboard/question/3.5%20两个随机变量的函数分布' },
    ],
  },
  {
    title: '第四章 数字特征',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob4思维导图', icon: 'lucide:network' },
      { title: '4.1期望', icon: 'lucide:book', route: '/dashboard/question/4.1%20期望' },
      { title: '4.2方差', icon: 'lucide:book', route: '/dashboard/question/4.2%20方差' },
      { title: '4.3协方差与相关系数', icon: 'lucide:book', route: '/dashboard/question/4.3%20协方差与相关系数' },
      { title: '4.4矩与协方差矩阵', icon: 'lucide:book', route: '/dashboard/question/4.4%20矩与协方差矩阵' },
      { title: '4.5特征函数', icon: 'lucide:book', route: '/dashboard/question/4.5%20特征函数' },
    ],
  },
  {
    title: '第五章 极限定理',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob5思维导图', icon: 'lucide:network' },
      { title: '5.1随机变量序列的收敛', icon: 'lucide:book', route: '/dashboard/question/5.1%20随机变量序列的收敛' },
      { title: '5.2大数定律', icon: 'lucide:book', route: '/dashboard/question/5.2%20大数定律' },
      { title: '5.3中心极限定理', icon: 'lucide:book', route: '/dashboard/question/5.3%20中心极限定理' },
    ],
  },
  {
    title: '第六章 随机过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob6思维导图', icon: 'lucide:network' },
      { title: '6.1随机过程的基本概念和分类', icon: 'lucide:book', route: '/dashboard/question/6.1%20随机过程的基本概念和分类' },
      { title: '6.2随机过程的有限维分布', icon: 'lucide:book', route: '/dashboard/question/6.2%20随机过程的有限维分布' },
      { title: '6.3随机过程的数字特征', icon: 'lucide:book', route: '/dashboard/question/6.3%20随机过程的数字特征' },
      { title: '6.4Gaussian Processes', icon: 'lucide:book', route: '/dashboard/question/6.4%20Gaussian%20Processes' },
      { title: '6.5Wiener Process and Browian Motion', icon: 'lucide:book', route: '/dashboard/question/6.5%20Wiener%20Process%20and%20Browian%20Motion' },
    ],
  },
  {
    title: '第七章 泊松过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob7思维导图', icon: 'lucide:network' },
      { title: '7.1泊松过程的三种等价定义', icon: 'lucide:book', route: '/dashboard/question/7.1%20泊松过程的三种等价定义' },
      { title: '7.2泊松过程与均匀分布', icon: 'lucide:book', route: '/dashboard/question/7.2%20泊松过程与均匀分布' },
      { title: '7.3泊松过程与二项分布、多项分布', icon: 'lucide:book', route: '/dashboard/question/7.3%20泊松过程与二项分布、多项分布' },
      { title: '7.4泊松过程的叠加', icon: 'lucide:book', route: '/dashboard/question/7.4%20泊松过程的叠加' },
      { title: '7.5泊松过程的稀释', icon: 'lucide:book', route: '/dashboard/question/7.5%20泊松过程的稀释' },
      { title: '7.6广义齐次泊松过程', icon: 'lucide:book', route: '/dashboard/question/7.6%20广义齐次泊松过程' },
      { title: '7.7非时齐泊松过程', icon: 'lucide:book', route: '/dashboard/question/7.7%20非时齐泊松过程' },
      { title: '7.8复合泊松过程', icon: 'lucide:book', route: '/dashboard/question/7.8%20复合泊松过程' },
    ],
  },
  {
    title: '第八章 平稳过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob8思维导图', icon: 'lucide:network' },
      { title: '8.1平稳过程的概念', icon: 'lucide:book', route: '/dashboard/question/8.1%20平稳过程的概念' },
      { title: '8.2平稳过程自相关函数的性质', icon: 'lucide:book', route: '/dashboard/question/8.2%20平稳过程自相关函数的性质' },
      { title: '8.3联合平稳过程及互相关函数', icon: 'lucide:book', route: '/dashboard/question/8.3%20联合平稳过程及互相关函数' },
      { title: '8.5随机分析', icon: 'lucide:book', route: '/dashboard/question/8.5%20随机分析' },
      { title: '8.6平稳过程的遍历性', icon: 'lucide:book', route: '/dashboard/question/8.6%20平稳过程的遍历性' },
      { title: '8.7平稳过程的谱分析', icon: 'lucide:book', route: '/dashboard/question/8.7%20平稳过程的谱分析' },
    ],
  },
  {
    title: '第九章 离散时间马氏链',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob9思维导图', icon: 'lucide:network' },
      { title: '9.1马氏链', icon: 'lucide:book' },
      { title: '9.2转移概率', icon: 'lucide:book', route: '/dashboard/question/9.2%20转移概率' },
      { title: '9.3马氏链的有限维分布', icon: 'lucide:book', route: '/dashboard/question/9.3%20马氏链的有限维分布' },
      { title: '9.4马氏链的状态分类', icon: 'lucide:book', route: '/dashboard/question/9.4%20马氏链的状态分类' },
      { title: '9.5状态空间的分解', icon: 'lucide:book', route: '/dashboard/question/9.5%20状态空间的分解' },
      { title: '9.6平稳分布', icon: 'lucide:book', route: '/dashboard/question/9.6%20平稳分布' },
    ],
  },
]);

export type { DrawerItem };

export {
  experimentItems,
  questionItems,
};
