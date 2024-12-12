<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import NormalDiagram from './NormalDiagram.vue';

import { ref } from 'vue';

const mean1 = ref(1);
const mean2 = ref(1);
const sigma1 = ref(0.1);
const sigma2 = ref(0.1);
const density = ref(0.5);
</script>

<template>
    <ExperimentBoard>
        <template #experiment>
            <NormalDiagram :mean1="mean1" :mean2="mean2" :sigma1="sigma1" :sigma2="sigma2" :density="density">
            </NormalDiagram>
        </template>
        <template #parameter>

        </template>
        <template #conclusion>

        </template>
        <template #comment>
            <CommentPanel exp-id="2DuniformDistribution" />
        </template>
    </ExperimentBoard>
</template>