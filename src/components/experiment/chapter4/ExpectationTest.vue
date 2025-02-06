<script setup lang="ts">
import ExperimentBoard from '../ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { ref } from 'vue';
import { toMarkdown } from '@/utils/markdown';
</script>

<template>
    <ExperimentBoard>
        <template #experiment>

        </template>
        <template #parameter>
            <div class="w-full h-full p-3">
                <Card class="h-3/5 h- w-full mb-1 card overflow-y-auto">
                    <CardHeader>
                        <CardTitle>模拟曲线</CardTitle>
                    </CardHeader>
                    <CardContent class="flex flex-col justify-center items-center gap-3">
                        <div class="formula"></div>
                        <div class="table"></div>
                    </CardContent>
                </Card>
                <Card class="h-2/5 w-full cardflex-1 flex flex-col overflow-y-auto">
                    <CardHeader>
                        <CardTitle>参数调整</CardTitle>
                    </CardHeader>

                    
                </Card>
            </div>
        </template>
        <template #conclusion>
         
        </template>
        <template #comment>
            <CommentPanel exp-id="centralLimitTheorem" />
        </template>
    </ExperimentBoard>
</template>