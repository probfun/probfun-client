<script setup lang="ts">
import type { Analysis } from '@/api/do-question/doQuestion.ts';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { analysisApi } from '@/api/do-question/doQuestion.ts';
import TestPanel from '@/components/analysis/TestPanel.vue';
import { useConfigStore } from '@/store';

const data = ref<Analysis>({
  objectiveAnalysis: {
    metrics: [
      {
        name: 'accuracy',
        value: 0.407,
        explanation: '整体正确率为 35/86≈0.407，处于中等偏下水平，说明当前解题正确率仍有较大提升空间。',
      },
      {
        name: 'mastery',
        value: 0.37,
        explanation: '从各章节正确率看，多数章节低于50%，核心板块“随机变量与分布”存在明显短板；优势板块“期望”“数列的极限”支撑了总体表现。综合广度与深度，给出掌握度约0.37。',
      },
      {
        name: 'progress_speed',
        value: 0.34,
        explanation: '按最近练习序列观察，准确率经历0.43→0.33→0.14→0.50的波动，未形成连续稳定的上升趋势；虽有反弹但样本量小、证据不足，成长速度评估偏低到中等。',
      },
      {
        name: 'stability',
        value: 0.3,
        explanation: '从多次练习的准确率波动以及不同章节间表现差异推断，一致性不足：同一阶段内出现明显滑落与回升；大样本日（9/8）与小样本日差异较大。综合评为偏低稳定性。',
      },
    ],
    insights: [
      {
        title: '期望与数列极限是相对优势板块',
        summary: '你在“期望”和“数列的极限”两个板块相对更稳，尤其是“期望”正确率达到约2/3；“数列的极限”在较大做题量下保持近五成，说明相关概念与方法已具备一定基础。',
        evidence: [
          '章节 4.1 期望：6题 4对，正确率 0.667',
          '章节 1.2 数列的极限：33题 16对，正确率 0.485',
        ],
        tags: [
          '优势领域',
          '掌握相对扎实',
        ],
      },
      {
        title: '随机变量与分布、以及不定积分是主要短板',
        summary: '与“期望”相比，概率论基础中的“随机变量与分布”相关内容较薄弱，且在“边缘分布”出现零命中；同时， calculus 基础（不定积分）也偏薄。这些短板可能是整体正确率受限的关键因素。',
        evidence: [
          '章节 2.1 随机变量及其分布函数：6题 1对，正确率 0.167',
          '章节 3.2 边缘分布：2题 0对，正确率 0.000',
          '章节 4.1 不定积分的概念：8题 2对，正确率 0.250',
          '章节 7.1 泊松过程的三种等价定义：4题 1对，正确率 0.250',
        ],
        tags: [
          '短板识别',
          '需重点巩固',
        ],
      },
      {
        title: '难度提升带来小幅掉分，高难题已有命中',
        summary: '随难度上升，正确率呈小幅下降，说明在中高难度题目上存在一定适应性问题；但已在高难度题上取得过正确，具备突破基础。',
        evidence: [
          '难度1：40题 17对，正确率 0.425',
          '难度2：43题 17对，正确率 0.395',
          '难度3：3题 1对，正确率 0.333',
        ],
        tags: [
          '难度适应度一般',
          '具备突破迹象',
        ],
      },
      {
        title: '近期成绩波动明显，样本量限制了趋势判断',
        summary: '近5次练习的准确率起伏较大，出现过明显下滑后又反弹；除9月8日外，其余几次样本量偏小，导致表现不够稳定且对趋势判断的置信度有限。',
        evidence: [
          '2025-09-08：72题 31对，正确率 0.431',
          '2025-09-10：2题 1对，正确率 0.500',
          '2025-09-11：3题 1对，正确率 0.333',
          '2025-09-15：7题 1对，正确率 0.143',
          '2025-09-19：2题 1对，正确率 0.500',
        ],
        tags: [
          '波动较大',
          '样本量偏小',
        ],
      },
    ],
    milestones: [
      '累计完成86题，达成阶段练习量目标',
      '在“4.1 期望”章节达到正确率≥66%（6题4对）',
      '已在高难度（3级）题目中取得正确（3题1对）',
      '在“1.2 事件的概率”保持100%正确（1题1对，样本量小）',
    ],
  },
  dialogueAnalysis: {
    metrics: [
      {
        name: '提问深度（depth）',
        value: 0.35,
        explanation: '多数为单轮或双轮求助，集中在“看不懂题意/要提示/要选项”，缺少持续追问与自我推导展示，整体深度有限；亦有个别错因追问，略有加分。',
      },
      {
        name: '思维逻辑性（logical_coherence）',
        value: 0.45,
        explanation: '表述通常简洁明了，但缺少关键背景（题干、尝试步骤、卡点）导致逻辑链不完整；在少数场景能围绕定义展开澄清，整体中等偏低。',
      },
      {
        name: '求知欲（curiosity）',
        value: 0.56,
        explanation: '多次请求“第一步提示”、询问错因，显示求知动机；但也有直接索要答案的情况，拉低整体表现。',
      },
      {
        name: '求助有效性（helpfulness）',
        value: 0.4,
        explanation: '较多“低信息量”求助（如反复“我不确定该用哪个公式”），对助教定位问题帮助有限；在个别题目中能配合追问与确认，综合偏低。',
      },
    ],
    insights: [
      {
        title: '偏好“第一步提示”，理解导向但上下文不足',
        summary: '你常在入手前请求“第一步提示”或概念澄清，愿意先理解定义与判定标准，这体现了以理解为先的学习取向。但多次未附具体题干、关键条件或你的已有思路，导致助教需要反复追问，降低交互效率。建议：在求提示时附上题目编号/关键信息与你已想到的第一步。',
        evidence: [
          'Q458 AI答疑: 用户“我不太明白题目的意思”',
          'Question 242 Chat: 用户“我不太明白题目的意思”',
          'Question 461 Chat: 用户“请给出第一步提示”',
          'Question 272 Chat: 用户先要提示、后问“选什么”',
        ],
        tags: [
          '好奇心强',
          '需要澄清问题',
          '交互效率待提升',
        ],
      },
      {
        title: '泛化求助较多，缺少关键信息导致低效互动',
        summary: '你多次以“我不确定该用哪个公式”作为开场，但未提供题干、变量含义或你尝试过的路径，这类泛化求助难以获得有效回应。建议：用“三要素”结构提问——题干要点、已尝试步骤（哪一步卡住）、你最想要的帮助类型（思路/公式/检算/边界条件）。',
        evidence: [
          'Question 254/255/217/Q357/Q384 多轮对话：多次重复“我不确定该用哪个公式”且未补充题目细节',
          'Question 287 Chat：类似泛化求助',
        ],
        tags: [
          '求助方式需改进',
          '低信息量提问',
        ],
      },
      {
        title: '具备结果校验与错因追问的习惯',
        summary: '你会进行结果核对与错因追问，体现元认知意识与纠错意愿。若能同时贴出自己的关键计算步骤（如代入、界限、独立性判断），助教可更快定位误区，也能更好训练你的自我检错能力。',
        evidence: [
          'Question 353 Chat：用户“我做对了吗？”',
          'Question 352 Chat：用户“我觉得我做对了，但结果不对”',
          'Q271 AI答疑：收到答案后追问“我哪里算错了?”',
        ],
        tags: [
          '元认知觉察',
          '高质量提问（潜力）',
        ],
      },
      {
        title: '偶有直接要答案的倾向，过程反馈不足',
        summary: '部分对话呈现“直接要答案/选项”的应试取向，且在获得分步提示后未继续回传中间计算。这限制了深度学习效果。建议：依据提示先算一小步并回传，让助教即时纠偏，从而形成高质量“协作解题”。',
        evidence: [
          'Question 466 Chat：用户“这道题选什么”',
          'Question 272 Chat：用户“选什么”',
          '多处：在助教给出分步思路后未继续反馈中间结果',
        ],
        tags: [
          '应试导向',
          '需要过程反馈',
        ],
      },
    ],
    representativeDialogues: [
      'Q271 AI答疑｜泊松过程\n学生：我不确定该用哪个公式\n助教：这道题用泊松过程的“定长区间内到达数服从泊松分布”。……代入 λ=10, t=2，P= e^{-20}\n学生：我哪里算错了?\n助教：你大概率是把“区间长度”或“k 的取值”弄混了。……列出常见错误并对照排查',
      'Question 466 Chat｜三项分布思路拆解\n学生：这道题选什么\n助教：先别急着选……将 (X,Y) 视作三项分布，枚举 (0,0),(1,0),(0,1),(1,1) 并给出通式与计算提示，建议先算 P(1,1) 作为下界再汇总',
      'Q458 AI答疑｜二维分布函数判定\n学生：我不太明白题目的意思\n助教：先把题意捋清楚……回顾二维分布函数定义、基本性质（单调性、右连续、矩形增量非负等），并让学生先指出不清楚的点再制定判断思路',
    ],
  },
  learningAnalysis: {
    profileLabel: '理解导向反思型',
    metrics: [
      {
        name: 'resilience',
        value: 0.5,
        explanation: '在经历明显下滑（0.143）后能快速反弹至0.50，且高难题已有命中；多次主动求提示与错因，显示持续投入与回到任务的意愿。但总体进步速度偏低（0.34）、稳定性偏低（0.3），韧性为中等水平。',
      },
      {
        name: 'reflectiveness',
        value: 0.58,
        explanation: '多次进行结果核对与错因追问（如Q271/Q353/Q352），展现元认知意识与纠错动机；同时常缺少关键步骤与背景，限制了反思的深度与可操作性。综合评为中等偏上。',
      },
      {
        name: 'consistency',
        value: 0.32,
        explanation: '章节与近期表现波动较大（稳定性0.3；日间表现差异显著），求助方式在“要提示/要答案/泛化求助”间切换，行为链条常被中断，表现为一致性不足。',
      },
    ],
    insights: [
      {
        title: '“第一步提示”偏好明显，但上下文提供不足',
        summary: '偏好先要“第一步提示”或概念澄清，体现理解优先；但常缺题干要点、变量定义与已尝试步骤，导致反复追问，交互效率被拉低。若在求助时附“三要素”（题干要点/卡点/所需帮助类型），可显著提升助教响应质量。',
        evidence: [
          'Q458/Question 242/Question 461/Question 272：多次以“我不太明白题意/请给出第一步提示/选什么”开场',
          '代表性对话 Q458：助教需要回顾二维分布函数定义与性质并反复澄清',
          '指标：提问深度（0.35）、求助有效性（0.4）提示信息量偏低',
        ],
        tags: [
          '理解导向',
          '交互效率待提升',
          '需要结构化提问',
        ],
      },
      {
        title: '优势与短板并存：概率基础短板限制整体表现',
        summary: '在“期望”“数列的极限”上具备相对稳定的概念与方法；但“随机变量与分布”“边缘分布”与“不定积分”构成主要短板，拖累整体正确率与稳定性。聚焦补齐概率论核心概念与微积分基础，可带动整体表现提升。',
        evidence: [
          '章节 4.1 期望：6题 4对，正确率 0.667',
          '章节 1.2 数列的极限：33题 16对，正确率 0.485',
          '章节 2.1 随机变量及其分布函数：6题 1对，正确率 0.167',
          '章节 3.2 边缘分布：2题 0对，正确率 0.000',
          '章节 4.1 不定积分的概念：8题 2对，正确率 0.250',
        ],
        tags: [
          '优势明确',
          '短板清晰',
          '需要针对性补弱',
        ],
      },
      {
        title: '难度适应中等：已有高难命中但波动明显',
        summary: '随难度上升正确率小幅下降，但已在高难题上有命中，显示具备突破基础；同时近期表现波动提醒在中高难度的策略与耐心仍需锻炼。建议采用“分步确认—回传中间结果”的协作解题提高命中率。',
        evidence: [
          '难度1：40题 17对，正确率 0.425',
          '难度2：43题 17对，正确率 0.395',
          '难度3：3题 1对，正确率 0.333',
          '近期序列：0.43→0.33→0.14→0.50（样本量小）',
        ],
        tags: [
          '难度适应一般',
          '具备突破迹象',
          '建议小步验证',
        ],
      },
      {
        title: '结果校验与错因追问体现元认知潜力',
        summary: '具备元认知与纠错动机，会进行结果校验和错因追问。若能同步提供关键计算步骤（如代入、界限设定、独立性判断），可更快定位误区，形成高质量闭环。',
        evidence: [
          'Question 353/352：主动核对“我做对了吗/我觉得做对了但结果不对”',
          'Q271：收到答案后追问“我哪里算错了?” 并配合排查',
          '整体指标：求知欲 0.56、思维逻辑性 0.45（逻辑链不完整但愿意澄清）',
        ],
        tags: [
          '元认知',
          '纠错意识',
          '高质量提问潜力',
        ],
      },
      {
        title: '泛化求助与直接要答案降低了学习深度',
        summary: '存在“泛化求助”与“直接要答案”的应试化倾向，且在获得分步提示后未持续回传中间计算，限制了深度学习与稳定性。建议：每次提示后先完成一小步并回传，形成协作式迭代。',
        evidence: [
          'Question 254/255/217/Q357/Q384/Q287：多次“我不确定该用哪个公式”但未补充细节',
          'Question 466/272：直接询问选项/答案，缺少过程反馈',
          '指标：求助有效性 0.4、提问深度 0.35',
        ],
        tags: [
          '应试导向',
          '低信息量提问',
          '需要过程反馈',
        ],
      },
    ],
    samplePaths: [
      [
        '查看题目',
        '请求第一步提示',
        '根据提示尝试一小步',
        '回传中间结果/卡点',
        '再次提示或纠偏',
        '完成作答',
      ],
      [
        '查看题目',
        '不确定用哪个公式',
        '助教给出概念/判定标准',
        '代入参数尝试',
        '核对结果',
        '追问错因/修正',
      ],
      [
        '查看题目',
        '直接询问选项/答案',
        '查看解析/提示',
        '未回传中间计算',
        '结束',
      ],
      [
        '查看题目',
        '作答错误',
        '查看定义/性质回顾',
        '定位错误步骤（如界限/独立性）',
        '修正并再次作答',
      ],
    ],
  },
  cognitiveAnalysis: {
    thinkingStyles: [
      '提问驱动型',
      '跳跃型',
      '系统试错型',
    ],
    metrics: [
      {
        name: 'reasoning',
        value: 0.44,
        explanation: '思维表述通常清晰但关键信息常缺，导致推理链不完整（思维逻辑性 0.45；求助有效性 0.40）。做题端随难度上升出现小幅掉分与阶段内波动（稳定性 0.30），显示推理在复杂情境下易断点。综合评估为中等偏下。',
      },
      {
        name: 'abstraction',
        value: 0.42,
        explanation: '在“期望”“数列极限”等抽象概念上相对稳健，但“随机变量与分布”“不定积分”等核心概念薄弱，反映抽象表征与定义-性质的内化不均衡。整体掌握度与正确率均处中低区间，抽象水平评估为偏低到中等。',
      },
      {
        name: 'transfer',
        value: 0.38,
        explanation: '跨题型与跨难度的迁移表现一般：难度提高伴随正确率下降；章节间差异较大；进步速度 0.34、稳定性 0.30。虽有高难命中，显示具备可迁移的种子，但当前迁移的一致性与广度不足。',
      },
    ],
    insights: [
      {
        title: '提示锚定的提问驱动，逻辑链条易断',
        summary: '以提示为锚的提问驱动明显，重视概念澄清，但常缺少题干要点与中间推导，导致推理链条断裂与交互效率偏低。若能在请求提示时同步给出关键条件与已尝试路径，可显著提升逻辑连贯与反馈质量。',
        evidence: [
          '提问深度 0.35、思维逻辑性 0.45、求助有效性 0.40（分析2）',
          '偏好“第一步提示”，但上下文与已尝试步骤经常缺失（分析2-洞察1）',
          '泛化求助较多，缺少关键信息，影响助教定位问题（分析2-洞察2）',
        ],
        tags: [
          '提问驱动',
          '逻辑链条不完整',
          '交互效率待提升',
        ],
      },
      {
        title: '概念理解不均衡，概率分布与积分是薄弱环节',
        summary: '抽象概念掌握存在“强-弱板块”分化：期望与数列极限相对扎实，而随机变量与分布、不定积分等核心概念较薄弱，显示概念网络尚未连通，易在跨概念题目中失分。',
        evidence: [
          '随机变量及其分布函数正确率 0.167、边缘分布 0.000（分析1）',
          '不定积分的概念正确率 0.250（分析1）',
          '“期望”正确率 0.667，“数列的极限”在较大样本下 0.485（分析1）',
        ],
        tags: [
          '抽象概念薄弱',
          '需要系统复盘',
          '优势可迁移',
        ],
      },
      {
        title: '迁移与难度适应一般，但具备突破迹象',
        summary: '随难度上升正确率小幅下滑，说明在将已知方法迁移到更复杂场景时适应度一般；但已有高难命中，表明具备突破起点。需在“方法—条件—边界”的映射上加强迁移练习。',
        evidence: [
          '难度1→2→3 正确率 0.425→0.395→0.333（分析1）',
          '已在难度3题目中取得命中（分析1 里程碑）',
          '进步速度 0.34、稳定性 0.30（分析1）',
        ],
        tags: [
          '迁移待提升',
          '难度适应一般',
          '突破基础存在',
        ],
      },
      {
        title: '元认知觉察存在，过程反馈不足限制内化',
        summary: '具有较好的元认知觉察与纠错动机，会核对结果并追问错因；但过程性反馈不足限制了即时纠偏与深层内化。若能按“做一小步—回传—校正”循环，可放大学习效率。',
        evidence: [
          '求知欲 0.56（分析2）',
          '具备结果校验与错因追问的习惯（分析2-洞察3）',
          '偶有直接要答案，且在获得分步提示后未持续回传中间结果（分析2-洞察4）',
        ],
        tags: [
          '元认知',
          '纠错驱动',
          '过程化练习',
        ],
      },
      {
        title: '表现波动较大，受题型与样本量影响',
        summary: '阶段内正确率起伏较大，表现受题型与样本量影响明显。需要通过规律练习与结构化复盘来提升一致性。',
        evidence: [
          '稳定性 0.30（分析1）',
          '近期成绩波动明显且样本量限制趋势判断（分析1-洞察4）',
        ],
        tags: [
          '稳定性偏低',
          '规律练习需求',
        ],
      },
    ],
  },
  studyPlan: {
    weaknesses: [
      '概率论核心短板：随机变量及其分布函数、边缘分布、泊松过程等价定义理解不足',
      '微积分基础薄弱：不定积分概念与方法选择（换元/分部）不稳',
      '模型识别与参数映射能力弱：何时用二项/泊松/三项/指数判别不清',
      '推理链易断：变量取值域、积分/求和界限、独立性与条件事件常被忽略',
      '难度适应与稳定性偏低：小样本波动大，未形成规律化复盘',
      '提问方式低信息量：缺少题干要点、已尝试步骤与所需帮助类型；过程回传不足',
      '迁移与抽象内化不足：跨题型迁移和定义-性质的连接松散',
    ],
    styleAdaptation: '学习风格为“理解导向反思型”，偏好第一步提示。任务设计采用：- 分步提示+中间结果回传，满足提示偏好并强制过程化思考；- 小步快跑+即时纠偏，降低跳跃型思维的漏检风险；- 三要素结构化提问模板，提高交互效率；- 引入检查清单（变量域、界限、独立性、单位），弥补逻辑链断点；- 系统试错配合错因标签库，促进可迁移的纠错记忆。',
    personalizedRecommendations: [
      {
        title: '概念校准微课：随机变量与分布函数一次到位',
        description: '用20-30分钟系统梳理：连续/离散随机变量、分布函数F(x)的性质（单调、右连续、极限）、密度与分布函数关系、离散型的概率质量函数、常见反例（不满足右连续/非单调）。建议边看边做2-3个“判断是否为分布函数”的快题，记录判断依据。最后自测5题小测并标注错因。',
        actionType: '微课学习',
        targetKnowledge: '2.1 随机变量及其分布函数（定义、性质、判定）',
        triggerReason: '该板块正确率0.167，属主要短板；思维链常断，需以性质清单建立判定框架。',
      },
      {
        title: '边缘分布分步攻克：三类型例题拆解',
        description: '围绕二维分布函数与联合分布→边缘分布转换，精讲3类题：1) 给F_{X,Y}(x,y)求边缘分布；2) 给联合密度求边缘并判断独立性；3) 给表格型联合分布求边缘与条件分布。每题按‘第一步提示’切入：先画变量区间示意图→写积分/求和界限→计算→检验（非负、归一）。你需在每步后回传中间结果。',
        actionType: '例题精讲',
        targetKnowledge: '3.2 边缘分布；联合/边缘/条件的关系与独立性判定',
        triggerReason: '边缘分布0/2命中，界限设定与独立性判断易错；与你的“第一步提示”偏好匹配，适合分步协作。',
      },
      {
        title: '一页纸“概率模型选择树”与打靶练习',
        description: '构建“模型选择树”：伯努利/二项/泊松/几何/负二项/三项/超几何/指数/正态。为每一类写上触发条件（是否放回、样本量大、稀有事件、到达过程、区间长度t、类别≥3等）、参数含义与典型陷阱。用5道小题进行“给场景选模型”的快速打靶练习。',
        actionType: '方法总结',
        targetKnowledge: '概率模型识别与参数映射；泊松过程等价定义的适用场景',
        triggerReason: '多次出现“我不确定该用哪个公式”，模型识别与参数映射不清阻塞后续步骤。',
      },
      {
        title: '不定积分方法选择与执行清单训练',
        description: '不定积分基础修复：1) 基础型：基本积分表熟悉与常见替换（x→ax+b、指数/对数/反三角）；2) 技巧型：换元与分部积分的识别题，提供“何时分部、何时换元”的决策清单；3) 组合型：分段函数、参数法。采用“先判定方法—再执行—再检验”的三步法。',
        actionType: '分层练习',
        targetKnowledge: '不定积分的概念与方法选择（换元、分部、分解）',
        triggerReason: '章节4.1不定积分概念正确率0.25，方法选取与执行存在系统性短板。',
      },
      {
        title: '错因标签化复盘与72小时重做',
        description: '建立错因标签库：A 边界/区间设定错；B 独立性误判；C 模型选错；D 代入/计算细节错；E 定义性质遗忘；F 条件概率与全概率混淆。每次训练后挑2-3题为代表，填写‘三要素提问’模板并标注标签，48-72小时后重做。',
        actionType: '错题复盘',
        targetKnowledge: '元认知与纠错体系；联合-边缘-条件与独立性的常见错因',
        triggerReason: '稳定性0.3、提问深度0.35，缺少结构化复盘与过程反馈；需构建可迭代纠错机制。',
      },
      {
        title: '大样本日稳定性拉练（周更）',
        description: '每周1次“大样本日”：40-60题混合（难度1≈60%、难度2≈35%、难度3≈5%），目标是在较长时间窗内保持节奏与质量；训练中执行‘做一小步—回传—纠偏’策略，记录命中率与体感难点，形成周报（3条做对原因、3条错因）。',
        actionType: '限时训练',
        targetKnowledge: '难度适应与稳定性；跨题型迁移',
        triggerReason: '近期波动明显、样本量偏小，需稳定性与迁移的系统拉练。',
      },
      {
        title: '“第一步提示+回传中间结果”的协作协议',
        description: '为每次与助教互动固定协议：- 先发“三要素”：题干要点/卡点/所需帮助类型；- 接收第一步提示后，完成一小步并回传中间量（如界限、选定模型、代入表达式）；- 若分歧出现，优先核对单位、变量域、独立性与条件事件。持续3次以上形成肌肉记忆。',
        actionType: '协作解题',
        targetKnowledge: '高质量提问与过程性反馈；联合-边缘计算中的关键中间量',
        triggerReason: '偏好‘第一步提示’但上下文不足、过程反馈缺失，影响助教定位与你的内化。',
      },
      {
        title: '高错点对症集训（小步快跑版）',
        description: '专题小集：1) 三项分布与联合分布的联系，枚举(0,0),(1,0),(0,1),(1,1)等案例；2) 泊松过程：定长区间到达数、独立增量、平稳增量三种等价定义的应用；3) 条件概率与全概率，先画事件图再计算。每题限定先写“模型选择理由”。',
        actionType: '练习题',
        targetKnowledge: '多元分布与三项分布；泊松过程性质；条件概率与全概率',
        triggerReason: '代表性对话与证据显示在三项分布与泊松过程中存在模型与参数混淆。',
      },
      {
        title: '优势带动拔高：期望板块进阶',
        description: '期望与方差的巩固与拔高：全期望公式与全方差公式、离散/连续统一表述、函数变换E[g(X)]（离散求和/连续积分）、切比雪夫不等式的判定边界。配套5题中阶练习，要求写出“使用该公式的前提”。',
        actionType: '微课学习',
        targetKnowledge: '期望与方差；全期望/全方差；不等式应用',
        triggerReason: '期望板块正确率较高（≈2/3），适合作为牵引点带动联合分布与函数变换类题目。',
      },
      {
        title: '六点检查清单：避免跳步与漏检',
        description: '构建检查清单：- 变量与取值域；- 条件事件与已知信息；- 模型/分布假设；- 积分/求和界限；- 单位与量纲；- 最终归一/非负检查。每题先过清单再动手，减少跳跃带来的漏项。',
        actionType: '方法总结',
        targetKnowledge: '解题流程规范化与逻辑链完整性',
        triggerReason: '思维跳跃易断链、逻辑性0.45，需通过仪式化清单保障完整性。',
      },
      {
        title: '阶段评估与策略微调（第2周末/第4周末）',
        description: '两套阶段测：A 概念判定（分布函数、独立性、条件概率）；B 计算执行（边缘分布、不定积分方法选择、期望/方差）。完成后与首周数据对比，给出三项量化改进（准确率、用时、错因分布）。',
        actionType: '诊断测验',
        targetKnowledge: '阶段性掌握评估与策略校正',
        triggerReason: '需要量化监测提升与校正学习路径；进步速度与稳定性偏低需要闭环度量。',
      },
    ],
    overallStrategy: '总体路线（3-4周）：以“概率基础修复 + 微积分打底 + 分步协作解题”三线并行。第1周集中校准随机变量/分布函数/边缘分布等核心概念，配合小体量分步练习和错因标注；第2周加入不定积分基础与常见模型识别（伯努利/二项/泊松/三项/指数/正态），进行中等题的迁移训练；第3-4周做混合题与变式题，采用“做一小步—回传—纠偏”的协作节奏，逐步提升难度与稳定性。纪律与度量：每周1次“大样本日”（≥40题）评估稳定性，日常4-5天维持5-12题“保手感”小样本；每次练习后10分钟结构化复盘（错因标注、公式选择树定位、边界/独立性检查）。目标：3周内将总体正确率提升至0.55-0.60，稳定性≥0.5，随机变量与分布、边缘分布章节正确率提升至≥0.5，不定积分概念正确率≥0.6；形成“三要素提问+过程回传”的稳定习惯。',
  },
  chapterSummary: [],
}); // dummy data

const router = useRouter();
const isOpen = ref(true);
const isGenerating = ref(false);
const configStore = useConfigStore();
const agreed = ref(false);
const poller = ref<number | null>(null);

async function fetchAnalysisData() {
  if (!configStore.currentSubject) {
    return;
  }
  try {
    const response = await analysisApi(configStore.currentSubject.id_);
    if (response.analysis) {
      response.analysis.objectiveAnalysis.metrics = response.analysis.objectiveAnalysis.metrics.slice(0, 4);
      response.analysis.chapterSummary = response.analysis.chapterSummary.sort((a, b) => Number.parseFloat(a.chapter.name.split(' ')[0]) - Number.parseFloat(b.chapter.name.split(' ')[0]));
      data.value = response.analysis;
      isGenerating.value = false;
      isOpen.value = false;
      if (poller.value !== null) {
        clearInterval(poller.value);
        poller.value = null;
      }
    }
    else {
      if (!isGenerating.value) {
        startGeneration();
      }
    }
  }
  catch (error) {
    console.error('Error during analysis analysis:', error);
  }
}

function startGeneration() {
  if (isGenerating.value)
    return;
  isOpen.value = true;
  isGenerating.value = true;
  fetchAnalysisData();
  poller.value = window.setInterval(() => {
    fetchAnalysisData();
  }, 10000);
}

onMounted(() => {
  if (configStore.confirmedAiPolicy) {
    isOpen.value = false;
    fetchAnalysisData();
  }
});

onBeforeUnmount(() => {
  if (poller.value !== null) {
    clearInterval(poller.value);
    poller.value = null;
  }
});
</script>

<template>
  <div class="relative overflow-y-hidden">
    <div :class="isOpen ? 'blur pointer-events-none select-none' : 'overflow-y-auto h-full'">
      <TestPanel v-if="data" :data="data" />
    </div>

    <transition name="fade" appear>
      <div
        v-if="isOpen"
        class="z-50"
        aria-hidden="true"
      />
    </transition>

    <transition name="zoom">
      <div
        v-if="isOpen"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        aria-describedby="consent-desc"
      >
        <div
          v-auto-animate
          tabindex="-1"
          class="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 outline-none transition-all"
        >
          <div v-if="!configStore.confirmedAiPolicy" class="p-6">
            <h2 id="consent-title" class="text-xl font-semibold">
              确认并同意
            </h2>
            <p id="consent-desc" class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              在生成 AI 个人学情报告前，请阅读并勾选同意。
            </p>

            <div class="mt-4 flex items-start gap-2">
              <Checkbox id="agree" v-model:checked="agreed" class="mt-1 rounded-[30%]" />
              <label for="agree" class="text-sm leading-6">
                我已阅读并同意
                <a href="#" class="underline underline-offset-4 hover:no-underline" @click.prevent>
                  《AI 生成使用声明》
                </a>
                ，并知悉生成内容可能包含不准确或敏感信息。
              </label>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <Button variant="outline" @click="router.go(-1)">
                取消
              </Button>
              <Button :disabled="!agreed" class="transition-all" @click="configStore.confirmedAiPolicy = true">
                同意并继续
              </Button>
            </div>
          </div>
          <div v-else v-auto-animate class="p-8 text-center">
            <div class="space-y-3">
              <h3 class="text-xl font-semibold text-gray-900">
                AI 个人学情报告
              </h3>
              <p class="mx-auto max-w-md text-sm text-gray-600 leading-relaxed">
                基于您的学习数据智能生成个性化分析报告，预计需要 1-3 分钟
              </p>
            </div>

            <div v-if="isGenerating" class="flex flex-col items-center">
              <DotLottieVue style="height: 250px; width: 250px" autoplay loop src="https://lottie.host/ee66b931-c9e5-423e-8ddc-138351b19489/4p5yNwGj6g.json" />
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-700">
                  正在分析您的学习数据...
                </p>
                <p class="text-xs text-gray-500">
                  您可以切换到其他页面，完成后将自动显示
                </p>
              </div>
            </div>

            <Button
              :disabled="isGenerating"
              size="lg"
              class="h-10 w-30 mt-8"
              @click="startGeneration"
            >
              {{ isGenerating ? '生成中...' : '开始生成' }}
            </Button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.zoom-enter-active, .zoom-leave-active { transition: opacity .18s ease, transform .18s ease; }
.zoom-enter-from, .zoom-leave-to { opacity: 0; transform: scale(0.98); }
</style>
