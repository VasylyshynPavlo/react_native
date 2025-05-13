import { createApi, EndpointBuilder } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '@/utils/createBaseQuery'
import { ICategory } from '@/interfaces/Category/Category'

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: createBaseQuery('categories'),
    tagTypes: ['Categories'],

    endpoints: (builder) => ({
        getCategory: builder.query<ICategory[], void>({
            query: () => {
                return {
                    url: 'getList',
                    method: 'GET',
                }
            },
            providesTags: ['Categories'],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `Remove/${id}`,
                method: 'DELETE',
            }),
            // After deleting a category, we might want to invalidate the 'Categories' tag to refetch the list
            // You can adjust this based on your needs (for example, you could invalidate specific category queries)
            // or perform a refetch.
            invalidatesTags: ['Categories'],
        }),
    }),
})

export const { useGetCategoryQuery, useDeleteCategoryMutation } = categoryApi
