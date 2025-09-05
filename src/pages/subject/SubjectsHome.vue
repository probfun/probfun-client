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
  <div class="main-bg w-screen h-screen flex flex-col items-center overflow-y-auto p-8 gap-10">
    <div class="flex items-center gap-4 mt-2 mb-2">
      <img src="/logo-math.svg" alt="邮趣数学Logo" class="logo-math">
      <h1 class="text-4xl font-extrabold tracking-wide drop-shadow-lg logo-title">
        邮趣数学
      </h1>
    </div>
    <div class="grid gap-6 w-full max-w-6xl md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      <div
        v-for="s in subjects" :key="s.key"
        class="subject-card border rounded-2xl p-6 flex flex-col justify-between shadow-md bg-white/80 hover:bg-white/90 hover:shadow-2xl transition-all backdrop-blur-lg"
      >
        <div>
          <div class="text-xl font-semibold mb-2 text-primary">
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

.logo-math {
  width: 56px;
  height: 56px;
  display: block;
  filter: drop-shadow(0 2px 8px #b4befe44);
}
.logo-title {
  color: #3730a3;
  letter-spacing: 0.08em;
}
<style scoped>
.main-bg {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  min-height: 100vh;
}
.subject-card {
  /* 让卡片更突出 */
  box-shadow: 0 4px 24px 0 rgba(80, 120, 200, 0.08), 0 1.5px 6px 0 rgba(80, 120, 200, 0.06);
  border: 1.5px solid #e0e7ff;
  /* 半透明白底+毛玻璃 */
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  transition: box-shadow 0.2s, background 0.2s;
}
.subject-card:hover {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 8px 32px 0 rgba(80, 120, 200, 0.16), 0 3px 12px 0 rgba(80, 120, 200, 0.10);
  border-color: #b4befe;
}
</style>
