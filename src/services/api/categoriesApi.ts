import { apiSlice, ApiResponse, unwrap } from './apiSlice';

export type CategoryType = 1 | 2 | 3; // Income | Expense | Both

export interface CategoryDto {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  parentCategoryId?: string | null;
  active: boolean;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  parentCategoryId?: string | null;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listCategories: b.query<CategoryDto[], { type?: CategoryType; active?: boolean; search?: string } | void>({
      query: (params) => ({ url: 'categorias', params: params ?? undefined }),
      transformResponse: (r: ApiResponse<CategoryDto[]>) => unwrap(r),
      providesTags: ['Category'],
    }),
    getCategory: b.query<CategoryDto, string>({
      query: (id) => `categorias/${id}`,
      transformResponse: (r: ApiResponse<CategoryDto>) => unwrap(r),
    }),
    createCategory: b.mutation<CategoryDto, CreateCategoryInput>({
      query: (body) => ({ url: 'categorias', method: 'POST', body }),
      transformResponse: (r: ApiResponse<CategoryDto>) => unwrap(r),
      invalidatesTags: ['Category'],
    }),
    updateCategory: b.mutation<CategoryDto, { id: string } & Omit<CategoryDto, 'id' | 'parentCategoryId'>>({
      query: ({ id, ...body }) => ({ url: `categorias/${id}`, method: 'PUT', body }),
      transformResponse: (r: ApiResponse<CategoryDto>) => unwrap(r),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: b.mutation<void, string>({
      query: (id) => ({ url: `categorias/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
