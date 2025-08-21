export const nodes = [{
  id: '04',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '数字特征',
  },
  class: 'nodrag',
}, {
  id: '0401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '期望',
  },
  class: 'nodrag',
}, {
  id: '040101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '离散型随机变量的期望',
  },
  class: 'nodrag',
}, {
  id: '04010101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\mathbb{E}(X) = \\sum_{k = 1}^{+\\infty}x_k\\cdot p_k',
  },
  class: 'nodrag',
}, {
  id: '040102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '连续型随机变量的期望',
  },
  class: 'nodrag',
}, {
  id: '04010201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\mathbb{E}(X) = \\int_{-\\infty}^{+\\infty}xf(x)dx',
  },
  class: 'nodrag',
}, {
  id: '040103',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '函数的期望',
  },
  class: 'nodrag',
}, {
  id: '04010301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\mathbb E[g(x)] = \n\\begin{cases}\n\n\\sum_{k = 1}^{+\\infty}g(x_k)\\cdot p_k &, \\text{if }X \\text{ is discrete};\\\\\\\\\n\\int_{-\\infty}^{+\\infty}g(x)\\cdot f(x)dx &, \\text{if }X \\text{ is continuous.}\n\n\\end{cases}',
  },
  class: 'nodrag',
}, {
  id: '040104',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '期望的运算性质',
  },
  class: 'nodrag',
}, {
  id: '04010401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\begin{cases}\n\n\\mathbb E(c) = c \\\\\\\\\n\\mathbb E(cX) = c\\mathbb E(X)\\\\\\\\\n\\mathbb E(X+Y) = \\mathbb E(X) + \\mathbb E(Y)\\\\\\\\\n\\mathbb E(XY) = \\mathbb E(X)\\mathbb E(Y), \\text {if } X \\text { and } Y\\text{ are independent.}\n\n\\end {cases}',
  },
  class: 'nodrag',
}, {
  id: '0402',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '方差',
  },
  class: 'nodrag',
}, {
  id: '040201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '方差的定义',
  },
  class: 'nodrag',
}, {
  id: '04020101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\text{Var}(X) = \\mathbb{E} [X - \\mathbb E(X)]^2 = \\mathbb E(X^2) - \\mathbb E^2(X)',
  },
  class: 'nodrag',
}, {
  id: '040202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '方差的运算性质',
  },
  class: 'nodrag',
}, {
  id: '04020201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\begin{cases}\n\n\\text{Var}(c) = 0 \\\\\\\\\n\\text{Var}(cX) = c^2\\text{Var}(X)\\\\\\\\\n\\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y),\\;\\text {if } X \\text { and } Y\\text{ are independent.}\\\\\\\\\n\\text{Var}(X) = 0\\iff \\mathrm P(X = \\mathbb E(X)) = 1\n\n\\end {cases}',
  },
  class: 'nodrag',
}, {
  id: '0403',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '协方差',
  },
  class: 'nodrag',
}, {
  id: '040301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '协方差的定义',
  },
  class: 'nodrag',
}, {
  id: '04030101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\text {Cov}(X,\\ Y) = \\mathbb E\\{[X-\\mathbb E(X)]\\cdot[Y - \\mathbb E(Y)]   \\}=\\mathbb E(XY) - \\mathbb E(X) \\mathbb E(Y)',
  },
  class: 'nodrag',
}, {
  id: '040302',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '协方差的运算性质',
  },
  class: 'nodrag',
}, {
  id: '04030201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\begin{cases}\n\n\\text{Cov}(X,c) = 0\\\\\\\\\n\\text{Cov}(X,X) = \\text{Var}(X)\\\\\\\\\n\\text{Cov}(X,Y) = \\text{Cov}(Y,X) \\\\\\\\\n\\text{Cov}(aX,bY) = ab\\cdot \\text {Cov}(X,Y) \\\\\\\\\n\\text{Cov}(X_1 + X_2, Y) = \\text{Cov}(X_1, Y) + \\text{Cov}(X_2, Y)\\\\\\\\\n\\text{Var}(X + Y) =  \\text{Var}(X) + \\text{Var}(Y) + 2 \\text{Cov}(X,Y)\\\\\n\n\\end {cases}',
  },
  class: 'nodrag',
}, {
  id: '0404',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '相关系数',
  },
  class: 'nodrag',
}, {
  id: '040401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '相关系数的定义',
  },
  class: 'nodrag',
}, {
  id: '04040101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\rho_{XY} = \\frac{\\mathrm{Cov}(X,Y)}{\\sqrt{\\mathrm{Var}(X)\\cdot\\mathrm{Var}(Y)}}',
  },
  class: 'nodrag',
}, {
  id: '04040102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '相关系数越接近正负1，线性相关性越强，相关系数等于0，不线性相关',
  },
  class: 'nodrag',
}, {
  id: '040402',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '相关系数与独立的关系',
  },
  class: 'nodrag',
}, {
  id: '04040201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\rho = 0 \\Leftrightarrow X,\\ Y\\ 不线性相关\\Leftrightarrow E(XY)=E(x)E(Y) \\Leftrightarrow D(X+Y)=D(X)D(Y)',
  },
  class: 'nodrag',
}, {
  id: '04040202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 1. 对一般的随机变量X,\\;Y,\\rho_{XY} = 0 \\nRightarrow  X,\\ Y\\ 相互独立; X,\\ Y\\ 相互独立 \\Rightarrow  \\rho_{XY} = 0\\\\\n2. 若(X,\\ Y)\\sim N(\\mu_1,\\ \\sigma_1^2;\\ \\mu_2,\\ \\sigma_2^2; \\rho) \\rho = 0 \\Leftrightarrow  X,\\ Y\\ 相互独立',
  },
  class: 'nodrag',
}, {
  id: '0405',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '矩与协方差矩阵',
  },
  class: 'nodrag',
}, {
  id: '040501',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '均值向量',
  },
  class: 'nodrag',
}, {
  id: '04050101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 设 \\mathbf{X} = (X_1, X_2, \\ldots, X_n)^T\n \n \n \n  是一个 n-维随机向量，其中每个 X_i\n （i = 1, 2, \\ldots, n）都是一个随机变量。如果每个随机变量的期望值存在，则均值向量 \\mathbf{E}[\\mathbf{X}] 定义为：\n\n\\mathbf{E}[\\mathbf{X}] = \n\\begin{pmatrix}\n\\mathbb{E}[X_1] \\\\\n\\mathbb{E}[X_2] \\\\\n\\vdots \\\\\n\\mathbb{E}[X_n]\n\\end{pmatrix}',
  },
  class: 'nodrag',
}, {
  id: '040502',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '协方差矩阵',
  },
  class: 'nodrag',
}, {
  id: '04050201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\mathbf{Cov}(\\mathbf{X},\\mathbf{X}) = \\mathbf{E}\\left[(\\mathbf{X} - \\mathbf{E}[\\mathbf{X}])(\\mathbf{X} - \\mathbf{E}[\\mathbf{X}])^T\\right] =\\begin{pmatrix}\n\\text{Cov}(X_1, X_1) & \\text{Cov}(X_1, X_2) & \\cdots & \\text{Cov}(X_1, X_n) \\\\\n\\text{Cov}(X_2, X_1) & \\text{Cov}(X_2, X_2) & \\cdots & \\text{Cov}(X_2, X_n) \\\\\n\\vdots & \\vdots & \\ddots & \\vdots \\\\\n\\text{Cov}(X_n, X_1) & \\text{Cov}(X_n, X_2) & \\cdots & \\text{Cov}(X_n, X_n)\n\\end{pmatrix}\n\n 其中，协方差的计算方式为：\n\n\\text{Cov}(X_i, X_j) = \\mathbb{E}[(X_i - \\mathbb{E}[X_i])(X_j - \\mathbb{E}[X_j])]',
  },
  class: 'nodrag',
}, {
  id: '04050202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 对称性: 协方差矩阵是对称的，即 \\text{Cov}(X_i, X_j) = \\text{Cov}(X_j, X_i)\n ',
  },
  class: 'nodrag',
}, {
  id: '04050203',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 非负定性: 协方差矩阵是非负定的，即对于任意非零向量 \\mathbf{a} \\in \\mathbb{R}^n\n ，有 \\mathbf{a}^T \\mathbf{Cov}(\\mathbf{X}) \\mathbf{a} \\geq 0',
  },
  class: 'nodrag',
}, {
  id: '04050204',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 线性变换: 如果对随机向量进行线性变换，如 \\mathbf{Y} = \\mathbf A\\mathbf{X} + \\mathbf{b} (其中 \\mathbf A 是矩阵，\\mathbf{b} 是常量向量)，则协方差矩阵的变换为：\n   \\mathbf{Cov}(\\mathbf{Y}) = \\mathbf A \\mathbf{Cov}(\\mathbf{X}) \\mathbf A^T\n  ',
  },
  class: 'nodrag',
}, {
  id: '0406',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '特征函数',
  },
  class: 'nodrag',
}, {
  id: '040601',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '一维随机变量的特征函数',
  },
  class: 'nodrag',
}, {
  id: '04060101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\phi_X(t) = \\mathbb{E}[e^{itX}]',
  },
  class: 'nodrag',
}, {
  id: '04060102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 存在性: 对于所有随机变量 X，特征函数 \\phi_X(t)\n  总是存在，即 \\mathbb{E}[e^{itX}]\n  是定义良好的。',
  },
  class: 'nodrag',
}, {
  id: '04060103',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '唯一性: 不同的概率分布对应不同的特征函数，因此每个随机变量的特征函数是唯一的。',
  },
  class: 'nodrag',
}, {
  id: '04060104',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 值域: 特征函数的值为复数，且 |\\phi_X(t)| \\leq \\phi_X(0) =1\n',
  },
  class: 'nodrag',
}, {
  id: '04060105',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '   \\phi_X(-t) = \\overline{\\phi_X(t)}\n ',
  },
  class: 'nodrag',
}, {
  id: '04060106',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 连续性: 特征函数 \\phi_X(t)\n  是连续函数',
  },
  class: 'nodrag',
}, {
  id: '04060107',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 若X的n阶矩存在，则 \\phi_X^{k}(0) = i^k \\mathbb{E}[X^k]，（k\\leq n）',
  },
  class: 'nodrag',
}, {
  id: '04060108',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 加法性: 如果 X 和 Y是独立随机变量，则它们和的特征函数为： \\phi_{X+Y}(t) = \\phi_X(t) \\cdot \\phi_Y(t)\n ',
  },
  class: 'nodrag',
}, {
  id: '04060109',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 平移性: 如果随机变量 X经过平移，即 Y = X + c（其中 c 是常数），则其特征函数为：\n  \\phi_Y(t) = e^{itc} \\phi_X(t)\n',
  },
  class: 'nodrag',
}, {
  id: '04060110',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 缩放性: 如果随机变量 X被缩放，即 Y = aX（其中 a是常数），则其特征函数为： \\phi_Y(t) = \\phi_X(at)\n  ',
  },
  class: 'nodrag',
}, {
  id: '040602',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '多维随机变量的特征函数',
  },
  class: 'nodrag',
}, {
  id: '0407',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: 'n维正态分布',
  },
  class: 'nodrag',
}, {
  id: '040701',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '定义',
  },
  class: 'nodrag',
}, {
  id: '04070101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{n/2} |\\boldsymbol{\\Sigma}|^{1/2}} \\exp\\left(-\\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu})^\\top \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})\\right)\\\\\n \n  其中：\n\\boldsymbol{\\mu}是 n 维均值向量。\\boldsymbol{\\Sigma}是 n 维协方差矩阵，必须是正定的。',
  },
  class: 'nodrag',
}, {
  id: '040702',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '性质',
  },
  class: 'nodrag',
}, {
  id: '04070201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: 'n 维正态分布的任意子集的边缘分布仍然是正态分布。',
  },
  class: 'nodrag',
}, {
  id: '04070202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 如果 \\mathbf{X} 是一个 n 维正态分布向量，且我们知道它的某些分量，那么给定其他分量后的条件分布仍然是正态分布。',
  },
  class: 'nodrag',
}, {
  id: '04070203',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 独立性:\n\n如果 n 维正态分布的协方差矩阵 \\boldsymbol{\\Sigma} 是对角矩阵，则分量之间是独立的。即对n维正态随机变量而言，独立等价于不相关。',
  },
  class: 'nodrag',
}, {
  id: '04070204',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 线性组合:\n如果 \\mathbf{a} 是一个常数向量，则 \\mathbf{a}^\\top \\mathbf{X}\n  仍然服从正态分布，\n\\mathbb{E}[\\mathbf{a}^\\top \\mathbf{X}] = \\mathbf{a}^\\top \\boldsymbol{\\mu}, \\quad \\text{Var}(\\mathbf{a}^\\top \\mathbf{X}) = \\mathbf{a}^\\top \\boldsymbol{\\Sigma} \\mathbf{a}',
  },
  class: 'nodrag',
}, {
  id: '04070205',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' 旋转不变性:\nn 维正态分布在进行线性变换时仍然保持正态分布的形式。即 \\mathbf{Y} = \\mathbf A \\mathbf{X} + \\mathbf{b}（其中 \\mathbf A 是矩阵，\\mathbf{b} 是常数向量），则 \\mathbf{Y} 仍然服从正态分布。其中   \\mathbb{E}[\\mathbf{Y}] = \\mathbf A \\boldsymbol{\\mu}+\\mathbf{b}，\n   \\text{Cov}(\\mathbf{Y}，\\mathbf{Y}) = \\text{Cov}(\\mathbf A \\mathbf{X}，\\mathbf A \\mathbf{X}) =\\mathbf A \\boldsymbol{\\Sigma} \\mathbf A^\\top\n',
  },
  class: 'nodrag',
}]

export const edges = [{
  id: 'e04~0401',
  source: '04',
  target: '0401',
  type: 'step',
}, {
  id: 'e0401~040101',
  source: '0401',
  target: '040101',
  type: 'step',
}, {
  id: 'e040101~04010101',
  source: '040101',
  target: '04010101',
  type: 'step',
}, {
  id: 'e0401~040102',
  source: '0401',
  target: '040102',
  type: 'step',
}, {
  id: 'e040102~04010201',
  source: '040102',
  target: '04010201',
  type: 'step',
}, {
  id: 'e0401~040103',
  source: '0401',
  target: '040103',
  type: 'step',
}, {
  id: 'e040103~04010301',
  source: '040103',
  target: '04010301',
  type: 'step',
}, {
  id: 'e0401~040104',
  source: '0401',
  target: '040104',
  type: 'step',
}, {
  id: 'e040104~04010401',
  source: '040104',
  target: '04010401',
  type: 'step',
}, {
  id: 'e04~0402',
  source: '04',
  target: '0402',
  type: 'step',
}, {
  id: 'e0402~040201',
  source: '0402',
  target: '040201',
  type: 'step',
}, {
  id: 'e040201~04020101',
  source: '040201',
  target: '04020101',
  type: 'step',
}, {
  id: 'e0402~040202',
  source: '0402',
  target: '040202',
  type: 'step',
}, {
  id: 'e040202~04020201',
  source: '040202',
  target: '04020201',
  type: 'step',
}, {
  id: 'e04~0403',
  source: '04',
  target: '0403',
  type: 'step',
}, {
  id: 'e0403~040301',
  source: '0403',
  target: '040301',
  type: 'step',
}, {
  id: 'e040301~04030101',
  source: '040301',
  target: '04030101',
  type: 'step',
}, {
  id: 'e0403~040302',
  source: '0403',
  target: '040302',
  type: 'step',
}, {
  id: 'e040302~04030201',
  source: '040302',
  target: '04030201',
  type: 'step',
}, {
  id: 'e04~0404',
  source: '04',
  target: '0404',
  type: 'step',
}, {
  id: 'e0404~040401',
  source: '0404',
  target: '040401',
  type: 'step',
}, {
  id: 'e040401~04040101',
  source: '040401',
  target: '04040101',
  type: 'step',
}, {
  id: 'e040401~04040102',
  source: '040401',
  target: '04040102',
  type: 'step',
}, {
  id: 'e0404~040402',
  source: '0404',
  target: '040402',
  type: 'step',
}, {
  id: 'e040402~04040201',
  source: '040402',
  target: '04040201',
  type: 'step',
}, {
  id: 'e040402~04040202',
  source: '040402',
  target: '04040202',
  type: 'step',
}, {
  id: 'e04~0405',
  source: '04',
  target: '0405',
  type: 'step',
}, {
  id: 'e0405~040501',
  source: '0405',
  target: '040501',
  type: 'step',
}, {
  id: 'e040501~04050101',
  source: '040501',
  target: '04050101',
  type: 'step',
}, {
  id: 'e0405~040502',
  source: '0405',
  target: '040502',
  type: 'step',
}, {
  id: 'e040502~04050201',
  source: '040502',
  target: '04050201',
  type: 'step',
}, {
  id: 'e040502~04050202',
  source: '040502',
  target: '04050202',
  type: 'step',
}, {
  id: 'e040502~04050203',
  source: '040502',
  target: '04050203',
  type: 'step',
}, {
  id: 'e040502~04050204',
  source: '040502',
  target: '04050204',
  type: 'step',
}, {
  id: 'e04~0406',
  source: '04',
  target: '0406',
  type: 'step',
}, {
  id: 'e0406~040601',
  source: '0406',
  target: '040601',
  type: 'step',
}, {
  id: 'e040601~04060101',
  source: '040601',
  target: '04060101',
  type: 'step',
}, {
  id: 'e040601~04060102',
  source: '040601',
  target: '04060102',
  type: 'step',
}, {
  id: 'e040601~04060103',
  source: '040601',
  target: '04060103',
  type: 'step',
}, {
  id: 'e040601~04060104',
  source: '040601',
  target: '04060104',
  type: 'step',
}, {
  id: 'e040601~04060105',
  source: '040601',
  target: '04060105',
  type: 'step',
}, {
  id: 'e040601~04060106',
  source: '040601',
  target: '04060106',
  type: 'step',
}, {
  id: 'e040601~04060107',
  source: '040601',
  target: '04060107',
  type: 'step',
}, {
  id: 'e040601~04060108',
  source: '040601',
  target: '04060108',
  type: 'step',
}, {
  id: 'e040601~04060109',
  source: '040601',
  target: '04060109',
  type: 'step',
}, {
  id: 'e040601~04060110',
  source: '040601',
  target: '04060110',
  type: 'step',
}, {
  id: 'e0406~040602',
  source: '0406',
  target: '040602',
  type: 'step',
}, {
  id: 'e04~0407',
  source: '04',
  target: '0407',
  type: 'step',
}, {
  id: 'e0407~040701',
  source: '0407',
  target: '040701',
  type: 'step',
}, {
  id: 'e040701~04070101',
  source: '040701',
  target: '04070101',
  type: 'step',
}, {
  id: 'e0407~040702',
  source: '0407',
  target: '040702',
  type: 'step',
}, {
  id: 'e040702~04070201',
  source: '040702',
  target: '04070201',
  type: 'step',
}, {
  id: 'e040702~04070202',
  source: '040702',
  target: '04070202',
  type: 'step',
}, {
  id: 'e040702~04070203',
  source: '040702',
  target: '04070203',
  type: 'step',
}, {
  id: 'e040702~04070204',
  source: '040702',
  target: '04070204',
  type: 'step',
}, {
  id: 'e040702~04070205',
  source: '040702',
  target: '04070205',
  type: 'step',
}]
