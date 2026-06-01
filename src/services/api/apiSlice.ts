import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('fc.token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Category', 'Bank', 'Income', 'Expense', 'Investment', 'News', 'Integration'],
  endpoints: () => ({}),
});

// Unwrap helper para o envelope ApiResponse<T>
export const unwrap = <T>(r: ApiResponse<T>): T => r.data;
