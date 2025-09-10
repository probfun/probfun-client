// 引入样式文件
import './nodeStyles.css';

export const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      label: `第一章 概率论的基本概念`, // 添加多行文本
      level: 1,
    },
    type: 'input',
    draggable: false, // 禁止节点拖拽
  },

  {
    id: '2',
    position: { x: -800, y: 150 },
    data: {
      label: '样本空间与随机事件',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '3',
    position: { x: -400, y: 150 },
    data: {
      label: '事件的概率',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '4',
    position: { x: 150, y: 150 },
    data: {
      label: '条件概率',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },
  {
    id: '5',
    position: { x: 850, y: 150 },
    data: {
      label: '事件的独立性',
      level: 2,
    },
    draggable: false, // 禁止节点拖拽
    parentNode: '1',
  },

  {
    id: '6',
    position: { x: -100, y: 150 },
    data: {
      label: '随机试验、样本空间和随机事件',
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
      label: '事件间的关系与运算',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '2',
  },
  {
    id: '8',
    position: { x: -100, y: 150 },
    data: {
      label: '概率的三种解释：频率、古典概型、几何概型',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '9',
    position: { x: 100, y: 150 },
    data: {
      label: '概率的公理化定义及性质',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '3',
  },
  {
    id: '10',
    position: { x: -250, y: 150 },
    data: {
      label: '条件概率的定义与性质',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '11',
    position: { x: -50, y: 150 },
    data: {
      label: '乘法公式',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '12',
    position: { x: 150, y: 150 },
    data: {
      label: '全概率公式',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '13',
    position: { x: 350, y: 150 },
    data: {
      label: '贝叶斯公式',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '4',
  },
  {
    id: '14',
    position: { x: -150, y: 150 },
    data: {
      label: '两事件相互独立',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '5',
  },
  {
    id: '15',
    position: { x: 50, y: 150 },
    data: {
      label: 'n个事件相互独立',
      level: 3,
    },
    type: 'output',
    draggable: false, // 禁止节点拖拽
    parentNode: '5',
  },
  {
    id: '16',
    position: { x: 250, y: 150 },
    data: {
      label: 'n重伯努利概型',
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
  { id: 'e4-10', source: '4', target: '10', type: 'step' },
  { id: 'e4-11', source: '4', target: '11', type: 'step' },
  { id: 'e4-12', source: '4', target: '12', type: 'step' },
  { id: 'e4-13', source: '4', target: '13', type: 'step' },
  { id: 'e5-14', source: '5', target: '14', type: 'step' },
  { id: 'e5-15', source: '5', target: '15', type: 'step' },
  { id: 'e5-16', source: '5', target: '16', type: 'step' },
];
