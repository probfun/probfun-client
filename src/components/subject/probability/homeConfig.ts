import type { HomeConfig } from '@/components/subject/configs.ts';

const homeConfig: HomeConfig = {
  experiments: [
    {
      title: '正态分布',
      description: '正态分布是一种常见的分布。在正态分布中，大多数数据集中在平均值附近，这种分布经常出现在自然现象和日常生活中。',
      img: '/homePage/normalDistribution.png',
      path: '/experiment/normal-distribution',
    },
    {
      title: '泊松分布',
      description: '泊松分布是一种预测在一定时间或空间内随机事件发生次数的统计方法，它基于一个参数λ，这个参数表示平均发生次数。',
      img: '/homePage/poissonDistribution.png',
      path: '/experiment/poisson-distribution',
    },
    {
      title: '三门问题',
      description: '三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇门，选手可以选择换或不换门。',
      img: '/homePage/threeDoors.png',
      path: '/experiment/three-doors',
    },
    {
      title: 'Buffon投针',
      description: 'Buffon投针问题是一个通过随机投掷针到平行线板上，通过针与线的相交数量来估算圆周率π的几何概率实验。',
      img: '/homePage/buffonNeedle.png',
      path: '/experiment/buffon',
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
      img: '/homePage/distribution.png',
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
