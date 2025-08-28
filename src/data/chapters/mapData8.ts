export const nodes = [{
  id: '08',
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
  id: '0801',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程的三种等价定义',
  },
  class: 'nodrag',
}, {
  id: '080101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '实际应用角度',
  },
  class: 'nodrag',
}, {
  id: '080102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '统计分布角度',
  },
  class: 'nodrag',
}, {
  id: '080103',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '构造角度',
  },
  class: 'nodrag',
}, {
  id: '0802',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程与均匀分布',
  },
  class: 'nodrag',
}, {
  id: '080201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '发生时刻的分布的分布',
  },
  class: 'nodrag',
}, {
  id: '0803',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程与二项分布、多项分布',
  },
  class: 'nodrag',
}, {
  id: '080301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: 'N(t)=n的条件下，N(s)的分布为二项分布（0<s\\leq t）',
  },
  class: 'nodrag',
}, {
  id: '080302',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '在任意有限多个互不相交区间上服从多项分布',
  },
  class: 'nodrag',
}, {
  id: '0804',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程的叠加',
  },
  class: 'nodrag',
}, {
  id: '080401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '多个相互独立的泊松过程的叠加仍是一个泊松过程',
  },
  class: 'nodrag',
}, {
  id: '0805',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '泊松过程的稀释',
  },
  class: 'nodrag',
}, {
  id: '080501',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '一个泊松过程可以分解成多个独立的泊松过程',
  },
  class: 'nodrag',
}, {
  id: '0806',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '广义齐次泊松过程',
  },
  class: 'nodrag',
}, {
  id: '080601',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '允许同一个时刻有多个事件同时发生',
  },
  class: 'nodrag',
}, {
  id: '0807',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '非时齐泊松过程',
  },
  class: 'nodrag',
}, {
  id: '080701',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '强度不再是常数，而是时间t的函数',
  },
  class: 'nodrag',
}, {
  id: '0808',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '复合泊松过程',
  },
  class: 'nodrag',
}, {
  id: '080801',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '随机事件的到达伴随有随机取值的问题',
  },
  class: 'nodrag',
}];

export const edges = [{
  id: 'e08~0801',
  source: '08',
  target: '0801',
  type: 'step',
}, {
  id: 'e0801~080101',
  source: '0801',
  target: '080101',
  type: 'step',
}, {
  id: 'e0801~080102',
  source: '0801',
  target: '080102',
  type: 'step',
}, {
  id: 'e0801~080103',
  source: '0801',
  target: '080103',
  type: 'step',
}, {
  id: 'e08~0802',
  source: '08',
  target: '0802',
  type: 'step',
}, {
  id: 'e0802~080201',
  source: '0802',
  target: '080201',
  type: 'step',
}, {
  id: 'e08~0803',
  source: '08',
  target: '0803',
  type: 'step',
}, {
  id: 'e0803~080301',
  source: '0803',
  target: '080301',
  type: 'step',
}, {
  id: 'e0803~080302',
  source: '0803',
  target: '080302',
  type: 'step',
}, {
  id: 'e08~0804',
  source: '08',
  target: '0804',
  type: 'step',
}, {
  id: 'e0804~080401',
  source: '0804',
  target: '080401',
  type: 'step',
}, {
  id: 'e08~0805',
  source: '08',
  target: '0805',
  type: 'step',
}, {
  id: 'e0805~080501',
  source: '0805',
  target: '080501',
  type: 'step',
}, {
  id: 'e08~0806',
  source: '08',
  target: '0806',
  type: 'step',
}, {
  id: 'e0806~080601',
  source: '0806',
  target: '080601',
  type: 'step',
}, {
  id: 'e08~0807',
  source: '08',
  target: '0807',
  type: 'step',
}, {
  id: 'e0807~080701',
  source: '0807',
  target: '080701',
  type: 'step',
}, {
  id: 'e08~0808',
  source: '08',
  target: '0808',
  type: 'step',
}, {
  id: 'e0808~080801',
  source: '0808',
  target: '080801',
  type: 'step',
}];
