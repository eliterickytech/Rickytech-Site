import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export type BankAccountType = 1 | 2 | 3 | 4 | 5;

export interface BankDto {
  id: string;
  name: string;
  nickname: string;
  type: BankAccountType;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  branch?: string | null;
  accountNumber?: string | null;
  active: boolean;
}

export interface CreateBankInput {
  name: string;
  nickname: string;
  type: BankAccountType;
  currency: string;
  openingBalance: number;
  branch?: string | null;
  accountNumber?: string | null;
}

export const banksApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listBanks: b.query<BankDto[], void>({
      query: () => 'bancos',
      transformResponse: (r: ApiResponse<BankDto[]>) => unwrap(r),
      providesTags: ['Bank'],
    }),
    createBank: b.mutation<BankDto, CreateBankInput>({
      query: (body) => ({ url: 'bancos', method: 'POST', body }),
      transformResponse: (r: ApiResponse<BankDto>) => unwrap(r),
      invalidatesTags: ['Bank'],
    }),
    updateBank: b.mutation<BankDto, { id: string; nickname: string; active: boolean }>({
      query: ({ id, ...body }) => ({ url: `bancos/${id}`, method: 'PUT', body }),
      transformResponse: (r: ApiResponse<BankDto>) => unwrap(r),
      invalidatesTags: ['Bank'],
    }),
    deleteBank: b.mutation<void, string>({
      query: (id) => ({ url: `bancos/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Bank'],
    }),
  }),
});

export const {
  useListBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} = banksApi;
