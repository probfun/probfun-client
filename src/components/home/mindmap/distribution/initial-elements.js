import { label } from '@unovis/ts/components/axis/style';
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
function createNode(data, position, type = 'default', className = 'light') {
  return {
    id: (nodeIdCounter++).toString(), // 自增 id
    data,
    position,
    style: defaultStyle,
    type,
    class: className,
  };
}
export const initialNodes = [
  createNode({ label: 'Zipf(α,n)' }, { x: 0, y: 0 }),
  createNode({ label: `Discrete uniform(a,b)\n R,V` }, { x: 300, y: 0 }),
  createNode({ label: 'Rectangular(n)\nV' }, { x: 600, y: 0 }),
  createNode({ label: 'Beta-binomial\n(a,b,n)' }, { x: 900, y: 0 },),
  createNode({ label: 'Negative hypergeometric\n(n1,n2,n3)' }, { x: 1250, y: 0 },),
  createNode({ label: 'Zeta(α)' }, { x: 0, y: 150 },),
  createNode({ label: 'Logarithm(c)' }, { x: 150, y: 200 },),
  createNode({ label: 'Power series(c,A(c))' }, { x: 300, y: 100 },),
  createNode({ label: 'Poisson(μ)\nC' }, { x: 450, y: 200 },),
  createNode({ label: 'Hypergeometric\n(n1,n2,n3)' }, { x: 1300, y: 120 },),
  createNode({ label: 'Beta-Pascal\n(n,a,b)' }, { x: 300, y: 300 },),
  createNode({ label: 'Gamma-Poisson(α,β)' }, { x: 300, y: 300 },),
  createNode({ label: 'Binomial(n,p)' }, { x: 800, y: 170 },),
  createNode({ label: 'Bernoulli(p)\nM,P,X' }, { x: 1100, y: 250 },),
  createNode({ label: 'Geometric(p)\nF,M,V' }, { x: -200, y: 450 },),
  createNode({ label: 'Pascal(n,p)\nCp' }, { x: 0, y: 300 },),
  createNode({ label: 'Normal(μ,σ²)\nL' }, { x: 300, y: 300 },),
  createNode({ label: 'Polya(n,p,β)' }, { x: 300, y: 300 },),
  createNode({ label: 'Gamma-normal(μ，α，β)' }, { x: 300, y: 300 },),
  createNode({ label: 'Discrete Weibull(p,β)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard normal' }, { x: 300, y: 300 },),
  createNode({ label: 'Log normal(α，β)\nP' }, { x: 300, y: 300 },),
  createNode({ label: 'Noncentral beta(β，γ，δ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Arctangent(λ,Φ)\nS,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Noncentral chi-square(n,δ)\nC' }, { x: 300, y: 300 },),
  createNode({ label: 'Log gamma(α,β)' }, { x: 300, y: 300 },),
  createNode({ label: 'Generalized gamma(α，β,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Hyperbolic-secant\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Inverse Gaussian(λ,μ)\nLμi/(μi²ai)' }, { x: 300, y: 300 },),
  createNode({ label: 'Chi(n)' }, { x: 300, y: 300 },),
  createNode({ label: 'Inverted gamma(α,β)' }, { x: 300, y: 300 },),
  createNode({ label: 'Gamma(α,β)\nCα,S' }, { x: 300, y: 300 },),
  createNode({ label: 'Beta(β,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Cauchy(a,α)\nC,I,S,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard Waid(λ)\nS' }, { x: 300, y: 300 },),
  createNode({ label: 'Chi-square(n)\nC' }, { x: 300, y: 300 },),
  createNode({ label: 'Inverted beta(β,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Arcsin\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard Cauchy\nI,S,V' }, { x: 300, y: 300 },),
  createNode({ label: 't(n)' }, { x: 300, y: 300 },),
  createNode({ label: 'Hypoexponential(vector α)\nC' }, { x: 300, y: 300 },),
  createNode({ label: 'Erlang(α,n)\nS' }, { x: 300, y: 300 },),
  createNode({ label: 'Makeham(δ,κ,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Noncentral t(n,δ)' }, { x: 300, y: 300 },),
  createNode({ label: 'F(n1,n2)' }, { x: 300, y: 300 },),
  createNode({ label: 'Exponential(α)\nF,M,S,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Logistic-exponential(α,β)\nS,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Compertz(δ,κ)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Exponential Power(λ,κ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Doubly noncentral t(n,δ,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Hyperexponential' }, { x: 300, y: 300 },),
  createNode({ label: 'Muth(κ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Error(a,b,c)\nS' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard uniform\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Minimax(β,γ)\nMβ,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Noncentral F(n1,n2,δ)' }, { x: 300, y: 300 },),
  createNode({ label: 'IDB(δ,κ,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Laplace(α1,α2)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard power(β)\nV,X' }, { x: 300, y: 300 },),
  createNode({ label: 'Doubly noncentral F(n1,n2,δ,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Rayleigh(α)\nM,S,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Pareto(λ,κ)\nM,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Standard trangular\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Power(α,β)\nS,V,Xα' }, { x: 300, y: 300 },),
  createNode({ label: 'Weibull(α,β)\nMβ，S,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Log logistc(λ,κ)\nI,S,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Benford\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'TSP(a,b,m,n)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Uniform(a,b)\nR,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Extreme value(α,β)\nV,Mβ' }, { x: 300, y: 300 },),
  createNode({ label: 'Lomax(λ,κ)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'von Mises(κ,μ)\nS' }, { x: 300, y: 300 },),
  createNode({ label: 'Generalized Pareto(δ,κ,γ)' }, { x: 300, y: 300 },),
  createNode({ label: 'Logistic(κ,γ)\nS,V' }, { x: 300, y: 300 },),
  createNode({ label: 'Triangular(a,b,m)\nV' }, { x: 300, y: 300 },),
  createNode({ label: 'Kolmogorov-Smirnov(n)\nV(1-4)' }, { x: 300, y: 300 },),
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
function createEdge({ id, source, target, label = '', type, options = {} }) {
  return {
    id,
    source,
    target,
    label,
    type:'smoothstep',
    ...defaultEdgeOptions, // 使用默认参数
    ...options,            // 自定义覆盖参数
  };
}



export const initialEdges = [
  createEdge({ id: 'e1-2', source: '1', target: '2', label: 'a = 0,a = 1,b = n' }),
  createEdge({ id: 'e2-3', source: '2', target: '3', label: 'a = 0,b = n' }),
  createEdge({ id: 'e4-3', source: '4', target: '3', label: 'a = b = 1' }),
  createEdge({ id: 'e4-5', source: '4', target: '5', label: 'n = n1,a = n2,b = n3' }),
  createEdge({
    id: 'e1-6', source: '1', target: '6', label: 'n → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({ id: 'e8-7', source: '8', target: '7', label: 'A(c) = -log(1-c)' }),
  createEdge({ id: 'e8-9', source: '8', target: '9', label: 'A(c) = e^c,μ = c' }),
  createEdge({ id: 'e8-16', source: '8', target: '16', label: 'A(c) = (1-c)^(-x),c = 1-p' }),
  createEdge({
    id: 'e9-12', source: '9', target: '12', label: 'μ~gamma', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e13-9', source: '13', target: '9', label: 'μ = np,n→∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e13-4', source: '13', target: '4', label: 'p~beta', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e5-13', source: '5', target: '13', label: 'p = n1/n3,n3 → ∞,n1 → ∞,n2 = n', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e10-13', source: '10', target: '13', label: 'p = n1/n3,n = n2,n3 → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({ id: 'e13-14', source: '13', target: '14', label: 'n = 1',options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },}
}),
  createEdge({ id: 'e14-13', source: '14', target: '13', label: 'ΣXi(iid)',
    style: { strokeWidth: 2, stroke: '#f78c6c' },
    markerEnd: { type: 'arrowclosed', color: '#f78c6c' },
    
  }),
  createEdge({
    id: 'e16-11', source: '16', target: '11', label: 'p~beta', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({ id: 'e12-16', source: '12', target: '16', label: 'α = (1-p)/p,β = n' }),
  createEdge({
    id: 'e16-9', source: '16', target: '9', label: 'n → ∞,μ = n/p', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e9-17', source: '9', target: '17', label: 'σ² = μ，μ → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e13-17', source: '13', target: '17', label: 'μ = np，σ² = np(1-p),n → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({ id: 'e18-13', source: '18', target: '13', label: 'β = 0' }),
  createEdge({ id: 'e15-16', source: '15', target: '16', label: 'ΣXi(iid)',options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },}
}),
  createEdge({ id: 'e16-15', source: '16', target: '15', label: 'n = 1',
    style: { strokeWidth: 2, stroke: '#f78c6c' },
    markerEnd: { type: 'arrowclosed', color: '#f78c6c' }, 
  }),
  createEdge({
    id: 'e16-17', source: '16', target: '17', label: 'μ = n(1-p),n → ∞', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({
    id: 'e17-19', source: '17', target: '19', label: 'α ~ inverted gamma', options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    }
  }),
  createEdge({ id: 'e20-15', source: '20', target: '15', label: 'β = 1' }),
  createEdge({ id: 'e17-21', source: '17', target: '21', label: 'μ = 0,δ = 1 or (X-μ)/σ' }),
  createEdge({ id: 'e21-17', source: '21', target: '17', label: 'μ+σX' }),
  createEdge({ id: 'e22-17', source: '22', target: '17', label: 'log X',options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },}
}),
  createEdge({ id: 'e17-22', source: '17', target: '22', label: 'e^X',
    style: { strokeWidth: 2, stroke: '#f78c6c' },
    markerEnd: { type: 'arrowclosed', color: '#f78c6c' }, 
  }),
  createEdge({ id: 'e17-25', source: '17', target: '25', label: 'ΣXi²/σ²' }),



]


