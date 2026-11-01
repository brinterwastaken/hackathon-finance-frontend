<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";

defineProps<{
  id: string;
  label: string;
  modelValue: string | null;
  options: readonly { value: string; label: string }[];
  placeholder: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

function updateValue(event: Event) {
  const select = event.currentTarget as HTMLSelectElement;
  emit("update:modelValue", select.value || null);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-sm font-medium text-gray-200">
      {{ label }}
    </label>
    <div
      class="relative rounded-xl border border-gray-600/70 bg-gray-950 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
    >
      <select
        :id="id"
        :value="modelValue ?? ''"
        class="w-full cursor-pointer appearance-none rounded-xl bg-transparent px-4 py-3 pr-10 text-base text-white outline-none"
        @change="updateValue"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        aria-hidden="true"
        :size="18"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  </div>
</template>
