import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export interface IncomeDto {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  bankId: string;
  tags: string[];
  recurrence: number;
  recurrenceEnd?: string | null;
  confirmed: boolean;
}

export interface ExpenseDto extends IncomeDto {
  paymentMethod: number;
}

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listIncomes: b.query<IncomeDto[], Record<string, unknown> | void>({
      query: (params) => ({ url: 'receitas', params: params ?? undefined }),
      transformResponse: (r: ApiResponse<IncomeDto[]>) => unwrap(r),
      providesTags: ['Income'],
    }),
    createIncome: b.mutation<IncomeDto, Omit<IncomeDto, 'id' | 'confirmed'>>({
      query: (body) => ({ url: 'receitas', method: 'POST', body }),
      transformResponse: (r: ApiResponse<IncomeDto>) => unwrap(r),
      invalidatesTags: ['Income', 'Bank'],
    }),
    deleteIncome: b.mutation<void, string>({
      query: (id) => ({ url: `receitas/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Income', 'Bank'],
    }),
    listExpenses: b.query<ExpenseDto[], Record<string, unknown> | void>({
      query: (params) => ({ url: 'despesas', params: params ?? undefined }),
      transformResponse: (r: ApiResponse<ExpenseDto[]>) => unwrap(r),
      providesTags: ['Expense'],
    }),
    createExpense: b.mutation<ExpenseDto, Omit<ExpenseDto, 'id' | 'confirmed'>>({
      query: (body) => ({ url: 'despesas', method: 'POST', body }),
      transformResponse: (r: ApiResponse<ExpenseDto>) => unwrap(r),
      invalidatesTags: ['Expense', 'Bank'],
    }),
    deleteExpense: b.mutation<void, string>({
      query: (id) => ({ url: `despesas/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Expense', 'Bank'],
    }),
  }),
});

export const {
  useListIncomesQuery,
  useCreateIncomeMutation,
  useDeleteIncomeMutation,
  useListExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = transactionsApi;
