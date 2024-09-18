<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import Toast from 'primevue/toast';
</script>

<template>
  <div v-auto-animate class="h-full w-full">
    <router-view />
    <Toast />
  </div>
</template>
