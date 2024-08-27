<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { toMarkDown } from '@/utils/markdown';

const items = ref([
    { route: '/dashboard/experiment/geometric1', label: '直到第一次成功', icon: 'pi pi-chart-line' },
    { route: '/dashboard/experiment/geometric2', label: '第一次成功前', icon: 'pi pi-chart-line' },
    { route: '/dashboard/experiment/geometric3', label: '几何分布的无记忆性', icon: 'pi pi-chart-line' },
]);

const router = useRouter();
onMounted(() => {
    // 页面加载时自动导航到第一个标签的路由
    router.push(items.value[0].route);
});

const content = `
**几何分布（Geometric Distribution）** 是统计学中的一种离散概率分布，用于描述在一系列独立的伯努利试验中，第一次成功发生之前的失败次数。几何分布可以用来表示成功之前进行的失败次数，或直到第一次成功所需的试验次数。

#### 几何分布的定义

对于几何分布，有两种常见的定义：

- **第一次成功前的失败次数（$$ X $$）**：
  其概率质量函数（PMF）定义为：
  $$
  P(X = k) = (1-p)^k p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是失败的次数（$$ k $$ 为非负整数）。

- **直到第一次成功所需的试验次数（$$ Y $$）**：
  其概率质量函数（PMF）定义为：
  $$
  P(Y = k) = (1-p)^{k-1} p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是试验次数（$$ k $$ 为正整数）。

#### 期望值和方差

- 对于失败次数（$$ X $$）：
  - 期望值：$$ E(X) = \\frac{1-p}{p} $$
  - 方差：$$ \\text{Var}(X) = \\frac{1-p}{p^2} $$

- 对于试验次数（$$ Y $$）：
  - 期望值：$$ E(Y) = \\frac{1}{p} $$
  - 方差：$$ \\text{Var}(Y) = \\frac{1-p}{p^2} $$


#### 特点
1. **无记忆性**：几何分布具有无记忆性，即过去的试验结果不会影响未来的成功概率。数学上表示为：
   $$
   P(X > m + n \\mid X > n) = P(X > m)
   $$
   其中 $$ X $$ 是第一次成功前的失败次数。
   
2. **离散分布**：几何分布是一种定义在非负整数上的离散概率分布。
`
</script>

<template>
    <Splitter class="mb-8 h-full !border-0">
        <SplitterPanel class="pr-1.5">
            <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full overflow-auto">
                <div class="card">
                    <Tabs value="/dashboard/experiment/geometric1">
                        <TabList>
                            <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
                                <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                                    <a v-ripple :href="href" @click="navigate"
                                        class="flex items-center gap-2 text-inherit">
                                        <i :class="tab.icon" />
                                        <span>{{ tab.label }}</span>
                                    </a>
                                </router-link>
                            </Tab>
                        </TabList>
                    </Tabs>
                </div>
                <router-view></router-view>
            </div>
        </SplitterPanel>
        <SplitterPanel class="pr-3 pl-1.5" :size="25">
            <Panel header="提示区" class="h-full overflow-auto">
                <div v-html="toMarkDown(content)" class="markdown-format"></div>
            </Panel>
        </SplitterPanel>
    </Splitter>
</template>

<style scoped></style>
