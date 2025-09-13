<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const contributors = ref([
  '杨羽婕',
  '胡成诚',
  '李诗予',
  '吴林涛',
  '时珂熠',
  '梁天星',
  '赵哲昀',
  '荣梓铭',
  '钟悠豪',
  '董雪瑞',
  '董一航',
  '高杰',
  '崔博炜',
  '魏宇辰',
  '王言舟',
]);

const teamShort = '邮趣数学';
</script>

<template>
  <div class="p-4 space-y-4 overflow-y-auto">
    <Card>
      <CardHeader>
        <CardTitle>贡献者列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Label v-for="(name, idx) in contributors" :key="idx" class="px-2 py-1 rounded-md bg-muted">
            {{ name }}
          </Label>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>欢迎加入 {{ teamShort }} 开发者团队</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <p class="leading-relaxed text-sm text-muted-foreground">
          邮趣数学是一个基于 Web 的交互式概率论实验可视化平台。平台融合思维导图、互动游戏与可视化仿真等多元方式，将抽象的大学数学图像与公式直观呈现，带来丰富的操作体验。创新集成 AI 智能问答，支持多轮推理与图文并茂的解答，助力用户深入理解实验问题。平台还设有评论区与班级公告，促进师生高效互动。通过数据分析，用户可实时掌握个人点击、浏览等学习数据，精准优化学习路径，全面提升学习效率。
        </p>
        <p class="leading-relaxed text-sm text-muted-foreground">
          我们秉承“北邮人建设北邮”的理念，致力于以北邮人的专业精神与协作文化，持续完善课程资源、开放工具链与教学场景，推动更高效、更有趣、更普惠的学习体验。
        </p>
        <p class="leading-relaxed text-sm text-muted-foreground">
          展望未来，邮趣数学将继续深耕智能教育与数学可视化领域，积极探索跨学科融合与创新应用，助力更多学习者在数字时代实现自我成长与价值创造。
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>联系方式</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div>
            <Label class="font-semibold mr-2">QQ群</Label>
            <span>111293253</span>
          </div>
          <Separator />
          <p class="text-xs text-muted-foreground">
            进群请改昵称为姓名和学号/教工号（便于管理与协作）。
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>
