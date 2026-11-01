<script setup lang="ts">
import { ArrowLeft, ArrowRight } from "@lucide/vue";
import { computed, ref } from "vue";
import { Doughnut } from "vue-chartjs";
import "chart.js/auto";

import type { FinancialAssessmentResponse } from "../types";
import PercentBar from "./PercentBar.vue";

const props = defineProps<{
  responseData: FinancialAssessmentResponse;
}>();

const chartData = ref<{ datasets: any }>({ datasets: [] });

chartData.value = {
  datasets: [
    {
      data: [
        props.responseData.credit_assessment.credit_score,
        100 - props.responseData.credit_assessment.credit_score,
      ],
      backgroundColor: ["#00d3f3", "#1e2939"],
      cutout: "70%",
      borderWidth: 0,
      borderRadius: 5,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  rotation: -100,
  circumference: 200,
  animation: {
    animateRotate: true,
    duration: 400,
    delay: 500,
  },
};

const creditScore = computed(() => {
  return Math.round(
    300 +
      600 *
        Math.pow(props.responseData.credit_assessment.credit_score / 100, 0.7),
  );
});

const financialMetrics = computed(() => props.responseData.financial_metrics);

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
</script>

<template>
  <section class="mainCard mt-8">
    <h1 class="font-alt text-3xl font-medium tracking-tight sm:text-4xl mb-8">
      Your credit score estimate
    </h1>

    <!-- First section -->
    <div class="flex md:flex-row flex-col">
      <div class="flex flex-col items-center md:w-1/2 relative gap-4">
        <h1 class="font-medium text-lg">Credit Score</h1>
        <div class="h-40 w-full">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center pt-28">
            <div class="md:text-5xl text-4xl font-medium font-mono">
              {{ creditScore }}
            </div>
            <div class="text-sm text-gray-400">
              Range: 300 <ArrowRight class="inline" :size="12" /> 900
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center md:w-1/2 gap-1 px-6">
        <h1 class="font-medium text-lg">Credit Assessment</h1>
        <h2 class="mt-4">
          Loan Repayment Probability:
          <span class="text-bold font-mono"
            >{{
              props.responseData.credit_assessment.loan_repayment_probability
            }}%</span
          >
        </h2>
        <PercentBar
          :percentage="
            props.responseData.credit_assessment.loan_repayment_probability
          "
        />
        <h2 class="mt-2">
          Risk Level:
          <span class="text-bold font-mono"
            >{{ props.responseData.credit_assessment.risk_level }}%</span
          >
        </h2>
        <PercentBar
          :percentage="props.responseData.credit_assessment.risk_level"
        />
        <h2 class="mt-2">
          Resilience Score:
          <span class="text-bold font-mono"
            >{{ props.responseData.financial_metrics.resilience_score }}</span
          >
        </h2>
        <PercentBar
          :percentage="props.responseData.financial_metrics.resilience_score"
        />
      </div>
    </div>

    <!-- Second section -->
    <section class="mt-10 border-t border-gray-700/70 pt-8">
      <h2 class="mb-5 font-alt text-2xl font-medium">Financial insights</h2>
      <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
        <div class="rounded-2xl border border-gray-700/70 bg-gray-950/70 p-4">
          <dt class="text-sm text-gray-400">Emergency fund coverage</dt>
          <dd class="mt-2 text-xl font-medium">
            {{ Math.max(financialMetrics.emergency_fund_months, 0) }} months
          </dd>
        </div>
        <div class="rounded-2xl border border-gray-700/70 bg-gray-950/70 p-4">
          <dt class="text-sm text-gray-400">Projected savings in 6 months</dt>
          <dd class="mt-2 text-xl font-medium">
            {{ formatCurrency(financialMetrics.future_savings_6_months) }}
          </dd>
        </div>
        <div class="rounded-2xl border border-gray-700/70 bg-gray-950/70 p-4">
          <dt class="text-sm text-gray-400">Estimated monthly savings</dt>
          <dd class="mt-2 text-xl font-medium">
            {{ formatCurrency(financialMetrics.monthly_savings) }}
          </dd>
        </div>
        <div class="rounded-2xl border border-gray-700/70 bg-gray-950/70 p-4">
          <dt class="text-sm text-gray-400">Total monthly expenses</dt>
          <dd class="mt-2 text-xl font-medium">
            {{ formatCurrency(financialMetrics.total_expenses) }}
          </dd>
        </div>
      </dl>

      <div class="mt-8">
        <h2 class="mb-3 font-alt text-xl font-medium">Recommendations</h2>
        <ul
          v-if="props.responseData.recommendations.length"
          class="flex flex-col gap-3"
        >
          <li
            v-for="(recommendation, index) in props.responseData
              .recommendations"
            :key="`${index}-${recommendation}`"
            class="rounded-xl border border-gray-700/70 bg-gray-950/70 px-4 py-3 text-gray-200"
          >
            {{ recommendation }}
          </li>
        </ul>
        <p v-else class="text-sm text-gray-400">
          No recommendations are available right now.
        </p>
      </div>
    </section>

    <div class="flex justify-between mt-auto pt-8">
      <button class="navButton" type="button" @click="$emit('exit')">
        <ArrowLeft :size="18" /> Estimate another score
      </button>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";
</style>
