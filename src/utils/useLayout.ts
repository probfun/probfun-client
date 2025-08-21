import dagre from '@dagrejs/dagre'
import { type Edge, type Node, Position, useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
  const { findNode } = useVueFlow()

  const graph = ref<dagre.graphlib.Graph>(new dagre.graphlib.Graph())

  const previousDirection = ref<'LR' | 'TB'>('LR')

  function layout(nodes: Node[], edges: Edge[], direction: 'LR' | 'TB'): Node[] {
    // Create a new graph instance for fresh computation
    const dagreGraph = new dagre.graphlib.Graph()
    graph.value = dagreGraph

    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({
      rankdir: direction,
      // nodesep: 100, // 增加同层节点的间距
      ranksep: 150, // 增加不同层级节点的间距
    })

    previousDirection.value = direction

    for (const node of nodes) {
      // Use the `findNode` method to get node dimensions from Vue Flow
      const graphNode = findNode(node.id)
      dagreGraph.setNode(node.id, {
        width: graphNode?.dimensions?.width || 150,
        height: graphNode?.dimensions?.height || 50,
      })
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target)
    }

    dagre.layout(dagreGraph)

    // console.log(nodes)
    // Map nodes to updated positions
    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      // console.log(isHorizontal)
      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
      }
    })
  }

  return { graph, layout, previousDirection }
}
