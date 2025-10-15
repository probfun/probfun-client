import { ChartLine, Dices, Infinity as InfinityIcon, MoveUpRight, Percent } from 'lucide-vue-next';
import { experimentConfig as advancedMath1ExperimentConfig } from '@/components/subject/advanced-math-1/experimentConfig.ts';
import { homeConfig as advancedMath1HomeConfig } from '@/components/subject/advanced-math-1/homeConfig.ts';
import { experimentConfig as advancedMath2ExperimentConfig } from '@/components/subject/advanced-math-2/experimentConfig.ts';
import { homeConfig as advancedMath2HomeConfig } from '@/components/subject/advanced-math-2/homeConfig.ts';
import { experimentConfig as linearAlgebraExperimentConfig } from '@/components/subject/linear-algebra/experimentConfig.ts';

import { homeConfig as linearAlgebraHomeConfig } from '@/components/subject/linear-algebra/homeConfig.ts';
import { experimentConfig as numberTheoryExperimentConfig } from '@/components/subject/number-theory/experimentConfig.ts';
import { homeConfig as numberTheoryHomeConfig } from '@/components/subject/number-theory/homeConfig.ts';
import { experimentConfig as probabilityExperimentConfig } from '@/components/subject/probability/experimentConfig.ts';
import { homeConfig as probabilityHomeConfig } from '@/components/subject/probability/homeConfig.ts';
import { experimentConfig as statisticsExperimentConfig } from '@/components/subject/statistics/experimentConfig.ts';
import { homeConfig as statisticsHomeConfig } from '@/components/subject/statistics/homeConfig.ts';

interface Subject {
  id: SubjectId;
  id_: string;
  name: string;
  description: string;
  color: string;
  teacher: string;
  icon: any;
}

type SubjectId = 'probability' | 'advanced-math-1' | 'advanced-math-2' | 'linear-algebra' | 'number-theory' | 'statistics';

const subjectConfig: Record<SubjectId, Subject> = {
  'linear-algebra': {
    id: 'linear-algebra',
    id_: '7',
    name: '邮趣线代',
    description: '空间与向量的语言，适合喜欢抽象思维和结构分析的你',
    color: 'rgba(124,58,237,0.85)',
    teacher: '仝辉',
    icon: MoveUpRight,
  },
  'advanced-math-1': {
    id: 'advanced-math-1',
    id_: '2',
    name: '邮趣高数（上）',
    description: '微积分，函数与极限的艺术，适合喜欢挑战和推理的你',
    color: 'rgba(22,163,74,0.85)',
    teacher: '鞠红杰',
    icon: InfinityIcon,
  },
  'advanced-math-2': {
    id: 'advanced-math-2',
    id_: '3',
    name: '邮趣高数（下）',
    description: '微积分，函数与极限的艺术，适合喜欢挑战和推理的你',
    color: 'rgba(22,163,74,0.85)',
    teacher: '杜昊',
    icon: InfinityIcon,
  },
  'probability': {
    id: 'probability',
    id_: '5',
    name: '邮趣概率',
    description: '探索不确定世界的规律，适合喜欢逻辑和建模的你',
    color: 'rgba(36,96,226,0.85)',
    teacher: '张丽华、周清',
    icon: Dices,
  },
  'number-theory': {
    id: 'number-theory',
    id_: '8',
    name: '邮趣数论',
    description: '整数的奥秘与应用，适合喜欢逻辑和证明的你',
    color: 'rgba(249,115,22,0.85)',
    teacher: '朱萍',
    icon: Percent,
  },
  'statistics': {
    id: 'statistics',
    id_: '9',
    name: '邮趣统计',
    description: '数据分析与推断，适合喜欢实用和应用的你',
    color: 'rgba(225,29,72,0.85)',
    teacher: '待定',
    icon: ChartLine,
  },
} as const;

interface HomeConfig {
  experiments: {
    title: string;
    description: string;
    img: string;
    path: string;
  }[];
  mindMaps: {
    title: string;
    description: string;
    img: string;
    path: string;
  }[];
  thinking: {
    title: string;
    description: string[];
  }[];
}

interface DrawerItem {
  title: string;
  icon: string;
  children?: DrawerItem[];
  route?: string;
  chapterId?: string;
}

interface ExperimentConfig {
  experiments: DrawerItem[];
}

const homeConfigs: Record<SubjectId, HomeConfig> = {
  'probability': probabilityHomeConfig,
  'advanced-math-1': advancedMath1HomeConfig,
  'advanced-math-2': advancedMath2HomeConfig,
  'statistics': statisticsHomeConfig,
  'linear-algebra': linearAlgebraHomeConfig,
  'number-theory': numberTheoryHomeConfig,
};

const experimentConfigs: Record<SubjectId, ExperimentConfig> = {
  'probability': probabilityExperimentConfig,
  'advanced-math-1': advancedMath1ExperimentConfig,
  'advanced-math-2': advancedMath2ExperimentConfig,
  'statistics': statisticsExperimentConfig,
  'linear-algebra': linearAlgebraExperimentConfig,
  'number-theory': numberTheoryExperimentConfig,
};

export type { DrawerItem, HomeConfig, Subject, SubjectId };
export { experimentConfigs, homeConfigs, subjectConfig };
