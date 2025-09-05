<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';

interface SubjectCard { key: string; title: string; desc: string; route: string }

const router = useRouter();

const subjects: SubjectCard[] = [
  { key: 'calculusA', title: '高等数学上', desc: '高等数学上册，占位页面，结构与概率主页类似。', route: '/subject/calculusA' },
  { key: 'linearAlgebra', title: '线性代数', desc: '线性代数，占位页面。', route: '/subject/linearAlgebra' },
  { key: 'calculusB', title: '高等数学下', desc: '高等数学下册，占位页面。', route: '/subject/calculusB' },
  { key: 'probability', title: '概率论', desc: '进入邮趣概率主页。', route: '/dashboard' },
  { key: 'numberTheory', title: '数论', desc: '数论，占位页面。', route: '/subject/numberTheory' },
  { key: 'bayes', title: '统计决策与贝叶斯分析', desc: '统计决策与贝叶斯分析，占位页面。', route: '/subject/bayes' },
];
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center overflow-y-auto p-8 gap-10">
    <h1 class="text-4xl font-extrabold tracking-wide">
      邮趣数学
    </h1>
    <div class="grid gap-6 w-full max-w-6xl md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      <div
        v-for="s in subjects" :key="s.key"
        class="border rounded-xl p-5 hover:shadow-lg transition-all flex flex-col justify-between bg-background/80 backdrop-blur"
      >
        <div>
          <div class="text-xl font-semibold mb-2">
            {{ s.title }}
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {{ s.desc }}
          </p>
        </div>
        <Button class="mt-6" @click="router.push(s.route)">
          进入
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
