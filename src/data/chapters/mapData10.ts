export const nodes = [{
  id: '10',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '离散时间马尔科夫链',
  },
  class: 'nodrag',
}, {
  id: '1001',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '马氏链的概念',
  },
  class: 'nodrag',
}, {
  id: '100101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '已知当前所处状态，将来的发展与过去无关',
  },
  class: 'nodrag',
}, {
  id: '1002',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '转移概率',
  },
  class: 'nodrag',
}, {
  id: '100201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '：m时刻位于状态 i 的条件下，n 步后位于状态 j 的条件概率 p_{ij}(m,m+n)',
  },
  class: 'nodrag',
}, {
  id: '100202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '齐次马氏链的转移概率',
  },
  class: 'nodrag',
}, {
  id: '10020201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \\forall m,l,\\ \\ p_{ij}(m,m+n)=p_{ij}(l,l+n)  ',
  },
  class: 'nodrag',
}, {
  id: '10020202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '不做特殊说明，自此往后均为齐次马氏链',
  },
  class: 'nodrag',
}, {
  id: '100203',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '多步转移概率   p_{ij}(m,m+n)简记为p_{ij}^{(n)}',
  },
  class: 'nodrag',
}, {
  id: '10020301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '一步转移概率矩阵',
  },
  class: 'nodrag',
}, {
  id: '10020302',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: 'n步转移概率矩阵',
  },
  class: 'nodrag',
}, {
  id: '100204',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: 'C_K方程',
  },
  class: 'nodrag',
}, {
  id: '1003',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '马氏链的有限维分布',
  },
  class: 'nodrag',
}, {
  id: '100301',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '由初始分布和一步转移概率矩阵唯一决定',
  },
  class: 'nodrag',
}, {
  id: '100302',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '时刻n的分布 p(n)=p(0)P^n',
  },
  class: 'nodrag',
}, {
  id: '100303',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '有限维分布 P\\{X_{n_1}=x_1,X_{n_2}=x_2,\\cdots,X_{n_m}=x_m\\}=\\sum_{x_0\\in S}p_{x_0}(0)p_{x_0\\ x_1}^{(n_1)} p_{x_1\\ x_2}^{(n_2-n_1)}\\cdots p_{x_{m-1}\\ x_m}^{(n_{m}-n_{m-1})}',
  },
  class: 'nodrag',
}, {
  id: '1004',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '马氏链的状态分类',
  },
  class: 'nodrag',
}, {
  id: '100401',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '常返性',
  },
  class: 'nodrag',
}, {
  id: '10040101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '常返',
  },
  class: 'nodrag',
}, {
  id: '1004010101',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '正常返',
  },
  class: 'nodrag',
}, {
  id: '1004010102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '零常返',
  },
  class: 'nodrag',
}, {
  id: '10040102',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '非常返',
  },
  class: 'nodrag',
}, {
  id: '100402',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '周期性',
  },
  class: 'nodrag',
}, {
  id: '10040201',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '周期',
  },
  class: 'nodrag',
}, {
  id: '10040202',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '非周期',
  },
  class: 'nodrag',
}, {
  id: '1005',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '状态空间的分解',
  },
  class: 'nodrag',
}, {
  id: '1006',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: '平稳分布',
  },
  class: 'nodrag',
}, {
  id: '100601',
  type: 'latex',
  position: {
    y: 0,
    x: 0,
  },
  data: {
    formula: ' \n\\begin{cases}\n\\pi = \\pi P \\\\\n\\sum_i \\pi_i = 1\n\\end{cases}\n',
  },
  class: 'nodrag',
}];

export const edges = [{
  id: 'e10~1001',
  source: '10',
  target: '1001',
  type: 'step',
}, {
  id: 'e1001~100101',
  source: '1001',
  target: '100101',
  type: 'step',
}, {
  id: 'e10~1002',
  source: '10',
  target: '1002',
  type: 'step',
}, {
  id: 'e1002~100201',
  source: '1002',
  target: '100201',
  type: 'step',
}, {
  id: 'e1002~100202',
  source: '1002',
  target: '100202',
  type: 'step',
}, {
  id: 'e100202~10020201',
  source: '100202',
  target: '10020201',
  type: 'step',
}, {
  id: 'e100202~10020202',
  source: '100202',
  target: '10020202',
  type: 'step',
}, {
  id: 'e1002~100203',
  source: '1002',
  target: '100203',
  type: 'step',
}, {
  id: 'e100203~10020301',
  source: '100203',
  target: '10020301',
  type: 'step',
}, {
  id: 'e100203~10020302',
  source: '100203',
  target: '10020302',
  type: 'step',
}, {
  id: 'e1002~100204',
  source: '1002',
  target: '100204',
  type: 'step',
}, {
  id: 'e10~1003',
  source: '10',
  target: '1003',
  type: 'step',
}, {
  id: 'e1003~100301',
  source: '1003',
  target: '100301',
  type: 'step',
}, {
  id: 'e1003~100302',
  source: '1003',
  target: '100302',
  type: 'step',
}, {
  id: 'e1003~100303',
  source: '1003',
  target: '100303',
  type: 'step',
}, {
  id: 'e10~1004',
  source: '10',
  target: '1004',
  type: 'step',
}, {
  id: 'e1004~100401',
  source: '1004',
  target: '100401',
  type: 'step',
}, {
  id: 'e100401~10040101',
  source: '100401',
  target: '10040101',
  type: 'step',
}, {
  id: 'e10040101~1004010101',
  source: '10040101',
  target: '1004010101',
  type: 'step',
}, {
  id: 'e10040101~1004010102',
  source: '10040101',
  target: '1004010102',
  type: 'step',
}, {
  id: 'e100401~10040102',
  source: '100401',
  target: '10040102',
  type: 'step',
}, {
  id: 'e1004~100402',
  source: '1004',
  target: '100402',
  type: 'step',
}, {
  id: 'e100402~10040201',
  source: '100402',
  target: '10040201',
  type: 'step',
}, {
  id: 'e100402~10040202',
  source: '100402',
  target: '10040202',
  type: 'step',
}, {
  id: 'e10~1005',
  source: '10',
  target: '1005',
  type: 'step',
}, {
  id: 'e10~1006',
  source: '10',
  target: '1006',
  type: 'step',
}, {
  id: 'e1006~100601',
  source: '1006',
  target: '100601',
  type: 'step',
}];
