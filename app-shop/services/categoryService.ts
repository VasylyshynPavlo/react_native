import { createApi, EndpointBuilder } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '@/utils/createBaseQuery'
import { ICategory, ICreateCategory } from '@/interfaces/Category/Category'

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
        addCategory: builder.mutation<void, ICreateCategory>({
            query: (data: ICreateCategory) => {
                const formData = new FormData()
                formData.append('name', data.name)
                //@ts-ignore
                formData.append('image', data.image)
                formData.append('description', data.description)

                return {
                    url: 'create',
                    method: 'POST',
                    body: formData,
                }
            }
        })
    }),
})

export const { useGetCategoryQuery, useDeleteCategoryMutation, useAddCategoryMutation } = categoryApi
