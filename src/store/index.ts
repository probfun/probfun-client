import type { Chat } from '@/api/ai/aiType';
import type { NodeOptions } from '@/api/distribution/distributionType';
import type { Experiment } from '@/api/experiment/experimentType';
import type { User } from '@/api/user/userType';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null);
  const visitorId = ref<string | null>(null);
  const favoriteExperiments = ref<Experiment[]>([]);
  function isFavorite(expId: string): boolean {
    return favoriteExperiments.value.some(exp => exp.expId === expId);
  }
  return {
    user,
    favoriteExperiments,
    isFavorite,
    visitorId,
  }
}, {
  persist: true,
});

export const useAiStore = defineStore('aiStore', () => {
  const currentChat = ref<Chat | null>(null);
  const chatList = ref<Chat[]>([]);
  return {
    currentChat,
    chatList,
  }
}, {
  persist: true,
});

export const useConfigStore = defineStore('configStore', () => {
  const darkMode = ref<boolean>(false);
  const targetNodeId = ref<string | null>(null);
  const isMoving = ref(false);
  return {
    darkMode,
    targetNodeId,
    isMoving,
  }
}, {
  persist: true,
});

export const useDistributionStore = defineStore('distributionStore', () => {
  const nodeData = ref<NodeOptions[]>([
    {
      label: 'Zipf(α,n)',
      position: { x: 0, y: 0 },
      chineseTranslation: 'Zipf 分布 (α, n)',
      pdf: '$$P(X = k) = \\frac{1 / k^{\\alpha}}{\\sum_{m=1}^{n} 1 / m^{\\alpha}}$$',
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
      expId: 'poisson-distribution',
      description: '**应用案例**: 网络流量中的数据包到达率\n\n- **背景**: 在网络工程中，数据包的到达通常被建模为泊松过程。\n- **研究目的**: 分析特定时间段内到达的数据包数量，以优化网络资源配置。\n- **方法**: 收集网络流量数据，计算在单位时间内到达的数据包数量，并使用泊松分布进行拟合，评估网络的负载和延迟。',
    },
    {
      label: 'Hypergeometric\n(n1,n2,n3)',
      position: { x: 1300, y: 120 },
      chineseTranslation: '超几何分布\n(n1, n2, n3)',
      pdf: '$$P(X = k) = \\frac{\\binom{n1}{k} \\binom{n2}{n3 - k}}{\\binom{n1 + n2}{n3}}$$',
      description: '**应用案例**: 电子产品抽样检验\n\n- **背景**: 在生产过程中，质检人员常常需要从批量产品中抽样检验，以评估整体质量。超几何分布适用于这种不放回抽样的情况。\n- **研究目的**: 评估在抽样中检出不合格品的概率，以优化质检流程。\n- **方法**: 设定批次中合格与不合格产品的数量，进行不放回抽样，从中计算不合格品被检出的概率。',
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
      expId: 'binomial-distribution',
      description: '**应用案例**: 电子产品的质量控制\n\n- **背景**: 在生产过程中，电子产品的缺陷率可以用二项分布来建模。\n- **研究目的**: 分析在生产批次中合格产品的比例，以确保产品质量。\n- **方法**: 对每批产品进行抽样检测，记录合格与不合格的产品数量。使用二项分布模型来估计不合格产品的概率，并进行统计检验，以确定生产过程是否符合质量标准。',
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
      expId: 'geometric-distribution',
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
      expId: 'normal-distribution',
      description: '**应用案例**: 信号处理中的噪声建模\n\n- **背景**: 在无线通信和信号处理领域，信号在传输过程中往往会受到噪声的影响。许多类型的噪声（如高斯白噪声）可以用正态分布来建模。\n- **研究目的**: 分析信号在不同噪声条件下的传输质量。\n- **方法**: 通过实验收集不同信噪比（SNR）条件下的信号数据，利用正态分布模型对噪声进行分析，评估通信系统的性能。',
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
      expId: 'normal-distribution',
    },
    {
      label: 'Log normal(α，β)\nP',
      position: { x: 1100, y: 400 },
      chineseTranslation: '对数正态分布(α，β)\nP',
      pdf: '$$f(x) = \\frac{1}{x \\beta \\sqrt{2\\pi}} e^{-\\frac{(\\ln x - \\alpha)^2}{2 \\beta^2}}, \\quad x > 0$$',
      description: '**应用案例**: 无线通信中的阴影衰落建模\n\n- **背景**: 在无线通信中，阴影衰落（shadow fading）通常由建筑物、树木等障碍物引起，导致信号强度变化。这种变化常呈现出对数正态的特征。\n- **研究目的**: 模拟阴影衰落现象，以优化无线通信系统的设计和性能评估。\n- **特点**:\n - **对数正态分布**: 信号强度在对数尺度（通常以dB表示）上服从正态分布。\n - **均值和标准差**: 通过测量实际环境中的信号强度，估计分布的均值和标准差，以进行准确建模。\n - **影响因素**: 阴影衰落受到环境、用户速度、频率、天线高度等因素的影响。\n- **方法**: 测量信号强度，分析其对数分布特征，估计分布参数，利用对数正态分布模型对阴影衰落进行描述。',
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
      pdf: '$$f(x) = \\frac{1}{2} e^{-(x + \\delta)/2} \\left( \\frac{x}{\\delta} \\right)^{(n/4 - 1/2)} I_{n/2 - 1}(\\sqrt{\\delta x})$$',
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
      description: '**应用案例**: 数据传输延迟建模\n\n- **背景**: 在网络通信中，数据包传输的延迟可能受到多种因素的影响，常常呈现出复杂的分布特征。\n- **研究目的**: 对数据传输延迟进行建模，以优化网络性能和资源分配。\n- **方法**: 收集不同条件下的传输延迟数据，使用伽马分布进行拟合，对比不同网络条件下的延迟分布，评估网络质量。',
    },
    {
      label: 'Beta(β,γ)',
      position: { x: 1150, y: 800 },
      chineseTranslation: '贝塔分布(β, γ)',
      pdf: '$$f(x) = \\frac{\\Gamma(\\beta + \\gamma)}{\\Gamma(\\beta) \\Gamma(\\gamma)} x^{\\beta - 1} (1 - x)^{\\gamma - 1}, \\quad 0 < x < 1$$',
      description: '**应用案例**: 概率预测与决策支持\n\n- **背景**: Beta分布常用于建模概率和比例，适合在[0, 1]区间内的随机变量建模。\n- **研究目的**: 在项目管理和决策支持系统中，评估某一事件成功的概率。\n- **方法**: 收集历史数据（如项目成功与失败的次数），利用Beta分布进行参数估计，计算成功概率的后验分布。',
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
      description: '**应用案例**: 小样本统计分析\n\n- **背景**: 在电子信息领域的实验研究中，常常面临样本量较小的情况，这时使用t分布可以得到更准确的假设检验结果。\n- **研究目的**: 对实验结果进行显著性检验，判断新算法与传统算法的性能差异。\n- **方法**: 收集不同算法在相同数据集上的实验结果，使用t检验分析两组样本均值是否存在显著差异。',
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
      expId: 'exponential-distribution',
      description: '**应用案例**: 通信故障的寿命分析\n\n- **背景**: 在电子设备和网络组件中，故障发生时间常常服从指数分布。\n- **研究目的**: 评估设备的平均故障时间，以提前进行维护和更换。\n- **方法**: 收集设备故障时间数据，利用指数分布模型计算设备的可靠性和故障率。',
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
      expId: 'uniform-distribution',
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
      description: '**应用案例**: 设备可靠性与寿命预测\n\n- **背景**: 在电子设备的研发与生产中，设备的故障模式和寿命常常表现出特定的分布特征，Weibull分布被广泛应用于可靠性工程。\n- **研究目的**: 通过分析设备的故障数据，预测其寿命并制定维护计划。\n- **方法**: 收集设备运行时间与故障数据，使用Weibull分布进行参数估计，分析其失效率和可靠性。',
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
      expId: 'uniform-distribution',
      description: '**应用案例**: 随机采样与仿真\n\n- **背景**: 在进行系统仿真或随机采样时，均匀分布常常用于生成随机数。\n- **研究目的**: 在仿真中随机生成事件发生的时间或位置，以评估系统性能。\n- **方法**: 利用均匀分布生成随机变量，例如在网络流量模拟中生成随机到达时间，评估系统在不同负载条件下的响应能力。',
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
    {
      label: 'von Mises(κ,μ)\nS',
      position: { x: -350, y: 100 },
      chineseTranslation: '冯·米塞斯分布(κ, μ)\nS',
      pdf: '$$f(x) = \\frac{1}{2\\pi I_0(\\kappa)} e^{\\kappa \\cos(x - \\mu)}$$',
    },
    {
      label: 'Generalized Pareto(δ,κ,γ)',
      position: { x: -350, y: 100 },
      chineseTranslation: '广义帕累托分布(δ, κ, γ)',
      pdf: '$$f(x) = \\frac{1}{\\gamma} \\left(1 + \\frac{x}{\\delta}\\right)^{-\\kappa - 1}, \\quad x \\ge -\\delta$$',
    },
    {
      label: 'Logistic(κ,γ)\nS,V',
      position: { x: -350, y: 100 },
      chineseTranslation: '逻辑斯蒂分布(κ, γ)\nS, V',
      pdf: '$$f(x) = \\frac{e^{-(x - \\mu)/\\gamma}}{\\gamma (1 + e^{-(x - \\mu)/\\gamma})^2}$$',
    },
    {
      label: 'Triangular(a,b,m)\nV',
      position: { x: -350, y: 100 },
      chineseTranslation: '三角分布(a, b, m)\nV',
      pdf: '$$f(x) = \\begin{cases} \\frac{2(x - a)}{(b - a)(m - a)}, & a \\le x < m \\\\ \\frac{2(b - x)}{(b - a)(b - m)}, & m \\le x < b \\\\ 0, & \\text{otherwise} \\end{cases}$$',
    },
    {
      label: 'Kolmogorov-Smirnov(n)\nV(1-4)',
      position: { x: -350, y: 100 },
      chineseTranslation: 'Kolmogorov-Smirnov(n)\nV(1-4)',
      pdf: null,
    },
  ]);
  const version = ref(4);
  return {
    nodeData,
    version,
  }
}, {
  persist: {
    key: 'distributionStore',
    storage: localStorage,
    beforeHydrate: () => {
      const stored = JSON.parse(localStorage.getItem('distributionStore') || '{}')
      if (stored.version !== 4) {
        localStorage.removeItem('distributionStore') // 版本不一致，移除旧数据
      }
    },
  },
});
