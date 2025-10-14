<script setup lang="ts">
import type {
  BinomialDistributionArgs,
  DistributionArgs,
  ExponentialDistributionArgs,
  GeometricDistributionArgs,
  NormalDistributionArgs,
  PoissonDistributionArgs,
  TwoDNormalDistributionArgs,
  TwoDUniformDistributionArgs,
  UniformDistributionArgs,
} from '@/api/ai/aiType.ts';
import ThreeNormalDiagram from '@/components/experiment/chapter3/normal-distribution/threeNormalDiagram.vue';
import ThreeUniformDiagram from '@/components/experiment/chapter3/uniform-distribution/threeUniformDiagram.vue';
import BinomialDiagram from '@/components/experiment/distribution/BinomialDiagram.vue';
import ExponentialDiagram from '@/components/experiment/distribution/ExponentialDiagram.vue';
import GeometricDiagram from '@/components/experiment/distribution/geometric-distribution/GeometricDiagram.vue';
import NormalDiagram from '@/components/experiment/distribution/normal-distribution/NormalDiagram.vue';
import PoissonDiagram from '@/components/experiment/distribution/poisson-distribution/PoissonDiagram.vue';
import UniformDiagram from '@/components/experiment/distribution/UniformDiagram.vue';

const { args: args_ } = defineProps<{
  args: DistributionArgs;
}>();
const { type, args } = args_;
</script>

<template>
  <NormalDiagram
    v-if="type === 'normal'"
    class="!h-96"
    :mean="(args as NormalDistributionArgs).mean"
    :std-dev="(args as NormalDistributionArgs).stdDev"
  />
  <GeometricDiagram
    v-else-if="type === 'geometric'"
    class="!h-96"
    :p="(args as GeometricDistributionArgs).p"
    :n="0"
    :is-chart1="true" :is-chart2="false" :is-chart3="false" :save="false"
  />
  <PoissonDiagram
    v-else-if="type === 'poisson'"
    class="!h-96"
    :lambda="(args as PoissonDistributionArgs).lambda"
    :save="false"
  />
  <BinomialDiagram
    v-else-if="type === 'binomial'"
    class="!h-96"
    :n="(args as BinomialDistributionArgs).n"
    :p="(args as BinomialDistributionArgs).p"
    :save="false"
  />
  <ExponentialDiagram
    v-else-if="type === 'exponential'"
    class="!h-96"
    :rate="(args as ExponentialDistributionArgs).rate"
    :shift="0"
    :show-graph="true"
    :show-history="false"
  />
  <UniformDiagram
    v-else-if="type === 'uniform'"
    class="!h-96"
    :a="(args as UniformDistributionArgs).a"
    :b="(args as UniformDistributionArgs).b"
    :k="1"
    :m="0"
    :show-history="false"
  />
  <ThreeUniformDiagram
    v-else-if="type === '2d-uniform'"
    class="!h-96"
    :x1="(args as TwoDUniformDistributionArgs).x1"
    :x2="(args as TwoDUniformDistributionArgs).x2"
    :y1="(args as TwoDUniformDistributionArgs).y1"
    :y2="(args as TwoDUniformDistributionArgs).y2"
  />
  <ThreeNormalDiagram
    v-else-if="type === '2d-normal'"
    :mean1="(args as TwoDNormalDistributionArgs).mean1"
    :mean2="(args as TwoDNormalDistributionArgs).mean2"
    :sigma1="(args as TwoDNormalDistributionArgs).stdDev1"
    :sigma2="(args as TwoDNormalDistributionArgs).stdDev2"
    :density="(args as TwoDNormalDistributionArgs).density"
    :is-chart3="(args as TwoDNormalDistributionArgs).isChart3"
    :fixed-x="(args as TwoDNormalDistributionArgs).fixedX"
    :fixed-y="(args as TwoDNormalDistributionArgs).fixedY"
  />
</template>
