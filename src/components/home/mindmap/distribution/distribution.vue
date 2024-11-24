<script>
import { ref, defineComponent } from 'vue';
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
    const { onInit,  setViewport, toObject } = useVueFlow();
    const nodes = ref(initialNodes);
    const edges = ref(initialEdges);
    const dark = ref(false);

    // 随机布局
    const updatePos = () => {
      console.log('Shuffle Node Positions clicked!');
      nodes.value = nodes.value.map((node) => ({
        ...node,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        dragging: false, // 重置 dragging 状态
      }));
    };


    // 自动布局 (使用 dagre)
    const applyAutoLayout = () => {
      // 设置 dagre 布局方向
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
          position: {
            x: dagreNode.x,
            y: dagreNode.y,
          },
          // VueFlow 特殊要求，更新布局后将 `dragging` 属性设为 false
          dragging: false,
        };
      });
    };

    // 处理节点拖动停止事件
  const handleNodeDragStop = (event) => {
    const { node } = event;
    console.log(`Node ${node.id} moved to new position:`, node.position);

    // 更新节点的新位置到 `nodes` 数组
    nodes.value = nodes.value.map((n) => {
      if (n.id === node.id) {
        return {
          ...n,
          position: node.position,  // 更新节点的位置
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

    onInit((vueFlowInstance) => {
      vueFlowInstance.fitView();
    });

    return {
      nodes,
      edges,
      dark,
      updatePos,
      applyAutoLayout,
      logToObject,
      resetTransform,
      toggleDarkMode,
    };
  },
});
</script>



<template>
  <VueFlow :nodes="nodes" :edges="edges" :class="{ dark }" class="basic-flow" @nodeDragStop="handleNodeDragStop"
    :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">


    <Background pattern-color="#aaa" :gap="16" />

    <MiniMap />

    <Controls position="top-left">
      <Button title="Reset Transform" @click="resetTransform">
        <Icon name="reset" />
      </Button>

      <Button title="Shuffle Node Positions" @click="updatePos">
        <Icon name="update" />
      </Button>

      <Button title="Apply Auto Layout" @click="applyAutoLayout">
        <Icon name="layout" />
      </Button>

      <Button title="Toggle Dark Mode" @click="toggleDarkMode">
        <Icon v-if="dark" name="sun" />
        <Icon v-else name="moon" />
      </Button>

      <ControlButton title="Log `toObject`" @click="logToObject">
        <Icon name="log" />
      </ControlButton>
    </Controls>
  </VueFlow>
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
</style>
