import dagre from '@dagrejs/dagre';
import { Position, useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';

export function useLayout() {
  const { findNode } = useVueFlow();

  const graph = ref(new dagre.graphlib.Graph());
  const previousDirection = ref('LR');

  function layout(nodes, edges, direction) {
    const dagreGraph = new dagre.graphlib.Graph();
    graph.value = dagreGraph;
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({
      rankdir: direction,
      nodesep: 50,
      ranksep: 5,
      marginx: 20,
      marginy: 20,
    });

    previousDirection.value = direction;

    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    const edgeMap = {};
    edges.forEach((edge) => {
      if (!edgeMap[edge.source]) {
        edgeMap[edge.source] = [];
      }
      edgeMap[edge.source].push(edge.target);
    });

    const rootNodeId = nodes.find(node =>
      !edges.some(edge => edge.target === node.id),
    )?.id;
    if (!rootNodeId) {
      console.warn('未找到根节点');
      return nodes;
    }

    const secondaryParentId = rootNodeId;
    const secondaryChildIds = edgeMap[secondaryParentId] || [];
    const secondaryOffsets = [450, 450, 450, 450];
    const secondaryOffsetMap = {};
    secondaryChildIds.forEach((childId, index) => {
      secondaryOffsetMap[childId] = secondaryOffsets[index];
    });

    const tertiaryParentIds = secondaryChildIds;
    const tertiaryOffsets = [100, 320, 600, 925];
    const tertiaryOffsetMap = {};

    tertiaryParentIds.forEach((parentId, parentIndex) => {
      const tertiaryChildIds = edgeMap[parentId] || [];
      const currentTertiaryOffset = tertiaryOffsets[parentIndex];
      tertiaryChildIds.forEach((childId) => {
        tertiaryOffsetMap[childId] = currentTertiaryOffset;
      });
    });

    for (const node of nodes) {
      const graphNode = findNode(node.id);
      dagreGraph.setNode(node.id, {
        width: graphNode.dimensions.width || 150,
        height: graphNode.dimensions.height || 50,
      });
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target);
    }

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      let { x, y } = nodeWithPosition;

      if (Object.prototype.hasOwnProperty.call(secondaryOffsetMap, node.id)) {
        y -= secondaryOffsetMap[node.id];
      }

      if (Object.prototype.hasOwnProperty.call(tertiaryOffsetMap, node.id)) {
        y -= tertiaryOffsetMap[node.id];
      }

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x, y },
      };
    });
  }

  return { graph, layout, previousDirection };
}
