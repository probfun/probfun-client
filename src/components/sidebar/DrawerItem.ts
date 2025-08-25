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
      { title: '1.1样本空间与随机事件', icon: 'lucide:book', route: '/dashboard/question/chapter1/section1' },
      { title: '1.2事件的概率', icon: 'lucide:book', route: '/dashboard/question/chapter1/section2' },
      { title: '1.3条件概率', icon: 'lucide:book', route: '/dashboard/question/chapter1/section3' },
      { title: '1.4事件的独立性', icon: 'lucide:book', route: '/dashboard/question/chapter1/section4' },
    ],
  },
  {
    title: '第二章 一维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob2思维导图', icon: 'lucide:network' },
      { title: '2.1随机变量及其分布函数', icon: 'lucide:book', route: '/dashboard/question/chapter2/section1' },
      { title: '2.2离散型随机变量', icon: 'lucide:book', route: '/dashboard/question/chapter2/section2' },
      { title: '2.3连续型随机变量', icon: 'lucide:book', route: '/dashboard/question/chapter2/section3' },
      { title: '2.4一维随机变量函数的分布', icon: 'lucide:book', route: '/dashboard/question/chapter2/section4' },
    ],
  },
  {
    title: '第三章 多维随机变量',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob3思维导图', icon: 'lucide:network' },
      { title: '3.1二维随机变量及其联合分布', icon: 'lucide:book', route: '/dashboard/question/chapter3/section1' },
      { title: '3.2边缘分布', icon: 'lucide:book', route: '/dashboard/question/chapter3/section2' },
      { title: '3.3条件分布', icon: 'lucide:book', route: '/dashboard/question/chapter3/section3' },
      { title: '3.4随机变量的独立性', icon: 'lucide:book', route: '/dashboard/question/chapter3/section4' },
      { title: '3.5两个随机变量的函数分布', icon: 'lucide:book', route: '/dashboard/question/chapter3/section5' },
    ],
  },
  {
    title: '第四章 数字特征',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob4思维导图', icon: 'lucide:network' },
      { title: '4.1期望', icon: 'lucide:book', route: '/dashboard/question/chapter4/section1' },
      { title: '4.2方差', icon: 'lucide:book', route: '/dashboard/question/chapter4/section2' },
      { title: '4.3协方差与相关系数', icon: 'lucide:book', route: '/dashboard/question/chapter4/section3' },
      { title: '4.4矩与协方差矩阵', icon: 'lucide:book', route: '/dashboard/question/chapter4/section4' },
      { title: '4.5特征函数', icon: 'lucide:book', route: '/dashboard/question/chapter4/section5' },
    ],
  },
  {
    title: '第五章 极限定理',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob5思维导图', icon: 'lucide:network' },
      { title: '5.1随机变量序列收敛', icon: 'lucide:book', route: '/dashboard/question/chapter5/section1' },
      { title: '5.2大数定律', icon: 'lucide:book', route: '/dashboard/question/chapter5/section2' },
      { title: '5.3中心极限定理', icon: 'lucide:book', route: '/dashboard/question/chapter5/section3' },
    ],
  },
  {
    title: '第六章 随机过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob6思维导图', icon: 'lucide:network' },
      { title: '6.1随机过程的基本概念和分类', icon: 'lucide:book', route: '/dashboard/question/chapter6/section1' },
      { title: '6.2随机过程的有限维分布', icon: 'lucide:book', route: '/dashboard/question/chapter6/section2' },
      { title: '6.3随机过程的数字特征', icon: 'lucide:book', route: '/dashboard/question/chapter6/section3' },
    ],
  },
  {
    title: '第七章 泊松过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob7思维导图', icon: 'lucide:network' },
      { title: '7.1泊松过程的三种等价定义', icon: 'lucide:book', route: '/dashboard/question/chapter7/section1' },
      { title: '7.2泊松过程与均匀分布', icon: 'lucide:book', route: '/dashboard/question/chapter7/section2' },
      { title: '7.3泊松过程与二项分布、多项分布', icon: 'lucide:book', route: '/dashboard/question/chapter7/section3' },
      { title: '7.4泊松过程的叠加', icon: 'lucide:book', route: '/dashboard/question/chapter7/section4' },
      { title: '7.5泊松过程的稀释', icon: 'lucide:book', route: '/dashboard/question/chapter7/section5' },
      { title: '7.6广义齐次泊松过程', icon: 'lucide:book', route: '/dashboard/question/chapter7/section6' },
      { title: '7.7非时齐泊松过程', icon: 'lucide:book', route: '/dashboard/question/chapter7/section7' },
      { title: '7.8复合泊松过程', icon: 'lucide:book', route: '/dashboard/question/chapter7/section8' },
    ],
  },
  {
    title: '第八章 平稳过程',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob8思维导图', icon: 'lucide:network' },
      { title: '8.1平稳过程的概念', icon: 'lucide:book', route: '/dashboard/question/chapter8/section1' },
      { title: '8.2平稳过程自相关函数的性质', icon: 'lucide:book', route: '/dashboard/question/chapter8/section2' },
      { title: '8.3联合平稳过程', icon: 'lucide:book', route: '/dashboard/question/chapter8/section3' },
      { title: '8.4互相关函数', icon: 'lucide:book', route: '/dashboard/question/chapter8/section4' },
      { title: '8.5随机分析', icon: 'lucide:book', route: '/dashboard/question/chapter8/section5' },
      { title: '8.6平稳过程的遍历性', icon: 'lucide:book', route: '/dashboard/question/chapter8/section6' },
      { title: '8.7平稳过程的谱分析', icon: 'lucide:book', route: '/dashboard/question/chapter8/section7' },
    ],
  },
  {
    title: '第九章 离散时间马氏链',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob9思维导图', icon: 'lucide:network' },
      { title: '9.1马氏链', icon: 'lucide:book' },
      { title: '9.2转移概率', icon: 'lucide:book', route: '/dashboard/question/chapter9/section2' },
      { title: '9.3马氏链的有限维分布', icon: 'lucide:book', route: '/dashboard/question/chapter9/section3' },
      { title: '9.4马氏链的状态分类', icon: 'lucide:book', route: '/dashboard/question/chapter9/section4' },
      { title: '9.5状态空间的分解', icon: 'lucide:book', route: '/dashboard/question/chapter9/section5' },
      { title: '9.6平稳分布', icon: 'lucide:book', route: '/dashboard/question/chapter9/section6' },
    ],
  },
  {
    title: '第十章 抽样分布',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob10思维导图', icon: 'lucide:network' },
      { title: '10.1抽样分布基本概念', icon: 'lucide:book', route: '/dashboard/question/chapter10/section1' },
      { title: '10.2常见抽样分布', icon: 'lucide:book', route: '/dashboard/question/chapter10/section2' },
      { title: '10.3抽样定理', icon: 'lucide:book', route: '/dashboard/question/chapter10/section3' },
    ],
  },
  {
    title: '第十一章 参数点估计',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob11思维导图', icon: 'lucide:network' },
      { title: '11.1矩估计', icon: 'lucide:book', route: '/dashboard/question/chapter11/section1' },
      { title: '11.2最大似然估计', icon: 'lucide:book', route: '/dashboard/question/chapter11/section2' },
      { title: '11.3估计量评价标准', icon: 'lucide:book', route: '/dashboard/question/chapter11/section3' },
    ],
  },
  {
    title: '第十二章 参数区间估计',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob12思维导图', icon: 'lucide:network' },
      { title: '12.1区间估计基本概念', icon: 'lucide:book', route: '/dashboard/question/chapter12/section1' },
      { title: '12.2单个正态总体', icon: 'lucide:book', route: '/dashboard/question/chapter12/section2' },
      { title: '12.3两个正态总体', icon: 'lucide:book', route: '/dashboard/question/chapter12/section3' },
    ],
  },
  {
    title: '第十三章 假设检验',
    icon: 'lucide:folder',
    children: [
      { title: 'Prob13思维导图', icon: 'lucide:network' },
      { title: '13.1假设检验基本概念', icon: 'lucide:book', route: '/dashboard/question/chapter13/section1' },
      { title: '13.2单正态总体', icon: 'lucide:book', route: '/dashboard/question/chapter13/section2' },
      { title: '13.3两个正态总体', icon: 'lucide:book', route: '/dashboard/question/chapter13/section3' },
    ],
  },
]);

export type { DrawerItem };

export {
  experimentItems,
  questionItems,
};
