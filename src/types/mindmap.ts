export interface MindMap {
}

export interface MindMapData {
  chapterId?: string
  edges: MindMapEdge[]
  nodes: MindMapNode[]
}

export interface MindMapEdge {
  /**
   * 例如节点01到节点0101，边id为'e01~0101'
   */
  id: string
  source: string
  target: string
  type: string
}

export interface MindMapNode {
  class: string
  data: NodeData
  id: string
  position: Position
  type: string
}

export interface NodeData {
  label: string
  masteredRate?: number
  notes: Notes[]
}

export interface Notes {
  content: string
  /**
   * 根据老师要求，多模态，学生的notes可以是文件类型，这里存url。一个学生的一个知识点可以有多个notes的resource（url）
   */
  resources: Resource
}

export interface Resource {
  type: string
  url: string
}

export interface Position {
  x: number
  y: number
}
