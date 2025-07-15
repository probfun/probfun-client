import { reactive, ref, toRef } from 'vue';

const fCustom = ref<((x: number) => number) | null>(null);

const args = reactive({
  uniform: {
    a: ref(0),
    b: ref(1),
  },
  normal: {
    mean: 0,
    std: 1,
  },
  exponential: {
    lambda: 1,
  },
  gamma: {
    k: 2,
    theta: 2,
  },
  beta: {
    alpha: 2,
    beta: 2,
  },
  cauchy: {
    x0: 0,
    gamma: 1,
  },
  pareto: {
    xm: 1,
    alpha: 3,
  },
  custom: {
  },
  ai: {
  },
});

// const uniform = computed(() => {
//   return (x: number): number => {
//     const a = args.uniform.a;
//     const b = args.uniform.b;
//     if (x < a || x > b)
//       return 0;
//     return 1 / (b - a);
//   };
// });

function uniform(x: number): number {
  const a = args.uniform.a;
  const b = args.uniform.b;
  if (x < a || x > b)
    return 0;
  return 1 / (b - a);
}

function normal(x: number): number {
  const mean = args.normal.mean;
  const stdDev = args.normal.std;
  return (1 / (Math.sqrt(2 * Math.PI) * stdDev)) * Math.exp(-0.5 * ((x - mean) / stdDev) ** 2);
}

function exponential(x: number): number {
  const lambda = args.exponential.lambda;
  if (x < 0)
    return 0;
  return lambda * Math.exp(-lambda * x);
}

function gammaFunction(n: number): number {
  if (n === 1)
    return 1;
  if (n === 0.5)
    return Math.sqrt(Math.PI);
  return (n - 1) * gammaFunction(n - 1);
}

function gamma(x: number): number {
  const k = args.gamma.k;
  const theta = args.gamma.theta;
  if (x < 0)
    return 0;
  return (x ** (k - 1) * Math.exp(-x / theta)) / (theta ** k * gammaFunction(k));
}

function betaFunction(a: number, b: number): number {
  return (gammaFunction(a) * gammaFunction(b)) / gammaFunction(a + b);
}

function beta(x: number): number {
  const alpha = args.beta.alpha;
  const beta = args.beta.beta;
  if (x < 0 || x > 1)
    return 0;
  return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / betaFunction(alpha, beta);
}

function cauchy(x: number): number {
  const x0 = args.cauchy.x0;
  const gamma = args.cauchy.gamma;
  return (1 / (Math.PI * gamma)) * (gamma / ((x - x0) ** 2 + gamma ** 2));
}

function pareto(x: number): number {
  const xm = args.pareto.xm; // scale parameter
  const alpha = args.pareto.alpha; // shape parameter
  if (x < xm)
    return 0;
  return (alpha * xm ** alpha) / x ** (alpha + 1);
}

const functionList = reactive({
  uniform: {
    name: 'Uniform',
    f: uniform,
    chinese: '均匀分布',
    latex: 'f(x) = \\begin{cases} \\frac{1}{b-a}, & a \\leq x \\leq b \\\\ 0, & \\text{其他} \\end{cases}',
    left: toRef(args.uniform, 'a'),
    right: toRef(args.uniform, 'b'),
  },
  normal: {
    name: 'Normal',
    f: normal,
    chinese: '正态分布',
    latex: 'f(x) = \\frac{1}{\\sqrt{2\\pi}}*e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}',
    left: -5,
    right: 5,
  },
  exponential: {
    name: 'Exponential',
    f: exponential,
    chinese: '指数分布',
    latex: 'f(x) = \\lambda e^{-\\lambda x}',
    left: 0,
    right: 10,
  },
  gamma: {
    name: 'Gamma',
    f: gamma,
    chinese: '伽玛分布',
    latex: 'f(x) = \\frac{x^{k-1} e^{-\\frac{x}{\\theta}}}{\\theta^k \\Gamma(k)}',
    left: 0,
    right: 10,
  },
  beta: {
    name: 'Beta',
    f: beta,
    chinese: '贝塔分布',
    latex: 'f(x) = \\frac{x^{\\alpha-1} (1-x)^{\\beta-1}}{B(\\alpha, \\beta)}',
    left: 0,
    right: 1,
  },
  cauchy: {
    name: 'Cauchy',
    f: cauchy,
    chinese: '柯西分布',
    latex: 'f(x) = \\frac{1}{\\pi\\gamma} \\frac{\\gamma}{(x-x_0)^2 + \\gamma^2}',
    left: -10,
    right: 10,
  },
  pareto: {
    name: 'Pareto',
    f: pareto,
    chinese: '帕累托分布',
    latex: 'f(x) = \\frac{\\alpha x_m^\\alpha}{x^{\\alpha+1}}',
    left: 0,
    right: 10,
  },
  custom: {
    name: 'Custom',
    f: fCustom.value,
    chinese: '自定义...',
    latex: '',
    left: 0,
    right: 1,
  },
  ai: {
    name: 'AI',
    f: fCustom.value,
    chinese: 'AI 生成',
    latex: '',
    left: 0,
    right: 1,
  },
});

type FunctionLabel = keyof typeof functionList;

export {
  args,
  fCustom,
  type FunctionLabel,
  functionList,
};
