<script setup lang="ts">
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toMarkdown } from '@/utils/markdown';
import { conclusionContent } from './content';

import diameterMidpointGif from '/public/Bertrand/diameter_midpoint.gif';
import randomEndpointGif from '/public/Bertrand/random_endpoint.gif';
import randomMidpointGif from '/public/Bertrand/random_midpoint.gif';

// 定义方法名称的联合类型
type MethodName = 'randomEndpoint' | 'randomMidpoint' | 'diameterMidpoint';

// 定义方法数据结构类型
interface MethodData {
  name: string;
  image: string;
  description: string;
}

// 当前展示的方法
const currentMethod = ref<MethodName>('randomEndpoint');

// 定义不同方法的数据，添加明确的类型定义
const methodsData: Record<MethodName, MethodData> = {
  randomEndpoint: {
    name: '随机端点法',
    image: randomEndpointGif,
    description: '随机端点法指固定弦的一个端点，另一个端点在圆周上随机选取，即 $$P(A) = \\frac{\\frac{1}{3}弧长}{周长} = \\frac{1}{3}$$。',
  },
  randomMidpoint: {
    name: '随机中点法',
    image: randomMidpointGif,
    description: '随机中点法指弦的中点在单位圆内随机选取，即 $$P(A) = \\frac{小圆面积}{大圆面积} = \\frac{1}{4}$$',
  },
  diameterMidpoint: {
    name: '随机半径法',
    image: diameterMidpointGif,
    description: '随机半径法指任选一直径，垂直于该直径的弦的中点在该直径上随机选取，即 <br><br> $P(A) = \\frac{\\frac{1}{2}直径}{直径} = \\frac{1}{2}$。',
  },
};

// 切换方法的函数
function toggleMethod(methodName: MethodName) {
  currentMethod.value = methodName;
}
</script>

<template>
  <ExperimentBoard :show-parameter-panel="false">
    <template #experiment>
      <!-- 修改flex容器的样式，确保左右两部分高度一致 -->
      <div class="flex flex-col md:flex-row gap-4 p-4" style="height: 100%;">
        <!-- 左侧：方法详解 - 调整宽度并确保内容上下居中 -->
        <Card class="md:w-1/4 h-full flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>方法详解</CardTitle>
            <!-- 下拉按钮 -->
            <div class="dropdown">
              <Button tabindex="0" role="button" class="m-1">
                点我切换
              </Button>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li @click="toggleMethod('randomEndpoint')">
                  <a>随机端点法</a>
                </li>
                <li @click="toggleMethod('randomMidpoint')">
                  <a>随机中点法</a>
                </li>
                <li @click="toggleMethod('diameterMidpoint')">
                  <a>随机半径法</a>
                </li>
              </ul>
            </div>
          </CardHeader>
          <!-- 修改CardContent，确保内容上下居中 -->
          <CardContent class="flex flex-1 flex-col items-center justify-center">
            <!-- 显示实验详细内容 -->
            <img v-if="currentMethod === 'randomEndpoint'" :src="randomEndpointGif" alt="随机端点法动图" style="width: 80%;">
            <img v-if="currentMethod === 'randomMidpoint'" :src="randomMidpointGif" alt="随机中点法动图" style="width: 80%;">
            <img v-if="currentMethod === 'diameterMidpoint'" :src="diameterMidpointGif" alt="随机半径法动图" style="width: 80%;">
            <div class="prose text-sm font-medium mt-4 text-center" v-html="toMarkdown(methodsData[currentMethod].description)" />
          </CardContent>
        </Card>

        <!-- 右侧：完整嵌入的HTML文件 - 调整宽度 -->
        <div class="md:w-3/4 flex flex-col">
          <iframe
            src="/chapter1/bertrand.html"
            width="100%"
            height="100%"
            frameborder="0"
            style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex: 1;"
          />
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="bertrand" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 保持原有的样式并添加一些调整 */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  display: none;
}

.dropdown:focus-within .dropdown-content {
  display: block;
}

.menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 0;
}

.menu a {
  display: block;
  padding: 8px 16px;
  text-decoration: none;
  color: inherit;
}

.menu a:hover {
  background-color: #f0f0f0;
}

/* 确保ExperimentBoard占满父容器 */
:deep(.experiment-board-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
