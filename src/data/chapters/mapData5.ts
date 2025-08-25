export const nodes = [{
  id: '05',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '极限定理',
  },
  class: 'nodrag',
}, {
  id: '0501',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '随机变量序列收敛',
  },
  class: 'nodrag',
}, {
  id: '050101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '依概率收敛',
  },
  class: 'nodrag',
}, {
  id: '05010101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '定义',
  },
  class: 'nodrag',
}, {
  id: '0501010101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 设 ( Y ) 及 ( Y_1, Y_2, \\dots, Y_n, \\dots ) 均是定义在 ( \\Omega ) 上的随机变量。若对任意 ( \\varepsilon > 0 )，有\n\\lim_{n \\to \\infty} \\text P\\{|Y_n - Y| \\geq \\varepsilon\\} = 0 \\quad \\text{或} \\quad \\lim_{n \\to \\infty} \\text P\\{|Y_n - Y| < \\varepsilon\\} = 1,\n则称随机变量序列 ( \\{Y_n\\} ) 依概率收敛到 ( Y )，记作 ( Y_n \\xrightarrow{\\text P} Y )。\n',
  },
  class: 'nodrag',
}, {
  id: '05010102',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '性质',
  },
  class: 'nodrag',
}, {
  id: '0501010201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 依概率收敛的序列有如下性质:\n\n若 ( X_n \\xrightarrow{\\text P} a ), ( Y_n \\xrightarrow{\\text P} b ), 又 ( g(x, y) ) 在 ( (a, b) ) 上连续，则\ng(X_n, Y_n) \\xrightarrow{\\text P} g(a, b).',
  },
  class: 'nodrag',
}, {
  id: '050102',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '几乎处处收敛',
  },
  class: 'nodrag',
}, {
  id: '05010201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '定义',
  },
  class: 'nodrag',
}, {
  id: '0501020101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 若有\n\\text P\\left( \\lim_{n \\to \\infty} Y_n = Y \\right) = 1 \\quad \\text{或} \\quad \\text P\\left( \\lim_{n \\to \\infty} Y_n \\neq Y \\right) = 0,\n则称 {Y_n} 几乎处处或以概率 1 收敛到 Y，记作 Y_n \\xrightarrow{\\text{a.s.}} Y。',
  },
  class: 'nodrag',
}, {
  id: '05010202',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '意义',
  },
  class: 'nodrag',
}, {
  id: '0501020201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 几乎处处收敛的意义: 在 ( \\Omega ) 中除去一个概率为零的子集外，对其他每个样本点 ( \\omega \\in \\Omega )，都有\n\\lim_{n \\to \\infty} Y_n(\\omega) = Y(\\omega).',
  },
  class: 'nodrag',
}, {
  id: '0502',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '大数定律',
  },
  class: 'nodrag',
}, {
  id: '050201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '弱大数定律',
  },
  class: 'nodrag',
}, {
  id: '05020101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 设 {X_n} 为一随机变量序列，且 \\mathbb E(X_n) (n = 1, 2, \\cdots) 存在，记\n\nY_n = \\frac{1}{n} \\sum_{k=1}^{n} [X_k - \\mathbb E(X_k)] (n = 1, 2, \\cdots),\n\n若对于任意 \\varepsilon > 0，有\n\n\\lim_{n \\to \\infty} \\text{P}(|Y_n| \\geq \\varepsilon) = \\lim_{n \\to \\infty} \\text{P} \\left( \\left| \\frac{1}{n} \\sum_{k=1}^{n} [X_k - \\mathbb E(X_k)] \\right| \\geq \\varepsilon \\right) = 0,\n\n\n',
  },
  class: 'nodrag',
}, {
  id: '05020102',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 即 {Y_n} 依概率收敛到 0，则称 {X_n} 服从弱大数定律。弱大数定律又称大数定律。',
  },
  class: 'nodrag',
}, {
  id: '050202',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '强大数定律',
  },
  class: 'nodrag',
}, {
  id: '05020201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 设 {X_n} 为一随机变量序列，且 \\mathbb E(X_n) (n = 1, 2, \\cdots) 存在，记\n\nY_n = \\frac{1}{n} \\sum_{k=1}^{n} [X_k - \\mathbb E(X_k)] (n = 1, 2, \\cdots),\n\n若\n\n\\text{P}\\left( \\lim_{n \\to \\infty} Y_n = 0 \\right) = \\text{P}\\left( \\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} [X_k - \\mathbb E(X_k)] = 0 \\right) = 1,\n\n即 {Y_n} 几乎处处或以概率 1 收敛到 0，则称 {X_n} 服从强大数定律。',
  },
  class: 'nodrag',
}, {
  id: '050203',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '切比雪夫大数定律',
  },
  class: 'nodrag',
}, {
  id: '05020301',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 设 X_1, X_2, \\dots, X_n, \\dots 是相互独立的随机变量序列，且存在常数 C，使得 D(X_k) \\leq C (k = 1, 2, \\dots)，则 {X_n} 服从大数定律。',
  },
  class: 'nodrag',
}, {
  id: '050204',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '马尔可夫大数定律',
  },
  class: 'nodrag',
}, {
  id: '05020401',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 对于随机变量序列 X_1, X_2, \\dots, X_n, \\dots，若 D(X_k) (k = 1, 2, \\dots) 存在且满足\n\\ \\ \n\\lim _{n \\rightarrow \\infty} \\frac{1}{n^2}D(\\sum_{k=1}^n X_k) = 0 \n\\ \\ \n成立，则 {X_n} 服从大数定律。\n',
  },
  class: 'nodrag',
}, {
  id: '050205',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '辛钦大数定律',
  },
  class: 'nodrag',
}, {
  id: '05020501',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' 设随机变量 X_1, X_2, \\dots, X_n, \\dots 相互独立，服从同一分布，且具有数学期望 \\mathbb E(X_k) = \\mu (k = 1, 2, \\dots)，则 {X_n} 服从大数定律，即对于任意 \\varepsilon > 0，有\n\n\\lim_{n \\to \\infty} \\text{P} \\left( \\left| \\frac{1}{n} \\sum_{k=1}^{n} X_k - \\mu \\right| \\geq \\varepsilon \\right) = 0.\n',
  },
  class: 'nodrag',
}, {
  id: '0503',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: '中心极限定理',
  },
  class: 'nodrag',
}, {
  id: '050301',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' Levy-Lindeberg 中心极限定理',
  },
  class: 'nodrag',
}, {
  id: '05030101',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' \\begin{cases}\n\nX_1,X_2,\\ldots\\ \\text{独立同分布} \\\\\\\\\n\\mathbb E(X_i) = \\mu,\\;\\;\\; \\text{Var}(X_i) = \\sigma^2\\\\\n\\end{cases}\n\\Rightarrow \\sum_{i=1}^{n}X_i \\overset{\\text{approx.}}{\\sim} N(n\\mu,\\ n\\sigma^2)',
  },
  class: 'nodrag',
}, {
  id: '050302',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: 'De moivre-Laplace 中心极限定理',
  },
  class: 'nodrag',
}, {
  id: '05030201',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' Y_n \\sim B(n,\\ p)\n\\Rightarrow Y_n \\overset{\\text{approx.}}{\\sim} N(np,\\ np(1-p))',
  },
  class: 'nodrag',
}, {
  id: '050303',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: 'Liaponunov 中心极限定理',
  },
  class: 'nodrag',
}, {
  id: '05030301',
  type: 'latex',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    formula: ' \\begin{cases}\n\nX_1,X_2,\\ldots\\ \\text{相互独立} \\\\\\\\\n\\mathbb E(X_i) = \\mu_i,\\;\\;\\; \\text{Var}(X_i) = \\sigma_i^2\\\\\n\\end{cases}\n\\Rightarrow \\sum_{i=1}^{n}X_i \\overset{\\text{approx.}}{\\sim} N(\\sum_{i=1}^{n}\\mu_i,\\ \\sum_{i=1}^{n}\\sigma_i^2)',
  },
  class: 'nodrag',
}]

export const edges = [{
  id: 'e05~0501',
  source: '05',
  target: '0501',
  type: 'step',
}, {
  id: 'e0501~050101',
  source: '0501',
  target: '050101',
  type: 'step',
}, {
  id: 'e050101~05010101',
  source: '050101',
  target: '05010101',
  type: 'step',
}, {
  id: 'e05010101~0501010101',
  source: '05010101',
  target: '0501010101',
  type: 'step',
}, {
  id: 'e050101~05010102',
  source: '050101',
  target: '05010102',
  type: 'step',
}, {
  id: 'e05010102~0501010201',
  source: '05010102',
  target: '0501010201',
  type: 'step',
}, {
  id: 'e0501~050102',
  source: '0501',
  target: '050102',
  type: 'step',
}, {
  id: 'e050102~05010201',
  source: '050102',
  target: '05010201',
  type: 'step',
}, {
  id: 'e05010201~0501020101',
  source: '05010201',
  target: '0501020101',
  type: 'step',
}, {
  id: 'e050102~05010202',
  source: '050102',
  target: '05010202',
  type: 'step',
}, {
  id: 'e05010202~0501020201',
  source: '05010202',
  target: '0501020201',
  type: 'step',
}, {
  id: 'e05~0502',
  source: '05',
  target: '0502',
  type: 'step',
}, {
  id: 'e0502~050201',
  source: '0502',
  target: '050201',
  type: 'step',
}, {
  id: 'e050201~05020101',
  source: '050201',
  target: '05020101',
  type: 'step',
}, {
  id: 'e050201~05020102',
  source: '050201',
  target: '05020102',
  type: 'step',
}, {
  id: 'e0502~050202',
  source: '0502',
  target: '050202',
  type: 'step',
}, {
  id: 'e050202~05020201',
  source: '050202',
  target: '05020201',
  type: 'step',
}, {
  id: 'e0502~050203',
  source: '0502',
  target: '050203',
  type: 'step',
}, {
  id: 'e050203~05020301',
  source: '050203',
  target: '05020301',
  type: 'step',
}, {
  id: 'e0502~050204',
  source: '0502',
  target: '050204',
  type: 'step',
}, {
  id: 'e050204~05020401',
  source: '050204',
  target: '05020401',
  type: 'step',
}, {
  id: 'e0502~050205',
  source: '0502',
  target: '050205',
  type: 'step',
}, {
  id: 'e050205~05020501',
  source: '050205',
  target: '05020501',
  type: 'step',
}, {
  id: 'e05~0503',
  source: '05',
  target: '0503',
  type: 'step',
}, {
  id: 'e0503~050301',
  source: '0503',
  target: '050301',
  type: 'step',
}, {
  id: 'e050301~05030101',
  source: '050301',
  target: '05030101',
  type: 'step',
}, {
  id: 'e0503~050302',
  source: '0503',
  target: '050302',
  type: 'step',
}, {
  id: 'e050302~05030201',
  source: '050302',
  target: '05030201',
  type: 'step',
}, {
  id: 'e0503~050303',
  source: '0503',
  target: '050303',
  type: 'step',
}, {
  id: 'e050303~05030301',
  source: '050303',
  target: '05030301',
  type: 'step',
}]
