import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export type ProjectionScenario = 1 | 2 | 3; // Optimistic | Realistic | Pessimistic

export interface ProjectionMonth {
  month: string;
  openingBalance: number;
  income: number;
  expense: number;
  investmentYield: number;
  endingBalance: number;
}

export interface ProjectionResult {
  horizonMonths: number;
  scenario: ProjectionScenario;
  generatedAt: string;
  series: ProjectionMonth[];
  summary: {
    endingBalance: number;
    totalIncome: number;
    totalExpense: number;
    totalInvestmentYield: number;
    netProfit: number;
  };
}

export interface RunProjectionInput {
  horizonMonths: number;
  scenario: ProjectionScenario;
  inflationPercent: number;
  includeInvestments: boolean;
  bankIds?: string[] | null;
}

export const projectionsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    runProjection: b.mutation<ProjectionResult, RunProjectionInput>({
      query: (body) => ({ url: 'projecoes', method: 'POST', body }),
      transformResponse: (r: ApiResponse<ProjectionResult>) => unwrap(r),
    }),
  }),
});

export const { useRunProjectionMutation } = projectionsApi;
