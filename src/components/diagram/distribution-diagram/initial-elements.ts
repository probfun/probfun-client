import type { NodeOptions } from '@/api/distribution/distributionType';
import { useDistributionStore } from '@/store';
import { MarkerType } from '@vue-flow/core';
import 'katex/dist/katex.min.css';

let nodeIdCounter = 1; // 初始化计数器
// const defaultStyle = {
//   whiteSpace: 'pre-wrap',
//   overflow: 'hidden',
//   textAlign: 'center',
//   width: '200px',
//   border: '2px solid #80a8c9',
//   borderRadius: '8px',
//   padding: '10px',
//   backgroundColor: '#f9f9f9',
// };

export function createDistributionNode({ label, position, chineseTranslation, pdf, expId, description }: NodeOptions) {
  return {
    id: (nodeIdCounter++).toString(), // 自增 id
    data: { label, chineseTranslation, pdf, expId, description },
    position,
    type: 'distribution',
  };
}

export function initialNodes() {
  const distributionStore = useDistributionStore();
  const nodeData = distributionStore.nodeData;
  const sortedNodeData = nodeData.sort((a, b) => {
    if (a.description && !b.description)
      return -1;
    if (!a.description && b.description)
      return 1;
    return 0;
  });
  nodeIdCounter = 1;
  return sortedNodeData.map((data) => {
    return createDistributionNode(data);
  })
}

const defaultEdgeOptions = {
  markerEnd: {
    type: 'arrowclosed',
    color: '#000',
  },
  animated: false,
  style: { strokeWidth: 30, stroke: '#80a8c9' },
};

interface EdgeOptions {
  id: string
  source: string
  target: string
  label?: string
  options?: any
  style?: any
  markerEnd?: MarkerType
}

function createEdge({ id, source, target, label = '', options = {} }: EdgeOptions) {
  const { style = {} } = options;
  const { stroke } = style;
  // 新增 labelStyle 用于设置 label 的样式
  const labelStyle = {
    fontSize: '15px', // 这里设置 label 的字号，可根据需要调整
  };

  return {
    id,
    source,
    target,
    label,
    type: 'smoothstep',
    ...defaultEdgeOptions,
    defaultStroke: stroke ?? '#80a8c9',
    ...labelStyle, // 将 labelStyle 添加到返回的边配置中
  };
}

export function initialEdges() {
  return [
    createEdge({ id: 'e1-2', source: '1', target: '2', label: 'a = 0, a = 1, b = n' }),
    createEdge({ id: 'e2-3', source: '2', target: '3', label: 'a = 0, b = n' }),
    createEdge({ id: 'e4-3', source: '4', target: '3', label: 'a = b = 1' }),
    createEdge({ id: 'e4-5', source: '4', target: '5', label: 'n = n1, a = n2, b = n3' }),
    createEdge({
      id: 'e1-6',
      source: '1',
      target: '6',
      label: 'n → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e8-7', source: '8', target: '7', label: 'A(c) = -log(1-c)' }),
    createEdge({ id: 'e8-9', source: '8', target: '9', label: 'A(c) = e^c,μ = c' }),
    createEdge({ id: 'e8-16', source: '8', target: '16', label: 'A(c) = (1-c)^(-x),c = 1-p' }),
    createEdge({
      id: 'e9-12',
      source: '9',
      target: '12',
      label: 'μ~gamma',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e13-9',
      source: '13',
      target: '9',
      label: 'μ = np,n→∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e13-4',
      source: '13',
      target: '4',
      label: 'p~beta',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e5-13',
      source: '5',
      target: '13',
      label: 'p = n1/n3,n3 → ∞,n1 → ∞,n2 = n',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e10-13',
      source: '10',
      target: '13',
      label: 'p = n1/n3,n = n2,n3 → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e13-14', source: '13', target: '14', label: 'n = 1', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e14-13', source: '14', target: '13', label: 'ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({
      id: 'e16-11',
      source: '16',
      target: '11',
      label: 'p~beta',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e12-16', source: '12', target: '16', label: 'α = (1-p)/p,β = n' }),
    createEdge({
      id: 'e16-9',
      source: '16',
      target: '9',
      label: 'n → ∞,μ = n/p',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e9-17',
      source: '9',
      target: '17',
      label: 'σ² = μ，μ → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e13-17',
      source: '13',
      target: '17',
      label: 'μ = np，σ² = np(1-p),n → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e18-13', source: '18', target: '13', label: 'β = 0' }),
    createEdge({ id: 'e15-16', source: '15', target: '16', label: 'ΣXi(iid)', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e16-15', source: '16', target: '15', label: 'n = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({
      id: 'e16-17',
      source: '16',
      target: '17',
      label: 'μ = n(1-p),n → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e17-19',
      source: '17',
      target: '19',
      label: 'α ~ inverted gamma',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e20-15', source: '20', target: '15', label: 'β = 1' }),
    createEdge({ id: 'e21-17', source: '21', target: '17', label: 'μ+σX or (X-μ)/σ', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e17-21', source: '17', target: '21', label: 'μ = 0,δ = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e22-17', source: '22', target: '17', label: 'log X,e^X', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),

    createEdge({ id: 'e17-25', source: '17', target: '25', label: 'ΣXi²/σ²' }),
    createEdge({
      id: 'e33-17',
      source: '33',
      target: '17',
      label: 'β = γ → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e32-17',
      source: '32',
      target: '17',
      label: 'μ = αβ,σ² = α²β,β → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e17-36', source: '17', target: '36', label: 'Σ[(Xi - μ)/σ]²' }),
    createEdge({
      id: 'e23-33',
      source: '23',
      target: '33',
      label: 'δ → 0',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e27-22',
      source: '27',
      target: '22',
      label: 'β → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e27-32', source: '27', target: '32', label: 'γ = 1' }),
    createEdge({ id: 'e32-26', source: '32', target: '26', label: 'log X' }),
    createEdge({ id: 'e32-31', source: '32', target: '31', label: '1/X' }),
    createEdge({ id: 'e32-33', source: '32', target: '33', label: 'X1/(X1+X2)' }),
    createEdge({ id: 'e21-30', source: '21', target: '30', label: '|X|' }),
    createEdge({ id: 'e21-36', source: '21', target: '36', label: 'ΣXi²' }),
    createEdge({
      id: 'e29-21',
      source: '29',
      target: '21',
      label: 'β → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({
      id: 'e40-21',
      source: '40',
      target: '21',
      label: 'n → ∞',
      options: {
        animated: true, // 单独为这条边启用动画
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e21-39', source: '21', target: '39', label: 'X1/X2' }),
    createEdge({ id: 'e34-24', source: '34', target: '24', label: 'zero truncate' }),
    createEdge({ id: 'e25-36', source: '25', target: '36', label: 'δ = 0' }),
    createEdge({ id: 'e39-28', source: '39', target: '28', label: 'log|X|/π' }),
    createEdge({ id: 'e29-35', source: '29', target: '35', label: 'μ = 1' }),
    createEdge({ id: 'e29-36', source: '29', target: '36', label: 'λ(X-μ)²/(μ²X)' }),
    createEdge({ id: 'e36-30', source: '36', target: '30', label: '√X' }),
    createEdge({ id: 'e32-36', source: '32', target: '36', label: 'α = 2, n = 2β or 2X/α, n = 2β' }),
    createEdge({ id: 'e32-37', source: '32', target: '37', label: 'α = 1, X1/X2' }),
    createEdge({ id: 'e32-42', source: '32', target: '42', label: 'β = n' }),
    createEdge({ id: 'e33-37', source: '33', target: '37', label: 'X/(1-X)' }),
    createEdge({ id: 'e33-38', source: '33', target: '38', label: 'β = γ = 1/2' }),
    createEdge({ id: 'e33-54', source: '33', target: '54', label: 'β = γ = 1', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e54-33', source: '54', target: '33', label: 'X(r),β = r,γ = n-r+1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e34-39', source: '34', target: '39', label: 'α = 1,a = 0', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e39-34', source: '39', target: '34', label: 'a+αX', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e29-35', source: '29', target: '35', label: 'μ = 1' }),
    createEdge({ id: 'e36-42', source: '36', target: '42', label: 'n even,α = 2', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e42-36', source: '42', target: '36', label: '2X/α', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e45-36', source: '45', target: '36', label: 'n1X,n2 → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e36-45', source: '36', target: '45', label: '(X1/n1)/(X2/n2)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e36-46', source: '36', target: '46', label: 'n = 2,α = 2', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e46-36', source: '46', target: '36', label: 'α/2 ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e40-39', source: '40', target: '39', label: 'n = 1' }),
    createEdge({ id: 'e44-40', source: '44', target: '40', label: 'δ = 0' }),
    createEdge({ id: 'e40-45', source: '40', target: '45', label: 'X²' }),
    createEdge({ id: 'e41-42', source: '41', target: '42', label: 'vector α = α' }),
    createEdge({ id: 'e46-41', source: '46', target: '41', label: 'ΣXi' }),
    createEdge({ id: 'e42-46', source: '42', target: '46', label: 'n = 1', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e46-42', source: '46', target: '42', label: 'ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e43-48', source: '43', target: '48', label: 'γ = 0' }),
    createEdge({ id: 'e50-44', source: '50', target: '44', label: 'γ = 0' }),
    createEdge({ id: 'e46-45', source: '46', target: '45', label: 'α = 1,X1/X2' }),
    createEdge({
      id: 'e56-45',
      source: '56',
      target: '45',
      label: 'δ → 0',
      options: {
        animated: true, // 单独为这条边启用动画,虚线单箭头
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e46-51', source: '46', target: '51', label: 'Mixture', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e51-46', source: '51', target: '46', label: 'vector α = α', style: { strokeWidth: 5, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({
      id: 'e57-46',
      source: '57',
      target: '46',
      label: 'δ = κ → 0,α = 1/γ',
      options: {
        animated: true, // 单独为这条边启用动画,虚线单箭头
        style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
      },
    }),
    createEdge({ id: 'e61-46', source: '61', target: '46', label: 'X²', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e65-46', source: '65', target: '46', label: 'β = 1', options: {
      animated: false, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e46-65', source: '46', target: '65', label: 'X^(1/β)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e62-46', source: '62', target: '46', label: 'log(X/λ)' }),
    createEdge({ id: 'e47-46', source: '47', target: '46', label: 'β = 1' }),
    createEdge({ id: 'e65-46', source: '65', target: '46', label: 'log[1+(X/(1-X))^(1/κ)]/λ', options: {
      animated: true, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e46-65', source: '46', target: '65', label: '-αlogX', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e54-47', source: '54', target: '47', label: 'n(1-X(n)),n → ∞' }),
    createEdge({ id: 'e54-49', source: '54', target: '49', label: '{log[1-(log(1-X))]/λ}^(1/κ)' }),
    createEdge({ id: 'e54-48', source: '54', target: '48', label: '{log[1-(logX)(logκ)]/δ}/logκ' }),
    createEdge({ id: 'e52-46', source: '52', target: '46', label: 'κ → 0,α = 1', options: {
      animated: true, // 单独为这条边启用动画,虚线单箭头
      style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
    } }),
    createEdge({ id: 'e58-46', source: '58', target: '46', label: '|X|,α1 = α2', options: {
      animated: true, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e46-58', source: '46', target: '58', label: 'X1-X2', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e53-58', source: '53', target: '58', label: 'α1 = α2,a = 0,b = α/2,c = 2', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e54-59', source: '54', target: '59', label: 'X(1/β)', options: {
      animated: true, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e59-54', source: '59', target: '54', label: 'β = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e54-69', source: '54', target: '69', label: 'a+(b-a)X', options: {
      animated: true, // 单独为这条边启用动画
      style: { strokeWidth: 2, stroke: '#80a8c9' },
      type: 'default',
      markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e69-54', source: '69', target: '54', label: 'a = 0,b = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: MarkerType.ArrowClosed }),
    createEdge({ id: 'e54-62', source: '54', target: '62', label: 'λX(-1/κ)' }),
    createEdge({ id: 'e54-66', source: '54', target: '66', label: '1/λ·(1-X/X)^(1/κ)' }),
    createEdge({ id: 'e54-67', source: '54', target: '67', label: '⌊10^(X)⌋' }),
    createEdge({ id: 'e54-63', source: '54', target: '63', label: 'X1-X2' }),
    createEdge({ id: 'e55-59', source: '55', target: '59', label: 'γ = 1' }),
    createEdge({ id: 'e60-56', source: '60', target: '56', label: 'γ → 0', options: {
      animated: true, // 单独为这条边启用动画,虚线单箭头
      style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
    } }),
    createEdge({ id: 'e57-61', source: '57', target: '61', label: 'δ = 2/α，γ = 0' }),
    createEdge({ id: 'e64-59', source: '64', target: '59', label: 'α = 1' }),
    createEdge({ id: 'e65-61', source: '64', target: '59', label: 'β = 2' }),
    createEdge({ id: 'e73-62', source: '73', target: '62', label: 'X+δ,γ = 0' }),
    createEdge({ id: 'e75-63', source: '75', target: '63', label: 'a = -1,b = 1,m = 0' }),
    createEdge({ id: 'e65-70', source: '65', target: '70', label: 'logX' }),
    createEdge({ id: 'e66-71', source: '66', target: '71', label: 'κ = 1', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e68-69', source: '68', target: '69', label: 'n = 1' }),
    createEdge({ id: 'e68-75', source: '68', target: '75', label: 'n = 2' }),
    createEdge({ id: 'e69-76', source: '69', target: '76', label: 'n = 1,a = 1/2,b = 1', options: {
      animated: false, // 近似：橘色
      style: { strokeWidth: 3, stroke: '#ff9200' },
      type: 'default',
      labelStyle: { transform: 'translate(-15px, -45px)' },
    } }),
    createEdge({ id: 'e72-69', source: '72', target: '69', label: 'κ → 0', options: {
      animated: true, // 单独为这条边启用动画,虚线单箭头
      style: { strokeWidth: 3, stroke: '#80a8c9' }, // 覆盖默认颜色
    } }),
    createEdge({ id: 'e66-74', source: '66', target: '74', label: 'logX' }),

  ]
}
