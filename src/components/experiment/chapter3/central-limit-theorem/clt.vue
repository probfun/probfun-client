<script setup lang="ts">
import ExperimentBoard from '../../ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { ref } from 'vue';

const n = ref(1); //钉子行数
const ball = ref(10); //球的数量

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
                    <CardContent class=" flex flex-col justify-center items-center gap-3">
                        <div class="grid grid-cols-2 gap-10">
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-1">
                                    <Label>钉子行数</Label>
                                    <div class="max-w-xl space-y-3">
                                        <InputNumber v-model="n" fluid />
                                        <Slider v-model="n" :min="5" :max="20" :step="1" class="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-1">
                                    <Label>球的数量</Label>
                                    <div class="max-w-xl space-y-3">
                                        <InputNumber v-model="ball" fluid />
                                        <Slider v-model="ball" :min="5" :max="100" :step="5" class="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
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