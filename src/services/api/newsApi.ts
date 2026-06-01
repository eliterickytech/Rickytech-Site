import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export type NewsCategory = 1 | 2 | 3;

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;
  summary?: string | null;
  imageUrl?: string | null;
}

export interface NewsList {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listNews: b.query<NewsList, { category?: NewsCategory; tag?: string; search?: string; page?: number; pageSize?: number }>({
      query: (params) => ({ url: 'noticias', params }),
      transformResponse: (r: ApiResponse<NewsList>) => unwrap(r),
      providesTags: ['News'],
    }),
  }),
});

export const { useListNewsQuery } = newsApi;
