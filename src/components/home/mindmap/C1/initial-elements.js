const position = { x: 0, y: 0 }

export const initialNodes = [
  {
    id: '1',
    position,
    data: {
      label: '第一章：概率论的基本概念',
    },
  },
  {
    id: '2',
    position,
    data: {
      label: '蒙特卡罗模拟',
    },
  },
  {
    id: '3',
    position,
    data: {
      label: '独立事件',
    },
  },
  {
    id: '4',
    position,
    data: {
      label: '条件概率（贝叶斯公式，全概率公式）',
    },
  },
  {
    id: '2a',
    position,
    data: {
      label: '生日问题',
    },
  },
  {
    id: '2b',
    position,
    data: {
      label: '生日攻击问题',
    },
  },
  {
    id: '2c',
    position,
    data: {
      label: '阳性检测',
    },
  },
  {
    id: '5',
    position,
    data: {
      label: '大数定律',
    },
  },
  {
    id: '6',
    position,
    data: {
      label: 'Buffon投针',
    },
  },
  {
    id: '7',
    position,
    data: {
      label: '三门问题',
    },
  },
  {
    id: '8',
    position,
    data: {
      label: '几何概率、概率密度',
    },
  }, {
    id: '9',
    position,
    data: {
      label: '排列组合',
    },
  },
  {
    id: '10',
    position,
    data: {
      label: '条件概率',
    },
  },
  {
    id: '11',
    position,
    data: {
      label: '泰勒展开',
    },
  },
  {
    id: '12',
    position,
    data: {
      label: '互补事件',
    },
  },
]

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e1-5', source: '1', target: '5' },
  { id: 'eB1', source: '2', target: '6' },
  { id: 'eB2', source: '3', target: '6' },
  { id: 'eB3', source: '5', target: '6' },
  { id: 'eB4', source: '6', target: '8' },
  { id: 'eB5', source: '6', target: '10' },
  { id: 'eTD1', source: '3', target: '7' },
  { id: 'eTD2', source: '4', target: '7' },
  { id: 'B1', source: '2', target: '2a' },
  { id: 'B2', source: '5', target: '2a' },
  { id: 'B3', source: '2a', target: '9' },
  { id: 'B4', source: '2a', target: '12' },
  { id: 'BA1', source: '2', target: '2b' },
  { id: 'BA2', source: '2b', target: '2a' },
  { id: 'BA3', source: '2b', target: '10' },
  { id: 'BA4', source: '2b', target: '11' },
  { id: 'BA5', source: '3', target: '2b' },
  { id: 'P1', source: '3', target: '2c' },
  { id: 'P2', source: '4', target: '2c' },
  { id: 'P3', source: '2c', target: '10' },
  { id: 'P4', source: '2c', target: '12' },

]
