<script setup lang="ts">
import NumberInput from "./NumberInput.vue";

defineProps<{
  id: string;
  label: string;
  modelValue: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();
</script>

<template>
  <NumberInput
    :id="id"
    :label="label"
    :model-value="modelValue"
    suffix="INR / month"
    :step="10"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
