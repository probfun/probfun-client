<script>
import { ref, defineComponent, nextTick, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls, ControlButton } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import dagre from 'dagre'; // 引入 dagre
import { initialEdges, initialNodes } from './initial-elements.js';
import Icon from '../Icon.vue';

export default defineComponent({
  components: { VueFlow, Background, Controls, MiniMap, Icon },
  setup() {
    const { onInit, setViewport, fitView, toObject } = useVueFlow();
    const nodes = ref(initialNodes);
    const edges = ref(initialEdges);
    const dark = ref(false);
    const searchQuery = ref(""); // 用来绑定搜索框的输入内容


    // 搜索节点并定位
    const searchNode = () => {
     // 移除之前的高亮节点
  nodes.value.forEach((node) => {
    node.class = node.class?.replace('highlight-node', '');  // 移除之前的高亮
  });

  const node = nodes.value.find(n =>
    n.data.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

      if (node) {
        // 高亮当前匹配节点
        node.class = 'highlight-node';

        // 找到匹配的节点，定位到视图中间
        // const nodePosition = node.position;
        // const viewport = {
        //   x: nodePosition.x - 250,  // 将节点移到视图中心
        //   y: nodePosition.y - 150,  // 调整Y坐标以使节点居中
        //   zoom: 1.5  // 可调整缩放比例
        // };
        setViewport(viewport);
      }
    };

    // 自动布局 (使用 dagre)
    const applyAutoLayout = () => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: 'LR', nodesep: 50, edgesep: 10, ranksep: 100 });

      // 添加节点到 dagre 图
      nodes.value.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 200, height: 100 });
      });

      // 添加边到 dagre 图
      edges.value.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      // 运行布局计算
      dagre.layout(dagreGraph);

      // 更新节点位置
      nodes.value = nodes.value.map((node) => {
        const dagreNode = dagreGraph.node(node.id);
        return {
          ...node,
          class: node.class || '',
          position: {
            x: dagreNode.x,
            y: dagreNode.y,
          },
          dragging: false,
        };
      });
    };

    // 节点拖动事件处理
    const handleNodeDragStop = (event) => {
      const { node } = event;
      console.log(`Node ${node.id} moved to new position:`, node.position);
      nodes.value = nodes.value.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            position: node.position,
          };
        }
        return n;
      });
    };

    // 打印当前图形状态
    const logToObject = () => {
      console.log(toObject());
    };

    // 重置视图
    const resetTransform = () => {
      setViewport({ x: 0, y: 0, zoom: 1 });
    };

    // 切换暗模式
    const toggleDarkMode = () => {
      dark.value = !dark.value;
    };



    // 自定义初始视图
    const customViewport = {
      x: -500,  // 初始 X 坐标
      y: 50,   // 初始 Y 坐标
      zoom: 0.5, // 初始缩放比例
    };

    // 初始化 VueFlow 时调用自动布局并适配视图
    onMounted(() => {
      nextTick(() => {
        applyAutoLayout(); // 应用自动布局
        setViewport(customViewport);
        // fitView(); // 调整视图以适配所有节点和边
      });
    });

    // 控制悬浮框的显示和位置
    const showTooltip = ref(false); // 控制是否显示悬浮框
    const tooltipStyle = ref({
      position: 'absolute',
      bottom: '50px',
      left: '50px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
    });
    // 切换悬浮框的显示状态
    const toggleTooltip = () => {
      showTooltip.value = !showTooltip.value; // 切换显示与隐藏
    };


    return {
      showTooltip,
      tooltipStyle,
      toggleTooltip,
      nodes,
      edges,
      dark,
      handleNodeDragStop,
      applyAutoLayout,
      logToObject,
      resetTransform,
      toggleDarkMode,
      searchQuery,
      searchNode
    };
  },
});
   
</script>





<template>
   <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="searchNode"
        placeholder="搜索节点"
        class="search-input"
      />
    </div>
  <VueFlow :nodes="nodes" :edges="edges" :class="{ dark }" class="basic-flow" @nodeDragStop="handleNodeDragStop"
    :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
    <Background pattern-color="#aaa" :gap="16" />

    <MiniMap />

    <Controls position="top-left" class = "border-none">
      <Button title="背景" @click="toggleDarkMode" class = "ml-4 mr-4">
        切换背景
        <Icon v-if="dark" name="sun" />
        <Icon v-else name="moon" />
      </Button>

         <!-- 添加控制悬浮框显示的按钮 -->
         <Button title="图例" @click="toggleTooltip">
          显示图例
        <Icon name="info" />
      </Button>
    </Controls>
  </VueFlow>
  <div v-if="showTooltip" :style="tooltipStyle" class="tooltip">
    <div class="tooltip-content">
      <div class="column">
        <p class="highlight"><strong>Properties:</strong> </p>
        <p><strong>C</strong> convolution</p>
        <p><strong>F</strong> forgetfulness</p>
        <p><strong>I</strong> inverse</p>
        <p><strong>L</strong> linear combination</p>
        <p><strong>M</strong> minimum</p>
        <p><strong>P</strong> product</p>
        <p><strong>R</strong> residual</p>
        <p><strong>S</strong> scaling</p>
        <p><strong>V</strong> variate generation</p>
        <p><strong>X</strong> maximum</p>
      </div>
      <div class="column">

        <p><strong>L → C</strong> </p>
        <p><strong>L → S</strong> </p>
        <p><strong>F → R</strong> </p>
        <p class="highlight"><strong>Relationships:</strong> </p>
        <p><strong>special cases:</strong> ——></p>
        <p><strong>limiting:</strong>---------—></p>
        <p><strong>bayesian:</strong>--------—></p>
        <p><strong>transformations:</strong> <span class="highlight-text">—————></span></p>

      </div>
    </div>
  </div>


</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.5/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.5/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

html,
body,
#app {
  margin: 0;
  height: 100%;
}

#app {
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.basic-flow.dark {
  background: #2d3748;
  color: #fffffb
}

.basic-flow.dark .vue-flow__node {
  background: #4a5568;
  color: #fffffb
}

.basic-flow.dark .vue-flow__node.selected {
  background: #333;
  box-shadow: 0 0 0 2px #2563eb
}

.basic-flow .vue-flow__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center
}

.basic-flow.dark .vue-flow__controls {
  border: 1px solid #FFFFFB
}

.basic-flow .vue-flow__controls .vue-flow__controls-button {
  border: none;
  border-right: 1px solid #eee
}

.basic-flow .vue-flow__controls .vue-flow__controls-button svg {
  height: 100%;
  width: 100%
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button {
  background: #333;
  fill: #fffffb;
  border: none
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button:hover {
  background: #4d4d4d
}

.basic-flow.dark .vue-flow__edge-textbg {
  fill: #292524
}

.basic-flow.dark .vue-flow__edge-text {
  fill: #fffffb
}

.light {
  white-space: pre-line;
  /* 支持换行符 */
}

.tooltip {
  font-size: 14px;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  text-align: left;
  /* 让所有内容左对齐 */
  user-select: none;
}

.tooltip-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  user-select: none;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.column p {
  margin: 0;
}

/* 对特定行文字改变颜色 */
.highlight {
  font-size: 20px;
  /* 设置行颜色 */
  user-select: none;
}

.highlight-text {
  color: orange;
  /* 设置部分文字颜色 */
  user-select: none;
}
.search-container {
  position: absolute;
  top: 65px;
  left: 400px;
  z-index: 1000;
  color:rgb(0, 0, 0);
}

.search-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.highlight-node {
  border: 2px solid red !important;  /* 红色边框表示高亮 */
  background-color: rgba(255, 0, 0, 0.1); /* 背景色轻微红色 */
}
</style>
