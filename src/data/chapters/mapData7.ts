export const nodes = [{
  id: '07',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机过程',
  },
  class: 'nodrag',
}, {
  id: '0701',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机过程的基本概念',
  },
  class: 'nodrag',
}, {
  id: '070101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '样本点和时间的二元函数 \\{X(\\omega,t),\\omega\\in\\Omega, t\\in T\\}',
  },
  class: 'nodrag',
}, {
  id: '070102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '固定样本点，时间函数族',
  },
  class: 'nodrag',
}, {
  id: '070103',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '固定时间，随机变量族',
  },
  class: 'nodrag',
}, {
  id: '070104',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '固定样本点，固定时间，随机过程的状态就是确定的实数',
  },
  class: 'nodrag',
}, {
  id: '0702',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机过程的分类',
  },
  class: 'nodrag',
}, {
  id: '070201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '离散时间离散状态',
  },
  class: 'nodrag',
}, {
  id: '070202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '连续时间离散状态',
  },
  class: 'nodrag',
}, {
  id: '070203',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '离散时间连续状态',
  },
  class: 'nodrag',
}, {
  id: '070204',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '连续时间连续状态',
  },
  class: 'nodrag',
}, {
  id: '0703',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机过程的分布',
  },
  class: 'nodrag',
}, {
  id: '070301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '有限维分布函数族 \\{F(x_1,x_2,\\cdots,x_n;t_1,t_2,\\cdots,t_n),\\forall n\\in \\mathbb{N},\\forall t_1,t_2,\\cdots,t_n\\in T\\}',
  },
  class: 'nodrag',
}, {
  id: '0704',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机过程的数字特征',
  },
  class: 'nodrag',
}, {
  id: '070401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '均值函数',
  },
  class: 'nodrag',
}, {
  id: '070402',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '均方值函数',
  },
  class: 'nodrag',
}, {
  id: '070403',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '方差函数',
  },
  class: 'nodrag',
}, {
  id: '070404',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '自相关函数',
  },
  class: 'nodrag',
}, {
  id: '070405',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '自协方差函数',
  },
  class: 'nodrag',
}, {
  id: '0705',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '几类重要随机过程',
  },
  class: 'nodrag',
}, {
  id: '070501',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '独立增量过程',
  },
  class: 'nodrag',
}, {
  id: '070502',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '平稳过程',
  },
  class: 'nodrag',
}, {
  id: '070503',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '马尔可夫过程',
  },
  class: 'nodrag',
}, {
  id: '070504',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程',
  },
  class: 'nodrag',
}, {
  id: '070505',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '高斯过程',
  },
  class: 'nodrag',
}, {
  id: '070506',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '维纳过程',
  },
  class: 'nodrag',
}]

export const edges = [{
  id: 'e07~0701',
  source: '07',
  target: '0701',
  type: 'step',
}, {
  id: 'e0701~070101',
  source: '0701',
  target: '070101',
  type: 'step',
}, {
  id: 'e0701~070102',
  source: '0701',
  target: '070102',
  type: 'step',
}, {
  id: 'e0701~070103',
  source: '0701',
  target: '070103',
  type: 'step',
}, {
  id: 'e0701~070104',
  source: '0701',
  target: '070104',
  type: 'step',
}, {
  id: 'e07~0702',
  source: '07',
  target: '0702',
  type: 'step',
}, {
  id: 'e0702~070201',
  source: '0702',
  target: '070201',
  type: 'step',
}, {
  id: 'e0702~070202',
  source: '0702',
  target: '070202',
  type: 'step',
}, {
  id: 'e0702~070203',
  source: '0702',
  target: '070203',
  type: 'step',
}, {
  id: 'e0702~070204',
  source: '0702',
  target: '070204',
  type: 'step',
}, {
  id: 'e07~0703',
  source: '07',
  target: '0703',
  type: 'step',
}, {
  id: 'e0703~070301',
  source: '0703',
  target: '070301',
  type: 'step',
}, {
  id: 'e07~0704',
  source: '07',
  target: '0704',
  type: 'step',
}, {
  id: 'e0704~070401',
  source: '0704',
  target: '070401',
  type: 'step',
}, {
  id: 'e0704~070402',
  source: '0704',
  target: '070402',
  type: 'step',
}, {
  id: 'e0704~070403',
  source: '0704',
  target: '070403',
  type: 'step',
}, {
  id: 'e0704~070404',
  source: '0704',
  target: '070404',
  type: 'step',
}, {
  id: 'e0704~070405',
  source: '0704',
  target: '070405',
  type: 'step',
}, {
  id: 'e07~0705',
  source: '07',
  target: '0705',
  type: 'step',
}, {
  id: 'e0705~070501',
  source: '0705',
  target: '070501',
  type: 'step',
}, {
  id: 'e0705~070502',
  source: '0705',
  target: '070502',
  type: 'step',
}, {
  id: 'e0705~070503',
  source: '0705',
  target: '070503',
  type: 'step',
}, {
  id: 'e0705~070504',
  source: '0705',
  target: '070504',
  type: 'step',
}, {
  id: 'e0705~070505',
  source: '0705',
  target: '070505',
  type: 'step',
}, {
  id: 'e0705~070506',
  source: '0705',
  target: '070506',
  type: 'step',
}]
