import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export interface IntegrationStatus {
  id?: string | null;
  provider: number;
  connected: boolean;
  active: boolean;
  lastSyncAt?: string | null;
  apiKeyMasked?: string | null;
}

export interface SyncResult { imported: number; skipped: number; syncedAt: string; }

export const integrationsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    binanceStatus: b.query<IntegrationStatus, void>({
      query: () => 'integracoes/binance/status',
      transformResponse: (r: ApiResponse<IntegrationStatus>) => unwrap(r),
      providesTags: ['Integration'],
    }),
    saveBinance: b.mutation<IntegrationStatus, { apiKey: string; apiSecret: string }>({
      query: (body) => ({ url: 'integracoes/binance', method: 'POST', body }),
      transformResponse: (r: ApiResponse<IntegrationStatus>) => unwrap(r),
      invalidatesTags: ['Integration'],
    }),
    syncBinance: b.mutation<SyncResult, void>({
      query: () => ({ url: 'integracoes/binance/sync', method: 'POST' }),
      transformResponse: (r: ApiResponse<SyncResult>) => unwrap(r),
      invalidatesTags: ['Integration', 'Investment', 'Income', 'Expense'],
    }),
    startConsent: b.mutation<{ consentUrl: string; consentId: string }, { cpf: string; bankCode: string }>({
      query: (body) => ({ url: 'integracoes/openfinance/consentir', method: 'POST', body }),
      transformResponse: (r: ApiResponse<{ consentUrl: string; consentId: string }>) => unwrap(r),
    }),
    syncOpenFinance: b.mutation<SyncResult, void>({
      query: () => ({ url: 'integracoes/openfinance/sync', method: 'POST' }),
      transformResponse: (r: ApiResponse<SyncResult>) => unwrap(r),
      invalidatesTags: ['Integration', 'Income', 'Expense'],
    }),
  }),
});

export const {
  useBinanceStatusQuery,
  useSaveBinanceMutation,
  useSyncBinanceMutation,
  useStartConsentMutation,
  useSyncOpenFinanceMutation,
} = integrationsApi;
