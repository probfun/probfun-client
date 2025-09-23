<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mathematicians } from '@/data/mathematicians';

const router = useRouter();

function openDetail(name: string) {
  router.push({ path: `/dashboard/mathematicians/${encodeURIComponent(name)}` });
}
</script>

<template>
  <div class="p-3 flex flex-col gap-4">
    <div class="mb-1">
      <h1 class="text-xl font-bold">
        数学家
      </h1>
      <p class="text-sm text-muted-foreground">
        收录了 20 位与概率与统计发展密切相关的数学家。
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Card
        v-for="m in mathematicians"
        :key="m.name"
        class="h-full flex flex-col cursor-pointer transition-all hover:shadow-md hover:border-primary"
        @click="openDetail(m.name)"
      >
        <CardHeader class="p-4 pb-2">
          <CardTitle class="text-base">
            {{ m.name }}<span v-if="m.enName" class="ml-1 text-xs text-muted-foreground">({{ m.enName }})</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="px-4 pb-4 pt-0 space-y-3">
          <!-- 预留图片区域：左侧约 1/3 比例的占位，后续可放置头像/图片 -->
          <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40 flex">
            <div class="w-1/3 bg-muted/30 border-r border-primary/20 flex items-center justify-center text-xs text-muted-foreground">
              待补图
            </div>
            <div class="flex-1 p-3 text-sm text-muted-foreground">
              <div class="font-medium mb-1">
                {{ m.field }}
              </div>
              <Label class="line-clamp-2 leading-relaxed font-normal">{{ m.story }}</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
