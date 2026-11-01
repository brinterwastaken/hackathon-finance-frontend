<script setup lang="ts">
import { LoaderCircle } from "@lucide/vue";
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center flex-col gap-2">
    <LoaderCircle :size="48" class="animate-spin text-cyan-400" />
    <h1 class="text-2xl mt-4">Loading...</h1>
    <p class="font-mono opacity-85">Connecting to backend</p>
  </div>
</template>
