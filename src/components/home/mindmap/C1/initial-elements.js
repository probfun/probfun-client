const position = { x: 0, y: 0 }

import './nodeStyles.css';  // 引入样式文件
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

export const initialNodes = [
  {
    id: '1',
    position: { x: 800, y: 0 },
        data: {
          label: `第一章：概率论的基本概念`, // 添加多行文本 
    },
    type: 'input',  // 为节点添加类型
    style: {
     // 设置背景颜色
      border: '2px solid #80a8c9', // 设置边框
      borderRadius: '10px', // 设置圆角
      fontSize: '20px', // 设置字体大小
      padding: '10px', // 内边距
      width: '350px',               // 固定宽度
      whiteSpace: 'pre-wrap',       // 允许换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',          // 居中对齐
    },draggable: false, // 禁止节点拖拽
  },
  
  {
    id: '2',
    position:{x:100,y:400},
    data: {
      label: '蒙特卡罗模拟',
    },
    type: 'output',  // 为节点添加类型
  },
  {
    id: '3',
    position:{x:300,y:400},
    data: {
      label: '独立事件',
    },
    type: 'output',  // 为节点添加类型
  },
  {
    id: '4',
    position:{x:500,y:400},
    data: {
      label: '条件概率（贝叶斯公式，全概率公式）',
    },
    type: 'output',  // 为节点添加类型
  },
  {
    id: '2a',
    position: { x: 25, y: 20 }, 
    data: {
      label: '生日问题',
    },
    parentNode : '13',
  },
  {
    id: '2b',
    position: { x: 225, y: 20 }, 
    data: {
      label: '生日攻击问题',
    },
    parentNode : '13',
    // style: {
    //   background: '#E8F5E9', // 设置背景颜色
    //   border: '2px solid #4CAF50', // 设置边框
    //   borderRadius: '10px', // 设置圆角
    //   fontSize: '14px', // 设置字体大小
    //   padding: '10px', // 内边距
    // },
     // 为节点添加类型
  },
  {
    id: '2c',
    position: { x: 75, y: 50 },
    data: {
      label: '阳性检测',
    },
    parentNode:'14', 
  },
  {
    id: '5',
    position:{x:700,y:400},
    data: {
      label: '大数定律',
    },
    type: 'output',  // 为节点添加类型
    // parentNode:'14', 
  },
  {
    id: '6',
    position: { x: 900, y: 50 },
    data: {
      label: 'Buffon投针',
    },
    type: 'type1',  // 为节点添加类型
    parentNode:'14', 
  },
  {
    id: '7',
    position: { x: 700, y: 50 },
    data: {
      label: '三门问题',
    },
    type: 'type1',  // 为节点添加类型
    parentNode:'14', 
  },
  {
    id: '8',
    position:{x:900,y:400},
    data: {
      label: '几何概率、概率密度',
    },
    type: 'output',  // 为节点添加类型
    
  }, {
    id: '9',
    position:{x:1100,y:400},
    data: {
      label: '排列组合',
    },
    type: 'output',  // 为节点添加类型
  },
  {
    id: '10',
    position:{x:1300,y:400},
    data: {
      label: '条件概率',
    },
    type: 'output',  // 为节点添加类型
  },
  {
    id: '11',
    position:{x:1500,y:400},
    data: {
      label: '泰勒展开',
    },
    type: 'output',  // 为节点添加类型

  },
  {
    id: '12',
    position:{x:1700,y:400},
    data: {
      label: '互补事件',
    },
    type: 'output',  // 为节点添加类型
  },
   {
    id: '14',
    position: { x: 450, y: 100 },
    // label:'实验',
    style: { 
       height: '150px', 
       width: '1100px' ,
       border: '4px solid #0069ff', 
       borderRadius: '12px',},
       
  }, {
    id: '13',
    position: { x: 250, y: 30 },

    style: { 
       height: '80px', 
       width: '400px' ,
       border: '2px solid #9be5ff', 
       borderRadius: '8px',
      },
    parentNode:'14', 
  },



]

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2a' },
  { id: 'e1-3', source: '1', target: '2b' },
  { id: 'e1-4', source: '1', target: '2c' },
  { id: 'e1-5', source: '1', target: '6' },
  { id: 'e1-9', source: '1', target: '7' },
 
  { id: 'eB1', source: '6', target: '2' },
  { id: 'eB2', source: '6', target: '3' },
  { id: 'eB3', source: '6', target: '5' },
  { id: 'eB4', source: '6', target: '8' },
  { id: 'eB5', source: '6', target: '10' },
  { id: 'eTD1', source: '7', target: '3' },
  { id: 'eTD2', source: '7', target: '4' },
  { id: 'B1', source: '2a', target: '2' },
  { id: 'B2', source: '2a', target: '5' },
  { id: 'B3', source: '2a', target: '9' },
  { id: 'B4', source: '2a', target: '12' },
  { id: 'BA1', source: '2b', target: '2' },
  { id: 'BA2', source: '2a', target: '2b',animated: true},
  { id: 'BA3', source: '2b', target: '10' },
  { id: 'BA4', source: '2b', target: '11' },
  { id: 'BA5', source: '2b', target: '3' },
  { id: 'P1', source: '2c', target: '3' },
  { id: 'P2', source: '2c', target: '4' },
  { id: 'P3', source: '2c', target: '10' },
  { id: 'P4', source: '2c', target: '12' },

]
