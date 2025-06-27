// src/constants/modes.ts
import { Dice3, Infinity, MoveUpRight } from 'lucide-vue-next';

export interface ModeConfig {
  key: string;
  name: string;
  icon: any; // 你可以更细致地定义类型
  color: string;
  route: string;
  desc?: string[];
}

export const MODES: ModeConfig[] = [
  { key: 'advmath', name: "邮趣高数", icon: Infinity, color: 'rgb(34, 168, 109)', route: '/dashboard-advmath', desc: ['微积分，函数与极限的艺术', '适合喜欢挑战和推理的你'] },
  { key: 'linalg', name: "邮趣线代", icon: MoveUpRight, color: 'rgb(142, 68, 173)', route: '/dashboard-linalg', desc: ['空间与向量的语言', '适合喜欢抽象思维和结构分析的你'] },
  { key: 'prob', name: "邮趣概率", icon: Dice3, color: 'rgb(36, 96, 226)', route: '/dashboard-prob', desc: ['探索不确定世界的规律', '适合喜欢逻辑和建模的你'] },
];