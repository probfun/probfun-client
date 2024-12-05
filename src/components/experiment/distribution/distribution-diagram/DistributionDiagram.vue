<script setup lang="ts">
import type {
  BinomialDistributionArgs,
  DistributionArgs,
  ExponentialDistributionArgs,
  GeometricDistributionArgs,
  NormalDistributionArgs,
  PoissonDistributionArgs,
  UniformDistributionArgs,
} from '@/api/ai/aiType';
import BinomialDiagram from '@/components/experiment/distribution/BinomialDiagram.vue';
import ExponentialDiagram from '@/components/experiment/distribution/ExponentialDiagram.vue';
import GeometricDiagram from '@/components/experiment/distribution/geometric-distribution/GeometricDiagram.vue';
import NormalDiagram from '@/components/experiment/distribution/normal-distribution/NormalDiagram.vue';
import PoissonDiagram from '@/components/experiment/distribution/poisson-distribution/PoissonDiagram.vue';
import UniformDiagram from '@/components/experiment/distribution/UniformDiagram.vue';

const { args: args_ } = defineProps<{
  args: DistributionArgs
}>();
const { type, args } = args_;
</script>

<template>
  <NormalDiagram
    v-if="type === 'normal'"
    :mean="(args as NormalDistributionArgs).mean"
    :std-dev="(args as NormalDistributionArgs).stdDev"
  />
  <GeometricDiagram
    v-else-if="type === 'geometric'"
    :p="(args as GeometricDistributionArgs).p"
    :n="0"
    :is-chart1="true" :is-chart2="false" :is-chart3="false" :save="false"
  />
  <PoissonDiagram
    v-else-if="type === 'poisson'"
    :lambda="(args as PoissonDistributionArgs).lambda"
    :save="false"
  />
  <BinomialDiagram
    v-else-if="type === 'binomial'"
    :n="(args as BinomialDistributionArgs).n"
    :p="(args as BinomialDistributionArgs).p"
    :save="false"
  />
  <ExponentialDiagram
    v-else-if="type === 'exponential'"
    :rate="(args as ExponentialDistributionArgs).rate"
    :shift="0"
    :show-graph="true"
    :show-history="false"
  />
  <UniformDiagram
    v-else-if="type === 'uniform'"
    :a="(args as UniformDistributionArgs).a"
    :b="(args as UniformDistributionArgs).b"
    :k="0"
    :m="0"
    :show-history="false"
  />
</template>

<style scoped></style>
