import { ref,toRaw } from 'vue';

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
  {
    id: 1,
    category: '1.1样本空间与随机事件',
    content: '1. 下列试验能够构成事件的是',
    choices: [
      { content: '组件必须有template标签', isCorrect: false },
      { content: '组件可以通过props接收父组件数据', isCorrect: true },
      { content: '组件不能嵌套使用', isCorrect: false },
      { content: '组件的数据必须是对象类型', isCorrect: false }
    ],
    analysis: '',
    knowledgePoint: '',
    difficulty: '简单',
    lastResult: null,
  }
]);
const chapter1Section2Questions = ref<Question[]>([
  {
    id: 1,
    category: '1.2 事件的概率',
    content: '下列哪个CSS属性用于改变元素的背景颜色？',
    choices: [
      { content: 'color', isCorrect: false },
      { content: 'background', isCorrect: true },
      { content: 'text-decoration', isCorrect: false },
      { content: 'border', isCorrect: false }
    ],
    analysis: 'background属性用于设置元素的背景样式，包括背景颜色、背景图片等。<br><br>选项A错误：color用于设置文本颜色<br>选项C错误：text-decoration用于设置文本装饰（如下划线）<br>选项D错误：border用于设置元素边框',
    knowledgePoint: 'CSS背景属性、文本样式属性',
    difficulty: '简单',
    lastResult: null,
  },
  {
    id: 2,
    category: '1.2 事件的概率',
    content: 'React中哪个钩子函数用于在组件挂载后执行操作？',
    choices: [
      { content: 'useState', isCorrect: false },
      { content: 'useEffect', isCorrect: true },
      { content: 'useContext', isCorrect: false },
      { content: 'useReducer', isCorrect: false }
    ],
    analysis: 'useEffect钩子函数可以在组件挂载后、更新后执行副作用操作，通过设置空依赖数组[]可以仅在挂载时执行一次。<br><br>选项A错误：useState用于管理组件状态<br>选项C错误：useContext用于获取上下文数据<br>选项D错误：useReducer用于复杂状态管理',
    knowledgePoint: 'React Hooks、组件生命周期',
    difficulty: '中等',
    lastResult: null,
  },
  {
    id: 3,
    category: '1.2 事件的概率',
    content: 'TypeScript中，下列哪种类型表示可以为null或undefined的值？',
    choices: [
      { content: 'any', isCorrect: false },
      { content: 'void', isCorrect: false },
      { content: 'never', isCorrect: false },
      { content: 'null', isCorrect: true }
    ],
    analysis: '本题四个选项中没有正确答案。TypeScript中表示可以为null或undefined的类型需要使用联合类型，如`string | null | undefined`。<br><br>选项A：any表示任意类型，会关闭类型检查<br>选项B：void表示没有返回值<br>选项C：never表示永远不会发生的值<br>选项D：unknown表示未知类型，需要类型断言才能使用',
    knowledgePoint: 'TypeScript基础类型、联合类型',
    difficulty: '困难',
    lastResult: null,
  }
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
  '1.1': toRaw(chapter1Section1Questions.value),
  '1.2': toRaw(chapter1Section2Questions.value),
  '1.3': toRaw(chapter1Section3Questions.value),
  '1.4': toRaw(chapter1Section4Questions.value),
  '2.1': toRaw(chapter2Section1Questions.value),
  '2.2': toRaw(chapter2Section2Questions.value),
  '2.3': toRaw(chapter2Section3Questions.value),
  '2.4': toRaw(chapter2Section4Questions.value),
  '3.1': toRaw(chapter3Section1Questions.value),
  '3.2': toRaw(chapter3Section2Questions.value),
  '3.3': toRaw(chapter3Section3Questions.value),
  '3.4': toRaw(chapter3Section4Questions.value),
  '3.5': toRaw(chapter3Section5Questions.value),
  '4.1': toRaw(chapter4Section1Questions.value),
  '4.2': toRaw(chapter4Section2Questions.value),
  '4.3': toRaw(chapter4Section3Questions.value),
  '4.4': toRaw(chapter4Section4Questions.value),
  '4.5': toRaw(chapter4Section5Questions.value),
  '5.1': toRaw(chapter5Section1Questions.value),
  '5.2': toRaw(chapter5Section2Questions.value),
  '5.3': toRaw(chapter5Section3Questions.value),
  '6.1': toRaw(chapter6Section1Questions.value),
  '6.2': toRaw(chapter6Section2Questions.value),
  '6.3': toRaw(chapter6Section3Questions.value),
  '6.4': toRaw(chapter6Section4Questions.value),
  '7.1': toRaw(chapter7Section1Questions.value),
  '7.2': toRaw(chapter7Section2Questions.value),
  '7.3': toRaw(chapter7Section3Questions.value),
  '7.4': toRaw(chapter7Section4Questions.value),
  '7.5': toRaw(chapter7Section5Questions.value),
  '7.6': toRaw(chapter7Section6Questions.value),
  '7.7': toRaw(chapter7Section7Questions.value),
  '7.8': toRaw(chapter7Section8Questions.value),
  '8.1': toRaw(chapter8Section1Questions.value),
  '8.2': toRaw(chapter8Section2Questions.value),
  '8.3': toRaw(chapter8Section3Questions.value),
  '8.4': toRaw(chapter8Section4Questions.value),
  '8.5': toRaw(chapter8Section5Questions.value),
  '8.6': toRaw(chapter8Section6Questions.value),
  '8.7': toRaw(chapter8Section7Questions.value),
  '9.1': toRaw(chapter9Section1Questions.value),
  '9.2': toRaw(chapter9Section2Questions.value),
  '9.3': toRaw(chapter9Section3Questions.value),
  '9.4': toRaw(chapter9Section4Questions.value),
  '9.5': toRaw(chapter9Section5Questions.value),
  '9.6': toRaw(chapter9Section6Questions.value),
});