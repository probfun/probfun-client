import { ref } from 'vue';

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

interface NodeOptions {
  label: string
  position: { x: number, y: number }
  chineseTranslation: string
  pdf: string | null
  expId?: string
}

export function createDistributionNode({ label, position, chineseTranslation, pdf, expId }: NodeOptions) {
  return {
    id: (nodeIdCounter++).toString(), // 自增 id
    data: { label, chineseTranslation, pdf, expId },
    position,
    type: 'distribution',
  };
}

export const nodeData = ref<NodeOptions[]>([
  {
    label: 'Zipf(α,n)',
    position: { x: 0, y: 0 },
    chineseTranslation: 'Zipf 分布 (α, n)',
    pdf: '$$P(X = k) = \\frac{1 / k^{\\alpha}}{\\sum_{m=1}^{n} 1 / m^{\\alpha}}}$$',
  },
  {
    label: `Discrete uniform(a,b)\n R,V`,
    position: { x: 300, y: 0 },
    chineseTranslation: '离散均匀分布(a, b)\n R, V',
    pdf: '$$P(X = k) = \\frac{1}{b - a + 1}$$',
  },
  {
    label: 'Rectangular(n)\nV',
    position: { x: 600, y: 0 },
    chineseTranslation: '矩形分布(n)\nV',
    pdf: null,
  },
  {
    label: 'Beta-binomial\n(a,b,n)',
    position: { x: 900, y: 0 },
    chineseTranslation: '贝塔二项分布\n(a, b, n)',
    pdf: '$$P(X = k) = \\binom{n}{k} \\frac{B(k + a, n - k + b)}{B(a, b)}$$',
  },
  {
    label: 'Negative hypergeometric\n(n1,n2,n3)',
    position: { x: 1250, y: 0 },
    chineseTranslation: '负超几何分布\n(n1, n2, n3)',
    pdf: '$$P(X = k) = \\frac{\\binom{n1}{k} \\binom{n2}{n3 - k}}{\\binom{n1 + n2}{n3}}$$',
  },
  {
    label: 'Zeta(α)',
    position: { x: 0, y: 100 },
    chineseTranslation: '泽塔函数(α)',
    pdf: '$$P(X = k) = \\frac{1}{k^{\\alpha} \\zeta(\\alpha)}$$',
  },
  {
    label: 'Logarithm(c)',
    position: { x: 150, y: 200 },
    chineseTranslation: '对数(c)',
    pdf: null,
  },
  {
    label: 'Power series(c,A(c))',
    position: { x: 300, y: 100 },
    chineseTranslation: '幂级数(c, A(c))',
    pdf: null,
  },
  {
    label: 'Poisson(μ)\nC',
    position: { x: 450, y: 200 },
    chineseTranslation: '泊松分布(μ)\nC',
    pdf: '$$P(X = k) = \\frac{e^{-\\mu} \\mu^{k}}{k!}$$',
    expId: 'poissonDistribution',
  },
  {
    label: 'Hypergeometric\n(n1,n2,n3)',
    position: { x: 1300, y: 120 },
    chineseTranslation: '超几何分布\n(n1, n2, n3)',
    pdf: '$$P(X = k) = \\frac{\\binom{n1}{k} \\binom{n2}{n3 - k}}{\\binom{n1 + n2}{n3}}$$',
  },
  {
    label: 'Beta-Pascal\n(n,a,b)',
    position: { x: 250, y: 500 },
    chineseTranslation: '贝塔-帕斯卡尔分布\n(n, a, b)',
    pdf: null,
  },
  {
    label: 'Gamma-Poisson(α,β)',
    position: { x: 580, y: 300 },
    chineseTranslation: '伽马-泊松分布(α, β)',
    pdf: null,
  },
  {
    label: 'Binomial(n,p)',
    position: { x: 800, y: 170 },
    chineseTranslation: '二项分布(n, p)',
    pdf: '$$P(X = k) = \\binom{n}{k} p^{k} (1 - p)^{n - k}$$',
    expId: 'binomialDistribution',
  },
  {
    label: 'Bernoulli(p)\nM,P,X',
    position: { x: 1100, y: 250 },
    chineseTranslation: '伯努利分布(p)\nM, P, X',
    pdf: '$$P(X = k) = p^{k} (1 - p)^{1 - k}, \\quad k = 0, 1$$',
  },
  {
    label: 'Geometric(p)\nF,M,V',
    position: { x: -300, y: 550 },
    chineseTranslation: '几何分布(p)\nF, M, V',
    pdf: '$$P(X = k) = (1 - p)^{k - 1} p, \\quad k = 1, 2, 3, \\dots$$',
    expId: 'geometricDistribution',
  },
  {
    label: 'Pascal(n,p)\nCp',
    position: { x: 0, y: 400 },
    chineseTranslation: '帕斯卡尔分布(n, p)\nCp',
    pdf: '$$P(X = k) = \\binom{k - 1}{n - 1} p^{n} (1 - p)^{k - n}, \\quad k = n, n + 1, \\dots$$',
  },
  {
    label: 'Normal(μ,σ²)\nL',
    position: { x: 950, y: 600 },
    chineseTranslation: '正态分布(μ, σ²)\nL',
    pdf: '$$f(x) = \\frac{1}{\\sqrt{2\\pi \\sigma^2}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}$$',
    expId: 'normalDistribution',
  },
  {
    label: 'Polya(n,p,β)',
    position: { x: 600, y: 80 },
    chineseTranslation: '波利亚分布(n, p, β)',
    pdf: null,
  },
  {
    label: 'Gamma-normal(μ，α，β)',
    position: { x: 1100, y: 700 },
    chineseTranslation: '伽马正态分布(μ, α, β)',
    pdf: null,
  },
  {
    label: 'Discrete Weibull(p,β)\nV',
    position: { x: -400, y: 400 },
    chineseTranslation: '离散韦布尔分布(p, β)\nV',
    pdf: '$$P(X = k) = p (1 - e^{-k / \\beta})^{p - 1} e^{-k / \\beta}, \\quad k = 1, 2, \\dots$$',
  },
  {
    label: 'Standard normal',
    position: { x: 580, y: 450 },
    chineseTranslation: '标准正态分布',
    pdf: '$$f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}$$',
    expId: 'normalDistribution',
  },
  {
    label: 'Log normal(α，β)\nP',
    position: { x: 1100, y: 400 },
    chineseTranslation: '对数正态分布(α，β)\nP',
    pdf: '$$f(x) = \\frac{1}{x \\beta \\sqrt{2\\pi}} e^{-\\frac{(\\ln x - \\alpha)^2}{2 \\beta^2}}, \\quad x > 0$$',
  },
  {
    label: 'Noncentral beta(β，γ，δ)',
    position: { x: 1100, y: 500 },
    chineseTranslation: '非中心贝塔分布(β，γ，δ)',
    pdf: null,
  },
  {
    label: 'Arctangent(λ,Φ)\nS,V',
    position: { x: 150, y: 600 },
    chineseTranslation: '反正切(λ, Φ)\nS, V',
    pdf: '$$f(x) = \\frac{\\lambda}{\\pi} \\frac{1}{\\lambda^2 + (x - \\Phi)^2}$$',
  },
  {
    label: 'Noncentral chi-square(n,δ)\nC',
    position: { x: 950, y: 750 },
    chineseTranslation: '非中心卡方分布(n, δ)\nC',
    pdf: '$$f(x) = \\frac{1}{2} e^{-(x + \\delta)/2} \\left( \\frac{x}{\\delta} \\right)^{(n/4 - 1/2)} I_{n/2 - 1}(\\sqrt{\\delta x})}$$',
  },
  {
    label: 'Log gamma(α,β)',
    position: { x: 850, y: 800 },
    chineseTranslation: '对数伽马分布(α, β)',
    pdf: null,
  },
  {
    label: 'Generalized gamma(α，β,γ)',
    position: { x: 800, y: 250 },
    chineseTranslation: '广义伽马分布(α，β, γ)',
    pdf: '$$f(x) = \\frac{\\beta}{\\Gamma(\\alpha / \\gamma)} x^{\\alpha - 1} e^{-(x / \\gamma)^\\beta}, \\quad x > 0$$',
  },
  {
    label: 'Hyperbolic-secant\nV',
    position: { x: 0, y: 800 },
    chineseTranslation: '双曲割线分布\nV',
    pdf: '$$f(x) = \\frac{1}{2} \\text{sech}\\left(\\frac{\\pi x}{2}\\right)$$',
  },
  {
    label: 'Inverse Gaussian(λ,μ)\nLμi/(μi²ai)',
    position: { x: 500, y: 350 },
    chineseTranslation: '反高斯分布(λ, μ)\nLμi/(μi²ai)',
    pdf: '$$f(x) = \\left( \\frac{\\lambda}{2\\pi x^3} \\right)^{1/2} e^{-\\frac{\\lambda (x - \\mu)^2}{2 \\mu^2 x}}$$',
  },
  {
    label: 'Chi(n)',
    position: { x: 650, y: 800 },
    chineseTranslation: '卡方分布(n)',
    pdf: '$$f(x) = \\frac{1}{2^{n/2} \\Gamma(n/2)} x^{n/2 - 1} e^{-x / 2}, \\quad x > 0$$',
  },
  {
    label: 'Inverted gamma(α,β)',
    position: { x: 950, y: 1100 },
    chineseTranslation: '反伽马分布(α, β)',
    pdf: '$$f(x) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{-\\alpha - 1} e^{-\\beta / x}, \\quad x > 0$$',
  },
  {
    label: 'Gamma(α,β)\nCα,S',
    position: { x: 950, y: 950 },
    chineseTranslation: '伽马分布(α, β)\nCα, S',
    pdf: '$$f(x) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha - 1} e^{-\\beta x}, \\quad x > 0$$',
  },
  {
    label: 'Beta(β,γ)',
    position: { x: 1150, y: 800 },
    chineseTranslation: '贝塔分布(β, γ)',
    pdf: '$$f(x) = \\frac{\\Gamma(\\beta + \\gamma)}{\\Gamma(\\beta) \\Gamma(\\gamma)} x^{\\beta - 1} (1 - x)^{\\gamma - 1}, \\quad 0 < x < 1$$',
  },
  {
    label: 'Cauchy(a,α)\nC,I,S,V',
    position: { x: -100, y: 500 },
    chineseTranslation: '柯西分布(a, α)\nC, I, S, V',
    pdf: '$$f(x) = \\frac{1}{\\pi \\alpha \\left[ 1 + \\left( \\frac{x - a}{\\alpha} \\right)^2 \\right]}$$',
  },
  {
    label: 'Standard Waid(λ)\nS',
    position: { x: 500, y: 600 },
    chineseTranslation: '标准Waid分布(λ)\nS',
    pdf: null, // Assuming it's a typo for Weibull
  },
  {
    label: 'Chi-square(n)\nC',
    position: { x: 450, y: 900 },
    chineseTranslation: '卡方分布(n)\nC',
    pdf: '$$f(x) = \\frac{1}{2^{n/2} \\Gamma(n/2)} x^{n/2 - 1} e^{-x / 2}, \\quad x > 0$$',
  },
  {
    label: 'Inverted beta(β,γ)',
    position: { x: 1150, y: 1100 },
    chineseTranslation: '反贝塔分布(β, γ)',
    pdf: null,
  },
  {
    label: 'Arcsin\nV',
    position: { x: 1250, y: 900 },
    chineseTranslation: '反正弦分布\nV',
    pdf: null,
  },
  {
    label: 'Standard Cauchy\nI,S,V',
    position: { x: -300, y: 700 },
    chineseTranslation: '标准柯西分布\nI, S, V',
    pdf: '$$f(x) = \\frac{1}{\\pi (1 + x^2)}$$',
  },
  {
    label: 't(n)',
    position: { x: -450, y: 620 },
    chineseTranslation: 't 分布(n)',
    pdf: '$$f(x) = \\frac{\\Gamma\\left(\\frac{n + 1}{2}\\right)}{\\sqrt{n \\pi} \\, \\Gamma\\left(\\frac{n}{2}\\right)} \\left(1 + \\frac{x^2}{n} \\right)^{-(n + 1)/2}$$',
  },
  {
    label: 'Hypoexponential(vector α)\nC',
    position: { x: 550, y: 1000 },
    chineseTranslation: '超指数分布(向量 α)\nC',
    pdf: null,
  },
  {
    label: 'Erlang(α,n)\nS',
    position: { x: 300, y: 500 },
    chineseTranslation: '厄朗分布(α, n)\nS',
    pdf: '$$f(x) = \\frac{\\beta^{k} x^{k-1} e^{-\\beta x}}{(k-1)!}, \\quad k = n, \\beta = \\alpha$$',
  },
  {
    label: 'Makeham(δ,κ,γ)',
    position: { x: -350, y: 100 },
    chineseTranslation: 'Makeham 分布(δ, κ, γ)',
    pdf: null,
  },
  {
    label: 'Noncentral t(n,δ)',
    position: { x: -350, y: 100 },
    chineseTranslation: '非中心 t 分布(n, δ)',
    pdf: null,
  },
  {
    label: 'F(n1,n2)',
    position: { x: -350, y: 100 },
    chineseTranslation: 'F 分布(n1, n2)',
    pdf: '$$f(x) = \\frac{\\sqrt{\\frac{(n1 x)^{n1} n2^{n2}}{(n1 x + n2)^{n1 + n2}}}}{x B(n1/2, n2/2)}$$',
  },
  {
    label: 'Exponential(α)\nF,M,S,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '指数分布(α)\nF, M, S, V',
    pdf: '$$f(x) = \\alpha e^{-\\alpha x}, \\quad x \\ge 0$$',
    expId: 'exponentialDistribution',
  },
  {
    label: 'Logistic-exponential(α,β)\nS,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '逻辑-指数分布(α, β)\nS, V',
    pdf: null,
  },
  {
    label: 'Compertz(δ,κ)\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: 'Compertz分布(δ, κ)\nV',
    pdf: null,
  },
  {
    label: 'Exponential Power(λ,κ)',
    position: { x: -350, y: 100 },
    chineseTranslation: '指数幂分布(λ, κ)',
    pdf: null,
  },
  {
    label: 'Doubly noncentral t(n,δ,γ)',
    position: { x: -350, y: 100 },
    chineseTranslation: '双重非中心 t 分布(n, δ, γ)',
    pdf: null,
  },
  {
    label: 'Hyperexponential',
    position: { x: -350, y: 100 },
    chineseTranslation: '超指数分布',
    pdf: null,
  },
  {
    label: 'Muth(κ)',
    position: { x: -350, y: 100 },
    chineseTranslation: 'Muth 分布(κ)',
    pdf: null,
  },
  {
    label: 'Error(a,b,c)\nS',
    position: { x: -350, y: 100 },
    chineseTranslation: '误差分布(a, b, c)\nS',
    pdf: null,
  },
  {
    label: 'Standard uniform\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: '标准均匀分布\nV',
    pdf: '$$f(x) = \\begin{cases} 1 & \\text{if } 0 \\le x \\le 1, \\\\ 0 & \\text{otherwise.} \\end{cases}$$',
    expId: 'uniformDistribution',
  },
  {
    label: 'Minimax(β,γ)\nMβ,V',
    position: { x: -350, y: 100 },
    chineseTranslation: 'Minimax 分布(β, γ)\nMβ, V',
    pdf: null,
  },
  {
    label: 'Noncentral F(n1,n2,δ)',
    position: { x: -350, y: 100 },
    chineseTranslation: '非中心 F 分布(n1, n2, δ)',
    pdf: null,
  },
  {
    label: 'IDB(δ,κ,γ)',
    position: { x: -350, y: 100 },
    chineseTranslation: 'IDB 分布(δ, κ, γ)',
    pdf: null,
  },
  {
    label: 'Laplace(α1,α2)\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: '拉普拉斯分布(α1, α2)\nV',
    pdf: '$$f(x) = \\frac{1}{2\\alpha_2} e^{-\\frac{|x - \\alpha_1|}{\\alpha_2}}$$',
  },
  {
    label: 'Standard power(β)\nV,X',
    position: { x: -350, y: 100 },
    chineseTranslation: '标准幂分布(β)\nV, X',
    pdf: null,
  },
  {
    label: 'Doubly noncentral F(n1,n2,δ,γ)',
    position: { x: -350, y: 100 },
    chineseTranslation: '双重非中心 F 分布(n1, n2, δ, γ)',
    pdf: null,
  },
  {
    label: 'Rayleigh(α)\nM,S,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '瑞利分布(α)\nM, S, V',
    pdf: '$$f(x) = \\frac{x}{\\alpha^2} e^{-x^2 / (2 \\alpha^2)}, \\quad x \\ge 0$$',
  },
  {
    label: 'Pareto(λ,κ)\nM,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '帕累托分布(λ, κ)\nM, V',
    pdf: '$$f(x) = \\frac{\\lambda \\kappa^{\\lambda}}{x^{\\lambda + 1}}, \\quad x \\ge \\kappa$$',
  },
  {
    label: 'Standard trangular\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: '标准三角分布\nV',
    pdf: '$$f(x) = \\begin{cases} 2x & 0 \\le x < 1, \\\\ 2(2 - x) & 1 \\le x \\le 2, \\\\ 0 & \\text{otherwise.} \\end{cases}$$',
  },
  {
    label: 'Power(α,β)\nS,V,Xα',
    position: { x: -350, y: 100 },
    chineseTranslation: '幂分布(α, β)\nS, V, Xα',
    pdf: '$$f(x) = \\frac{\\alpha \\beta^\\alpha}{x^{\\alpha + 1}} e^{-\\beta / x}, \\quad x > 0$$',
  },
  {
    label: 'Weibull(α,β)\nMβ，S,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '韦布尔分布(α, β)\nMβ, S, V',
    pdf: '$$f(x) = \\alpha \\beta x^{\\alpha - 1} e^{-(x / \\beta)^\\alpha}, \\quad x \\ge 0$$',
  },
  {
    label: 'Log logistc(λ,κ)\nI,S,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '对数逻辑分布(λ, κ)\nI, S, V',
    pdf: null,
  },
  {
    label: 'Benford\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: '本福特定律\nV',
    pdf: null,
  },
  {
    label: 'TSP(a,b,m,n)\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: 'TSP(a, b, m, n)\nV',
    pdf: null,
  },
  {
    label: 'Uniform(a,b)\nR,V',
    position: { x: -350, y: 100 },
    chineseTranslation: '均匀分布(a, b)\nR, V',
    pdf: '$$f(x) = \\frac{1}{b - a}, \\quad a \\le x \\le b$$',
    expId: 'uniformDistribution',
  },
  {
    label: 'Extreme value(α,β)\nV,Mβ',
    position: { x: -350, y: 100 },
    chineseTranslation: '极值分布(α, β)\nV, Mβ',
    pdf: '$$f(x) = \\beta e^{-\\beta (x - \\alpha)} e^{-e^{-\\beta (x - \\alpha)}}$$',
  },
  {
    label: 'Lomax(λ,κ)\nV',
    position: { x: -350, y: 100 },
    chineseTranslation: 'Lomax 分布(λ, κ)\nV',
    pdf: '$$f(x) = \\frac{\\lambda}{\\kappa} \\left(1 + \\frac{x}{\\kappa}\\right)^{-(\\lambda + 1)}, \\quad x \\ge 0$$',
  },
]);

export const initialNodes = nodeData.value.map((data) => {
  return createDistributionNode(data);
});

const defaultEdgeOptions = {
  markerEnd: {
    type: 'arrowclosed',
    color: '#000',
  },
  animated: false,
  style: { strokeWidth: 2, stroke: '#80a8c9' },
};

interface EdgeOptions {
  id: string
  source: string
  target: string
  label?: string
  options?: any
  style?: any
  markerEnd?: any
}

function createEdge({ id, source, target, label = '', options = {} }: EdgeOptions) {
  const { style = {} } = options;
  const { stroke } = style;
  return {
    id,
    source,
    target,
    label,
    type: 'smoothstep',
    ...defaultEdgeOptions,
    ...options,
    defaultStroke: stroke ?? '#80a8c9',
  };
}

export const initialEdges = [
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e13-9',
    source: '13',
    target: '9',
    label: 'μ = np,n→∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e13-4',
    source: '13',
    target: '4',
    label: 'p~beta',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e5-13',
    source: '5',
    target: '13',
    label: 'p = n1/n3,n3 → ∞,n1 → ∞,n2 = n',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e10-13',
    source: '10',
    target: '13',
    label: 'p = n1/n3,n = n2,n3 → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({ id: 'e13-14', source: '13', target: '14', label: 'n = 1', options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e14-13', source: '14', target: '13', label: 'ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({
    id: 'e16-11',
    source: '16',
    target: '11',
    label: 'p~beta',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e9-17',
    source: '9',
    target: '17',
    label: 'σ² = μ，μ → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e13-17',
    source: '13',
    target: '17',
    label: 'μ = np，σ² = np(1-p),n → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
  createEdge({ id: 'e16-15', source: '16', target: '15', label: 'n = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({
    id: 'e16-17',
    source: '16',
    target: '17',
    label: 'μ = n(1-p),n → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e17-19',
    source: '17',
    target: '19',
    label: 'α ~ inverted gamma',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({ id: 'e20-15', source: '20', target: '15', label: 'β = 1' }),
  createEdge({ id: 'e21-17', source: '21', target: '17', label: 'μ+σX or (X-μ)/σ', options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 3, stroke: '#ff9200' },
    type: 'default',
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e17-21', source: '17', target: '21', label: 'μ = 0,δ = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e32-17',
    source: '32',
    target: '17',
    label: 'μ = αβ,σ² = α²β,β → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e27-22',
    source: '27',
    target: '22',
    label: 'β → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({
    id: 'e40-21',
    source: '40',
    target: '21',
    label: 'n → ∞',
    options: {
      animated: true, // 单独为这条边启用动画
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
  createEdge({ id: 'e54-33', source: '54', target: '33', label: 'X(r),β = r,γ = n-r+1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e34-39', source: '34', target: '39', label: 'α = 1,a = 0', options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e39-34', source: '39', target: '34', label: 'a+αX', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e29-35', source: '29', target: '35', label: 'μ = 1' }),
  createEdge({ id: 'e36-42', source: '36', target: '42', label: 'n even,α = 2', options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 3, stroke: '#ff9200' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e42-36', source: '42', target: '36', label: '2X/α', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e45-36', source: '45', target: '36', label: 'n1X,n2 → ∞', options: {
    animated: true, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e36-45', source: '36', target: '45', label: '(X1/n1)/(X2/n2)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e36-46', source: '36', target: '46', label: 'n = 2,α = 2', options: {
    animated: false, // 近似：橘色
    style: { strokeWidth: 3, stroke: '#ff9200' },
    type: 'default',
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e46-36', source: '46', target: '36', label: 'α/2 ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
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
  createEdge({ id: 'e46-42', source: '46', target: '42', label: 'ΣXi(iid)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
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
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
    },
  }),
  createEdge({ id: 'e46-51', source: '46', target: '51', label: 'Mixture', options: {
    animated: false, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e51-46', source: '51', target: '46', label: 'vector α = α', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({
    id: 'e57-46',
    source: '57',
    target: '46',
    label: 'δ = κ → 0,α = 1/γ',
    options: {
      animated: true, // 单独为这条边启用动画,虚线单箭头
      style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
  createEdge({ id: 'e46-65', source: '46', target: '65', label: 'X^(1/β)', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e62-46', source: '62', target: '46', label: 'log(X/λ)' }),
  createEdge({ id: 'e47-46', source: '47', target: '46', label: 'β = 1' }),
  createEdge({ id: 'e65-46', source: '65', target: '46', label: 'log[1+(X/(1-X))^(1/κ)]/λ', options: {
    animated: true, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e46-65', source: '46', target: '65', label: '-αlogX', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e54-47', source: '54', target: '47', label: 'n(1-X(n)),n → ∞' }),
  createEdge({ id: 'e54-49', source: '54', target: '49', label: '{log[1-(log(1-X))]/λ}^(1/κ)' }),
  createEdge({ id: 'e54-48', source: '54', target: '48', label: '{log[1-(logX)(logκ)]/δ}/logκ' }),
  createEdge({ id: 'e52-46', source: '52', target: '46', label: 'κ → 0,α = 1', options: {
    animated: true, // 单独为这条边启用动画,虚线单箭头
    style: { stroke: '#80a8c9' }, // 覆盖默认颜色
  } }),
  createEdge({ id: 'e58-46', source: '58', target: '46', label: '|X|,α1 = α2', options: {
    animated: true, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e46-58', source: '46', target: '58', label: 'X1-X2', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
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
  createEdge({ id: 'e59-54', source: '59', target: '54', label: 'β = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e54-69', source: '54', target: '69', label: 'a+(b-a)X', options: {
    animated: true, // 单独为这条边启用动画
    style: { strokeWidth: 2, stroke: '#80a8c9' },
    type: 'default',
    markerEnd: { type: 'arrowclosed', color: '#80a8c9' },
    labelStyle: { transform: 'translate(-15px, -45px)' },
  } }),
  createEdge({ id: 'e69-54', source: '69', target: '54', label: 'a = 0,b = 1', style: { strokeWidth: 2, stroke: '#f78c6c' }, markerEnd: { type: 'arrowclosed', color: '#f78c6c' } }),
  createEdge({ id: 'e54-62', source: '54', target: '62', label: 'λX(-1/κ)' }),
  createEdge({ id: 'e54-66', source: '54', target: '66', label: '1/λ·(1-X/X)^(1/κ)' }),
  createEdge({ id: 'e54-67', source: '54', target: '67', label: '⌊10^(X)⌋' }),
  createEdge({ id: 'e54-63', source: '54', target: '63', label: 'X1-X2' }),
  createEdge({ id: 'e55-59', source: '55', target: '59', label: 'γ = 1' }),
  createEdge({ id: 'e60-56', source: '60', target: '56', label: 'γ → 0', options: {
    animated: true, // 单独为这条边启用动画,虚线单箭头
    style: { stroke: '#80a8c9' }, // 覆盖默认颜色
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
    style: { stroke: '#80a8c9' }, // 覆盖默认颜色
  } }),
  createEdge({ id: 'e66-74', source: '66', target: '74', label: 'logX' }),

]
