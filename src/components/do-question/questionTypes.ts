import { ref, toRaw } from 'vue';

interface QuestionChoice {
  content: string;
  isCorrect: boolean;
}

// 题目接口
interface Question {
  id: number;
  category: string;
  content: string;
  choices: QuestionChoice[];
  analysis: string;
  knowledgePoint: string;
  difficulty: string;
  lastResult?: boolean | null;
}

// 题目数据
const chapter1Section1Questions = ref<Question[]>([
]);
const chapter1Section2Questions = ref<Question[]>([
]);
const chapter1Section3Questions = ref<Question[]>([
]);
const chapter1Section4Questions = ref<Question[]>([
]);
const chapter2Section1Questions = ref<Question[]>([
]);
const chapter2Section2Questions = ref<Question[]>([
]);
const chapter2Section3Questions = ref<Question[]>([
]);
const chapter2Section4Questions = ref<Question[]>([
]);
const chapter3Section1Questions = ref<Question[]>([
]);
const chapter3Section2Questions = ref<Question[]>([
]);
const chapter3Section3Questions = ref<Question[]>([
]);
const chapter3Section4Questions = ref<Question[]>([
]);
const chapter3Section5Questions = ref<Question[]>([
]);
const chapter4Section1Questions = ref<Question[]>([
]);
const chapter4Section2Questions = ref<Question[]>([
]);
const chapter4Section3Questions = ref<Question[]>([
]);
const chapter4Section4Questions = ref<Question[]>([
]);
const chapter4Section5Questions = ref<Question[]>([
]);
const chapter5Section1Questions = ref<Question[]>([
]);
const chapter5Section2Questions = ref<Question[]>([
]);
const chapter5Section3Questions = ref<Question[]>([
]);
const chapter6Section1Questions = ref<Question[]>([
]);
const chapter6Section2Questions = ref<Question[]>([
]);
const chapter6Section3Questions = ref<Question[]>([
]);
const chapter6Section4Questions = ref<Question[]>([
]);
const chapter7Section1Questions = ref<Question[]>([
]);
const chapter7Section2Questions = ref<Question[]>([
]);
const chapter7Section3Questions = ref<Question[]>([
]);
const chapter7Section4Questions = ref<Question[]>([
]);
const chapter7Section5Questions = ref<Question[]>([
]);
const chapter7Section6Questions = ref<Question[]>([
]);
const chapter7Section7Questions = ref<Question[]>([
]);
const chapter7Section8Questions = ref<Question[]>([
]);
const chapter8Section1Questions = ref<Question[]>([
]);
const chapter8Section2Questions = ref<Question[]>([
]);
const chapter8Section3Questions = ref<Question[]>([
]);
const chapter8Section4Questions = ref<Question[]>([
]);
const chapter8Section5Questions = ref<Question[]>([
]);
const chapter8Section6Questions = ref<Question[]>([
]);
const chapter8Section7Questions = ref<Question[]>([
]);
const chapter9Section1Questions = ref<Question[]>([
]);
const chapter9Section2Questions = ref<Question[]>([
]);
const chapter9Section3Questions = ref<Question[]>([
]);
const chapter9Section4Questions = ref<Question[]>([
]);
const chapter9Section5Questions = ref<Question[]>([
]);
const chapter9Section6Questions = ref<Question[]>([
]);

export type { Question, QuestionChoice };

// 章节题目映射
export const questionSectionMap = ref<{ [key: string]: Question[] }>({
  1.1: toRaw(chapter1Section1Questions.value),
  1.2: toRaw(chapter1Section2Questions.value),
  1.3: toRaw(chapter1Section3Questions.value),
  1.4: toRaw(chapter1Section4Questions.value),
  2.1: toRaw(chapter2Section1Questions.value),
  2.2: toRaw(chapter2Section2Questions.value),
  2.3: toRaw(chapter2Section3Questions.value),
  2.4: toRaw(chapter2Section4Questions.value),
  3.1: toRaw(chapter3Section1Questions.value),
  3.2: toRaw(chapter3Section2Questions.value),
  3.3: toRaw(chapter3Section3Questions.value),
  3.4: toRaw(chapter3Section4Questions.value),
  3.5: toRaw(chapter3Section5Questions.value),
  4.1: toRaw(chapter4Section1Questions.value),
  4.2: toRaw(chapter4Section2Questions.value),
  4.3: toRaw(chapter4Section3Questions.value),
  4.4: toRaw(chapter4Section4Questions.value),
  4.5: toRaw(chapter4Section5Questions.value),
  5.1: toRaw(chapter5Section1Questions.value),
  5.2: toRaw(chapter5Section2Questions.value),
  5.3: toRaw(chapter5Section3Questions.value),
  6.1: toRaw(chapter6Section1Questions.value),
  6.2: toRaw(chapter6Section2Questions.value),
  6.3: toRaw(chapter6Section3Questions.value),
  6.4: toRaw(chapter6Section4Questions.value),
  7.1: toRaw(chapter7Section1Questions.value),
  7.2: toRaw(chapter7Section2Questions.value),
  7.3: toRaw(chapter7Section3Questions.value),
  7.4: toRaw(chapter7Section4Questions.value),
  7.5: toRaw(chapter7Section5Questions.value),
  7.6: toRaw(chapter7Section6Questions.value),
  7.7: toRaw(chapter7Section7Questions.value),
  7.8: toRaw(chapter7Section8Questions.value),
  8.1: toRaw(chapter8Section1Questions.value),
  8.2: toRaw(chapter8Section2Questions.value),
  8.3: toRaw(chapter8Section3Questions.value),
  8.4: toRaw(chapter8Section4Questions.value),
  8.5: toRaw(chapter8Section5Questions.value),
  8.6: toRaw(chapter8Section6Questions.value),
  8.7: toRaw(chapter8Section7Questions.value),
  9.1: toRaw(chapter9Section1Questions.value),
  9.2: toRaw(chapter9Section2Questions.value),
  9.3: toRaw(chapter9Section3Questions.value),
  9.4: toRaw(chapter9Section4Questions.value),
  9.5: toRaw(chapter9Section5Questions.value),
  9.6: toRaw(chapter9Section6Questions.value),
});
