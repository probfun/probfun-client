import { Position } from '@vue-flow/core'

export const nodes = [
  {
    id: '01',
    type: 'latex',
    position: { x: 100, y: 100 },
    data: { formula: `第一章：概率论的基本概念` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '0101',
    type: 'latex',
    position: { x: 100, y: 250 },
    data: { formula: `1. 随机事件与样本空间` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    // style: '{width: 1000px}',
  },
  {
    id: '010101',
    type: 'latex',
    position: { x: 100, y: 400 },
    data: { formula: `1. 样本空间` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '010102',
    type: 'latex',
    position: { x: 400, y: 400 },
    data: { formula: `2. 随机事件` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '010103',
    type: 'latex',
    position: { x: 700, y: 400 },
    data: { formula: `3. 事件间的关系` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '010104',
    type: 'latex',
    position: { x: 1000, y: 400 },
    data: { formula: `4. 运算律` },
    draggable: false,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
]

export const edges = [
  {
    id: 'e01~0101',
    source: '01',
    target: '0101',
    type: 'step',
  },
  {
    id: 'e0101~010101',
    source: '0101',
    target: '010101',
    type: 'step',
  },
  {
    id: 'e0101~010102',
    source: '0101',
    target: '010102',
    type: 'step',
  },
  {
    id: 'e0101~010103',
    source: '0101',
    target: '010103',
    type: 'step',
  },
  {
    id: 'e0101~010104',
    source: '0101',
    target: '010104',
    type: 'step',
  },
]
