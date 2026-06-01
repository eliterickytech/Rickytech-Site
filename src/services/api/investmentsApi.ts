import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export type InvestmentType = 1 | 2 | 3 | 4 | 5 | 99;

export interface InvestmentDto {
  id: string;
  ticker: string;
  type: InvestmentType;
  quantity: number;
  averagePrice: number;
  currency: string;
  acquiredAt: string;
  bankId: string;
  expectedYieldPercent?: number | null;
  notes?: string | null;
  currentPrice?: number | null;
  currentValue?: number | null;
  profitLoss?: number | null;
  profitLossPercent?: number | null;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  byType: { type: InvestmentType; totalInvested: number; currentValue: number; profitLoss: number }[];
}

export const investmentsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listInvestments: b.query<InvestmentDto[], { type?: InvestmentType; bankId?: string } | void>({
      query: (params) => ({ url: 'investimentos', params: params ?? undefined }),
      transformResponse: (r: ApiResponse<InvestmentDto[]>) => unwrap(r),
      providesTags: ['Investment'],
    }),
    portfolioSummary: b.query<PortfolioSummary, void>({
      query: () => 'investimentos/resumo',
      transformResponse: (r: ApiResponse<PortfolioSummary>) => unwrap(r),
      providesTags: ['Investment'],
    }),
    createInvestment: b.mutation<InvestmentDto, Omit<InvestmentDto, 'id' | 'currentPrice' | 'currentValue' | 'profitLoss' | 'profitLossPercent'>>({
      query: (body) => ({ url: 'investimentos', method: 'POST', body }),
      transformResponse: (r: ApiResponse<InvestmentDto>) => unwrap(r),
      invalidatesTags: ['Investment'],
    }),
  }),
});

export const {
  useListInvestmentsQuery,
  usePortfolioSummaryQuery,
  useCreateInvestmentMutation,
} = investmentsApi;
