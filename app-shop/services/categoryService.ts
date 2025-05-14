import { createApi, EndpointBuilder } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '@/utils/createBaseQuery'
import { ICategory, ICreateCategory, IEditCategory } from '@/interfaces/Category/Category'

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
        }),
        editCategory: builder.mutation<void, IEditCategory>({
            query: (data: IEditCategory) => {
                const formData = new FormData()
                formData.append('id', data.id.toString())
                formData.append('name', data.name)
                //@ts-ignore
                formData.append('image', data.image)
                formData.append('description', data.description)

                return {
                    url: 'edit',
                    method: 'PUT',
                    body: formData
                }
            }
        }),
        getCategoryById: builder.query<ICategory, number>({
            query: (id) => ({
                url: `GetCategory?id=${id}`,
                method: 'GET',
            })
        })
    }),
})

export const { useGetCategoryQuery, useDeleteCategoryMutation, useAddCategoryMutation, useEditCategoryMutation, useGetCategoryByIdQuery } = categoryApi
