import { MarkerType } from '@vue-flow/core'



let nodeIdCounter = 1; // 初始化计数器

const defaultStyle = {
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  textAlign: 'center',
  width: '200px',
  border: '2px solid #80a8c9',
  borderRadius: '8px',
  padding: '10px',
  backgroundColor: '#f9f9f9',
};

// 定义一个函数生成节点
function createNode(data, position, style = {}, type = 'default', className = 'light') {
  return {
    id: (nodeIdCounter++).toString(), // 自增 id
    data,
    position,
    style:{defaultStyle},
    type,
    class: className,
  };
}

export const initialNodes = [
  createNode({ label: `Discrete uniform(a,b)\n R,V` }, { x: 100, y: 100 }),
  createNode({ label: 'Zipf(α,n)' }, { x: 250, y: 0 }),
  createNode({ label: 'Beta-binomial\n(a,b,n)' }, { x: 400, y: 100 }, { width: '300px' }), 
  createNode({ label: 'Negative hypergeometric(n1,n2,n3)' }, {  x: 300, y: 300}),
  createNode({ label: 'Rectangular(n)\nV' }, { x: 250, y: 0 }),

  {
    id: '5',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },  {
    id: '6',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },  {
    id: '7',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },  {
    id: '8',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },  {
    id: '9',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },  {
    id: '10',

    data: { label: 'Negative hypergeometric(n1,n2,n3)' },
    position: { x: 300, y: 300 },
    style: {
      whiteSpace: 'pre-wrap',       // 自动换行
      overflow: 'hidden',           // 隐藏超出部分
      textAlign: 'center',           // 左对齐文本
      width: '200px',               // 设置宽度为 200px
      // border: '2px solid #80a8c9',  // 设置边框
      borderRadius: '8px',          // 添加圆角
      padding: '10px',              // 内边距
    },
  },
]


// 默认的边样式
const defaultEdgeOptions = {
  markerEnd: {
    type: 'arrowclosed', // 默认箭头类型
    color: '#000',       // 默认箭头颜色
  },
  animated: false,         // 默认动画效果
  style: { strokeWidth: 2, stroke: '#80a8c9' }, // 默认边样式
};

// 封装创建边的函数
function createEdge({ id, source, target, label = '', options = {} }) {
  return {
    id,
    source,
    target,
    label,
    ...defaultEdgeOptions, // 使用默认参数
    ...options,            // 自定义覆盖参数
  };
}



export const initialEdges = [
  createEdge({ id: 'e1-2', source: '1', target: '2' }),
  createEdge({ id: 'e2-3', source: '2', target: '3', label: 'Example' }),
  
]


