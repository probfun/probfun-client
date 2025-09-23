<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mathematicians } from '@/data/mathematicians';

const route = useRoute();
const nameParam = computed(() => decodeURIComponent((route.params.name as string) || ''));
const mathematician = computed(() => mathematicians.find(m => m.name === nameParam.value));
</script>

<template>
  <div class="p-3">
    <Card class="max-w-4xl mx-auto">
      <CardHeader class="p-6 pb-2">
        <CardTitle class="text-xl">
          <template v-if="mathematician">
            {{ mathematician.name }}<span v-if="mathematician.enName" class="ml-2 text-base text-muted-foreground">({{ mathematician.enName }})</span>
          </template>
          <template v-else>
            数学家
          </template>
        </CardTitle>
      </CardHeader>
      <CardContent class="p-6 pt-0">
        <template v-if="mathematician">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- 左侧预留图片区域（约 1/3 宽度） -->
            <div class="md:w-1/3 w-full aspect-[3/4] rounded-md border border-primary/40 bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
              待补图
            </div>
            <!-- 右侧基础信息与简介 -->
            <div class="flex-1 space-y-2 text-sm text-muted-foreground">
              <div>
                <span class="font-medium">生卒：</span>{{ mathematician.lifespan }}
              </div>
              <div>
                <span class="font-medium">国家：</span>{{ mathematician.country }}
              </div>
              <div>
                <span class="font-medium">领域：</span>{{ mathematician.field }}
              </div>
              <div class="mt-2">
                <Label class="leading-relaxed whitespace-pre-line">{{ mathematician.story }}</Label>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-muted-foreground">
            未找到对应的数学家信息。
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
