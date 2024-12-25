// 引入样式文件
import './nodeStyles.css';

export const initialNodes = [
  {
    id: '1',
    position: { x: 800, y: 100 },
    data: {
      label: `第四章：分组检测对期望的影响（以核酸检测为例）`, // 添加多行文本
    },
    type: 'input', // 为节点添加类型
    style: {
      // 设置背景颜色
      border: '2px solid #80a8c9', // 设置边框
      borderRadius: '10px', // 设置圆角
      fontSize: '20px', // 设置字体大小
      padding: '10px', // 内边距
      width: '550px', // 固定宽度
      whiteSpace: 'pre-wrap', // 允许换行
      overflow: 'hidden', // 隐藏超出部分
      textAlign: 'center', // 居中对齐
    },
    draggable: false, // 禁止节点拖拽
  },

  {
    id: '2',
    position: { x: 950, y: 250 },
    data: {
      label: '开始分组检测（总人数21800）',
    },
    style: {
      // 设置背景颜色
     
      padding: '10px', // 内边距
      width: '250px', // 固定宽度
      whiteSpace: 'pre-wrap', // 允许换行
      overflow: 'hidden', // 隐藏超出部分
      textAlign: 'center', // 居中对齐
    },

  },
  {
    id: '3',
    position: { x: 975, y: 375 },
    data: {
      label: '确定分组人数（eg：20/40/60/80人为一组）',
    },    style: {
      // 设置背景颜色
     
      padding: '10px', // 内边距
      width: '200px', // 固定宽度
      whiteSpace: 'pre-wrap', // 允许换行
      overflow: 'hidden', // 隐藏超出部分
      textAlign: 'center', // 居中对齐
    },

  },
  {
    id: '4',
    position: { x: 1000, y: 500 },
    data: {
      label: '检测结果',
    },

  },
  {
    id: '4a',
    position: { x: 800, y: 600 },
    data: {
      label: '对组内成员单独检测',
    },
    style: {
      // 设置背景颜色
      border: '4px solid rgb(175, 76, 76)', // 设置边框
      borderRadius: '10px', // 设置圆角
      width: '200px', // 固定宽度
      padding: '10px', // 内边距
      whiteSpace: 'pre-wrap', // 允许换行
      overflow: 'hidden', // 隐藏超出部分
      textAlign: 'center', // 居中对齐
    },
    },
  {
    id: '4b',
    position: { x: 1200, y: 600 },
    data: {
      label: '结束该组检测',
    },
    style: {
      // 设置背景颜色
      border: '4px solid rgb(105, 137, 200)', // 设置边框
      borderRadius: '10px', // 设置圆角
      padding: '10px', // 内边距
      whiteSpace: 'pre-wrap', // 允许换行
      overflow: 'hidden', // 隐藏超出部分
      textAlign: 'center', // 居中对齐
    },
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
    id: '5',
    position: { x: 1000, y: 700 },
    data: {
      label: '记录结果',
    },
    parentNode: '14',
  },
  {
    id: '6',
    position: { x: 1000, y: 800 },
    data: {
      label: '所有组检测完毕',
    },
   
    // parentNode:'14',
  },
  {
    id: '7',
    position: { x: 1000, y: 900 },
    data: {
      label: '流程结束',
    },
    type: 'type1', // 为节点添加类型
    parentNode: '14',
  },

]

export const initialEdges = [
  { id: 'e1-2', source: '2', target: '3' ,type: 'smoothstep',},
  { id: 'e1-3', source: '3', target: '4' ,type: 'smoothstep'},
  { 
    id: 'e1-4', 
    source: '4', 
    target: '4a', 
    type: 'smoothstep',
    label: '结果为阳性',
    style: {
      stroke: ' rgb(175, 76, 76)',  // 设置边的颜色为绿色
      strokeWidth: 2,      // 设置边的宽度
    },
    labelStyle: {
      fontSize: '18px',    // 设置标签字体更大
      fill: ' rgb(175, 76, 76)',     // 标签字体颜色与边相同
      fontWeight: 'bold',  // 设置标签字体加粗
    }
  },
  { 
    id: 'e1-5', 
    source: '4', 
    target: '4b', 
    type: 'smoothstep',
    label: '结果为阴性',
    style: {
      stroke: ' rgb(105, 137, 200)',  // 设置边的颜色为橙色
      strokeWidth: 2,     // 设置边的宽度
    },
    labelStyle: {
      fontSize: '18px',    // 设置标签字体更大
      fill: ' rgb(105, 137, 200)',     // 标签字体颜色与边相同
      fontWeight: 'bold',  // 设置标签字体加粗
    }
  },

  { id: 'e1-9', source: '4a', target: '5' ,type: 'smoothstep'},

  { id: 'eB1', source: '4b', target: '5' ,type: 'smoothstep'},
  { id: 'eB2', source: '5', target: '6' ,type: 'smoothstep'},
  { id: 'eB3', source: '6', target: '7' ,type: 'smoothstep'},


]
