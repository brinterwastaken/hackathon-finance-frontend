<script setup lang="ts">
const props = defineProps<{
  percentage: number;
}>();
</script>

<template>
  <div class="w-full h-2.5 bg-gray-800 rounded-xl overflow-clip">
    <div class="h-2.5 bg-cyan-400 rounded-xl" :style="`width: ${percentage}%`"></div>
  </div>
</template>
