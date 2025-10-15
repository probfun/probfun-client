import type { HomeConfig } from '@/components/subject/configs.ts';

const homeConfig: HomeConfig = {
  experiments: [
    {
      title: '均匀分布',
      description: '均匀分布是一种概率分布，表示在一个区间内所有结果出现的可能性相等，常用于模拟随机事件。',
      img: '/homePage/img_5.png',
      path: '/experiment/uniform-distribution',
    },
    {
      title: '蒙特卡洛计算π值',
      description: '蒙特卡洛方法是一种通过随机采样来解决数学问题的统计技术，常用于估算复杂函数的值或模拟物理系统。',
      img: '/homePage/img_6.png',
      path: '/experiment/EstimationOfPai',
    },
    {
      title: '三门问题',
      description: '三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇门，选手可以选择换或不换门。',
      img: '/homePage/threeDoors.png',
      path: '/experiment/three-doors',
    },
    {
      title: '分组检测',
      description: '分组检测是一种统计检测策略，通过将多个样本合并检测来提高检测效率，在阳性率较低的情况下可以显著降低检测成本。',
      img: '/homePage/img_7.png',
      path: '/experiment/group-detection',
    },
  ],
  mindMaps: [
    // {
    //   title: '第一章',
    //   description: '第一章主要涉及概率相关的实验。包含的知识点有：概率的基本概念、大数定律、条件概率、事件独立性等。',
    //   img: '/homePage/C1.png',
    //   path: '/mindmap/chapter-1',
    // },
    {
      title: '分布关系',
      description: '分布关系是概率论中的重要概念，描述了不同概率分布之间的联系和转换。理解这些关系有助于更好地应用统计方法进行数据分析和建模。',
      img: '/homePage/img_9.png',
      path: '/mindmap/distribution',
    },
    // {
    //   title: '第四章',
    //   description: '期望检验是统计学中的重要方法，用于分析样本数据与理论预期值之间的差异。通过分组检测，我们可以判断不同组别数据的期望值是否存在显著差异，这在医学研究、质量控制和社会调查等领域有广泛应用。',
    //   img: '/homePage/group.png',
    //   path: '/mindmap/chapter-4',
    // },
  ],
  thinking: [
    {
      title: '第1周 每周一思',
      description: [
        '1）柯尔莫哥洛夫的公理化体系将概率定义为满足非负性、规范性和可列可加性的测度，现实中的不确定性是否都可以用这一框架描述？',
        '2）概率是客观存在还是主观建构？',
      ],
    },
  ],
};

export { homeConfig };
