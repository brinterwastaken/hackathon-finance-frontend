<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: number | null;
    suffix?: string;
    step?: number;
  }>(),
  {
    suffix: "",
    step: 1,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

function updateValue(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  emit("update:modelValue", input.value === "" ? null : input.valueAsNumber);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-sm font-medium text-gray-200">{{ label }}</label>
    <div class="flex items-center rounded-xl border border-gray-600/70 bg-gray-950 px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20">
      <input
        :id="id"
        :value="modelValue ?? ''"
        type="number"
        min="0"
        :step="step"
        inputmode="decimal"
        placeholder="0"
        class="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-white outline-none placeholder:text-gray-600"
        @input="updateValue"
      />
      <span v-if="suffix" class="select-none whitespace-nowrap text-xs text-gray-500">{{ suffix }}</span>
    </div>
  </div>
</template>
