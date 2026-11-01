export type FinancialAssessmentResponse = {
  credit_assessment: {
    credit_score: number;
    loan_repayment_probability: number;
    risk_level: number;
  };
  financial_metrics: {
    emergency_fund_months: number;
    future_savings_6_months: number;
    monthly_savings: number;
    resilience_score: number;
    total_expenses: number;
  };
  input_summary: {
    age: number;
    city_tier: string;
    dependents: number;
    income: number;
    occupation: string;
  };
  recommendations: string[];
  status: string;
};
