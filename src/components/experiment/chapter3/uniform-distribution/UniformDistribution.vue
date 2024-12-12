<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import UniformDiagram from './UniformDiagram.vue';
import { ref } from 'vue';

const x1 = ref(0);
const x2 = ref(1);
const y1 = ref(0);
const y2 = ref(1);
</script>

<template>
    <ExperimentBoard>
        <template #experiment>
            <UniformDiagram :x1="x1" :x2="x2" :y1="y1" :y2="y2"></UniformDiagram>
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