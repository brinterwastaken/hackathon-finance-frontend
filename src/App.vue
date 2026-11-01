<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import ExpenseInput from "./components/ExpenseInput.vue";
import NumberInput from "./components/NumberInput.vue";
import SelectInput from "./components/SelectInput.vue";
import { ArrowLeft, ArrowRight, LoaderCircle } from "@lucide/vue";
import Results from "./components/Results.vue";
import type { FinancialAssessmentResponse } from "./types.ts";
import ErrorPopup from "./components/ErrorPopup.vue";

const apiUrl = import.meta.env.VITE_API_URL;

const connected = ref(false);
const error = ref(false);

const currentSection = ref(0);

const expenseGroups = [
  {
    name: "Primary expenses",
    categories: [
      { id: "rent", label: "Rent" },
      { id: "groceries", label: "Groceries" },
      { id: "utilities", label: "Utilities" },
      { id: "loan", label: "Loan payments" },
    ],
  },
  {
    name: "Personal essentials",
    categories: [
      { id: "insurance", label: "Insurance" },
      { id: "healthcare", label: "Healthcare" },
      { id: "education", label: "Education" },
      { id: "transport", label: "Transport" },
    ],
  },
  {
    name: "Other expenses",
    categories: [
      { id: "eating_out", label: "Eating out" },
      { id: "miscellaneous", label: "Misc" },
      { id: "entertainment", label: "Entertainment" },
    ],
  },
] as const;

type ExpenseCategory =
  (typeof expenseGroups)[number]["categories"][number]["id"];

const expenses = reactive<Record<ExpenseCategory, number | null>>({
  rent: null,
  loan: null,
  insurance: null,
  groceries: null,
  transport: null,
  eating_out: null,
  entertainment: null,
  utilities: null,
  healthcare: null,
  education: null,
  miscellaneous: null,
});

const userInfoSections = [
  {
    name: "Income & occupation",
    fields: [
      { id: "income", label: "Income", suffix: "INR / month", step: 1000 },
    ],
  },
  {
    name: "Personal details",
    fields: [
      { id: "age", label: "Age", suffix: "years", step: 1 },
      { id: "dependents", label: "Dependents", suffix: "people", step: 1 },
    ],
  },
] as const;

type UserInfoField = (typeof userInfoSections)[number]["fields"][number]["id"];

const userInfo = reactive<Record<UserInfoField, number | null>>({
  income: null,
  age: null,
  dependents: null,
});

const occupationOptions = [
  { value: "Professional", label: "Professional" },
  { value: "Self_Employed", label: "Self-Employed" },
  { value: "Retired", label: "Retired" },
  { value: "Student", label: "Student" },
] as const;

const cityTierOptions = [
  { value: "Tier_1", label: "Tier 1" },
  { value: "Tier_2", label: "Tier 2" },
  { value: "Tier_3", label: "Tier 3" },
] as const;

const occupation = ref<string | null>(null);
const cityTier = ref<string | null>(null);

const scoreLoading = ref(false);
const scoreCalculated = ref(false);

const finAsmtResponse = ref({});

onMounted(() => {
  fetch(`${apiUrl}/`).then(async (resp) => {
    connected.value = (await resp.json()).status == "success";
  });
});

const getScore = async () => {
    error.value = false;
  scoreLoading.value = true;
  const response = await fetch(`${apiUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      age: Math.trunc(Number(userInfo.age ?? 0)),
      occupation: occupation.value,
      city_tier: cityTier.value,
      income: Number(userInfo.income ?? 0),
      dependents: Math.trunc(Number(userInfo.dependents ?? 0)),
      rent: Number(expenses.rent ?? 0),
      loan: Number(expenses.loan ?? 0),
      insurance: Number(expenses.insurance ?? 0),
      groceries: Number(expenses.groceries ?? 0),
      transport: Number(expenses.transport ?? 0),
      eating_out: Number(expenses.eating_out ?? 0),
      entertainment: Number(expenses.entertainment ?? 0),
      utilities: Number(expenses.utilities ?? 0),
      healthcare: Number(expenses.healthcare ?? 0),
      education: Number(expenses.education ?? 0),
      miscellaneous: Number(expenses.miscellaneous ?? 0),
    }),
    /*JSON.stringify({
      age: 32,
      occupation: "Professional",
      city_tier: "Tier_1",
      income: 125000,
      dependents: 2,
      rent: 18000,
      loan: 7500,
      insurance: 2500,
      groceries: 12000,
      transport: 5000,
      eating_out: 4000,
      entertainment: 3000,
      utilities: 3500,
      healthcare: 2000,
      education: 5000,
      miscellaneous: 2500,
    }) */
  });
  const respJson = await response.json();
  if (respJson.status == "success") {
    scoreCalculated.value = true;
    finAsmtResponse.value = respJson;
  } else {
    error.value = true;
  }
  scoreLoading.value = false;
};
</script>

<template>
  <Transition name="fade">
    <LoadingScreen v-if="!connected" />
    <main v-else class="flex flex-col min-h-screen px-6 md:px-16 py-8 gap-4">
      <div class="title flex flex-col gap-1">
        <h1 class="text-6xl font-alt font-thin text-cyan-400">CredAble</h1>
        <p>Estimate your credit score and get quick insights.</p>
      </div>
      <Transition name="fade" mode="out-in">
        <section v-if="!scoreCalculated" class="mainCard md:h-128">
          <h1
            class="font-alt text-3xl font-medium tracking-tight sm:text-4xl mb-8"
          >
            Estimate your credit score
          </h1>

          <form @submit.prevent class="flex flex-col h-full">
            <Transition name="fade" mode="out-in">
              <div v-if="currentSection >= 2">
                <legend class="text-xl font-medium font-alt">
                  Monthly expenses
                </legend>
                <p class="mb-6 mt-1 text-sm text-gray-400">
                  Enter an amount for each category. Leave any that don't apply
                  at 0.
                </p>
              </div>

              <div v-else>
                <legend class="text-xl font-medium font-alt">
                  Personal information
                </legend>
                <p class="mb-6 mt-1 text-sm text-gray-400">
                  Enter information about yourself required to estimate your
                  score.
                </p>
              </div>
            </Transition>

            <template v-if="currentSection >= 2">
              <h2 class="mb-2 text-lg font-medium text-cyan-300">
                {{ expenseGroups[currentSection - 2].name }}
              </h2>
              <div class="mb-6 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <ExpenseInput
                  v-for="category in expenseGroups[currentSection - 2]
                    .categories"
                  :id="category.id"
                  :key="category.id"
                  v-model="expenses[category.id]"
                  :label="category.label"
                />
              </div>
            </template>
            <template v-else>
              <h2 class="mb-2 text-lg font-medium text-cyan-300">
                {{ userInfoSections[currentSection].name }}
              </h2>
              <div class="mb-6 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <NumberInput
                  v-for="field in userInfoSections[currentSection].fields"
                  :id="field.id"
                  :key="field.id"
                  v-model="userInfo[field.id]"
                  :label="field.label"
                  :suffix="field.suffix"
                  :step="field.step"
                />
                <SelectInput
                  v-if="currentSection === 0"
                  id="occupation"
                  label="Occupation"
                  v-model="occupation"
                  :options="occupationOptions"
                  placeholder="Select occupation"
                />
                <SelectInput
                  v-if="currentSection === 1"
                  id="city-tier"
                  label="City tier"
                  v-model="cityTier"
                  :options="cityTierOptions"
                  placeholder="Select city tier"
                />
              </div>
            </template>

            <div class="flex justify-between mt-auto">
              <button
                class="navButton"
                :disabled="currentSection == 0"
                type="button"
                @click="currentSection -= 1"
              >
                <ArrowLeft :size="18" /> Previous
              </button>
              <button
                v-if="currentSection < 4"
                type="button"
                @click="currentSection += 1"
                class="navButton text-gray-950 bg-cyan-400!"
              >
                Next <ArrowRight :size="18" />
              </button>
              <button
                v-else
                type="button"
                class="navButton text-gray-950 bg-cyan-400!"
                :disabled="scoreLoading"
                @click="getScore"
              >
                Calculate Score
                <LoaderCircle
                  v-if="scoreLoading"
                  :size="18"
                  class="animate-spin"
                />
                <ArrowRight v-else :size="18" />
              </button>
            </div>
          </form>
        </section>
        <Results
          v-else
          :response-data="(finAsmtResponse as FinancialAssessmentResponse)"
          @exit="() => (scoreCalculated = false)"
        />
      </Transition>
      <Transition name="fade">
        <ErrorPopup v-if="error" />
      </Transition>
    </main>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease-in-out,
    scale 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 85%;
}
</style>
