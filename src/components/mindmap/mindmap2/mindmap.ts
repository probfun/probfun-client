// 引入样式文件
import './nodeStyles.css';

export const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      label: `第二章 一维随机变量`,
      level: 1,
    },
    type: 'input',
    draggable: false, // 禁止节点拖拽
  },

  {
    id: '2',
    position: { x: -1050, y: 150 },
    data: {
      label: '随机变量及其分布函数',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '3',
    position: { x: -350, y: 150 },
    data: {
      label: '离散型随机变量',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '4',
    position: { x: 550, y: 150 },
    data: {
      label: '连续型随机变量',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '5',
    position: { x: 1200, y: 150 },
    data: {
      label: '一维随机变量函数的分布',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },

  {
    id: '6',
    position: { x: -100, y: 150 },
    data: {
      label: '随机变量的定义和分类',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '2',
  },
  {
    id: '7',
    position: { x: 100, y: 150 },
    data: {
      label: '分布函数的定义及性质',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '2',
  },
  {
    id: '8',
    position: { x: -400, y: 150 },
    data: {
      label: '离散型随机变量及其概率函数（分布律）',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '9',
    position: { x: -200, y: 150 },
    data: {
      label: '两点分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '10',
    position: { x: 0, y: 150 },
    data: {
      label: '二项分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '11',
    position: { x: 200, y: 150 },
    data: {
      label: '泊松分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '12',
    position: { x: 400, y: 150 },
    data: {
      label: '几何分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '13',
    position: { x: -300, y: 150 },
    data: {
      label: '概率密度函数p.d.f.',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '14',
    position: { x: -100, y: 150 },
    data: {
      label: '均匀分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '15',
    position: { x: 100, y: 150 },
    data: {
      label: '指数分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '16',
    position: { x: 300, y: 150 },
    data: {
      label: '正态分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '17',
    position: { x: -150, y: 150 },
    data: {
      label: '离散型一维随机变量函数的分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '5',
  },
  {
    id: '18',
    position: { x: 50, y: 150 },
    data: {
      label: '连续型一维随机变量函数的分布',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '5',
  },
  {
    id: '19',
    position: { x: 250, y: 150 },
    data: {
      label: '一维随机变量函数分布的特殊公式',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '5',
  },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'step' },
  { id: 'e1-3', source: '1', target: '3', type: 'step' },
  { id: 'e1-4', source: '1', target: '4', type: 'step' },
  { id: 'e1-5', source: '1', target: '5', type: 'step' },

  { id: 'e2-6', source: '2', target: '6', type: 'step' },
  { id: 'e2-7', source: '2', target: '7', type: 'step' },
  { id: 'e3-8', source: '3', target: '8', type: 'step' },
  { id: 'e3-9', source: '3', target: '9', type: 'step' },
  { id: 'e3-10', source: '3', target: '10', type: 'step' },
  { id: 'e3-11', source: '3', target: '11', type: 'step' },
  { id: 'e3-12', source: '3', target: '12', type: 'step' },
  { id: 'e4-13', source: '4', target: '13', type: 'step' },
  { id: 'e4-14', source: '4', target: '14', type: 'step' },
  { id: 'e4-15', source: '4', target: '15', type: 'step' },
  { id: 'e4-16', source: '4', target: '16', type: 'step' },
  { id: 'e5-17', source: '5', target: '17', type: 'step' },
  { id: 'e5-18', source: '5', target: '18', type: 'step' },
  { id: 'e5-19', source: '5', target: '19', type: 'step' },
];
