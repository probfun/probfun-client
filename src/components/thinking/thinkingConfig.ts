import { ref } from 'vue';

interface ThinkingItem {
  title: string;
  description: string[];
}

const weeklyThoughts = ref<ThinkingItem[]>([
  {
    title: '第1周 每周一思',
    description: [
      '1）柯尔莫哥洛夫的公理化体系将概率定义为满足非负性、规范性和可列可加性的测度，现实中的不确定性是否都可以用这一框架描述？',
      '2）概率是客观存在还是主观建构？',
    ],
  },
]);

export { weeklyThoughts };
