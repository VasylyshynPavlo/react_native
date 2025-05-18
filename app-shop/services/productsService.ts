import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from '@/utils/createBaseQuery'
import { IProduct, ICreateProduct, IEditProduct } from '@/interfaces/Product/Product'

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: createBaseQuery('products'),
    tagTypes: ['Products'],

    endpoints: (builder) => ({
        getProducts: builder.query<IProduct[], void>({
            query: () => ({
                url: 'getList',
                method: 'GET',
            }),
            providesTags: ['Products'],
        }),

        getProductById: builder.query<IProduct, number>({
            query: (id) => ({
                url: `getProduct?id=${id}`,
                method: 'GET',
            }),
        }),

        addProduct: builder.mutation<void, ICreateProduct>({
            query: (data: ICreateProduct) => {
                const formData = new FormData()
                formData.append('name', data.name)
                formData.append('description', data.description ?? '')
                formData.append('categoryId', data.categoryId.toString())
                formData.append('price', data.price.toString())

                data.images.forEach((img) => {
                    //@ts-ignore
                    formData.append('images', img)
                })

                return {
                    url: 'create',
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['Products'],
        }),

        editProduct: builder.mutation<void, IEditProduct>({
            query: (data: IEditProduct) => {
                const formData = new FormData()
                formData.append('id', data.id.toString())
                formData.append('name', data.name)
                formData.append('description', data.description ?? '')
                formData.append('categoryId', data.categoryId.toString())
                formData.append('price', data.price.toString())

                data.images.forEach((img) => {
                    //@ts-ignore
                    formData.append('images', img)
                })

                return {
                    url: 'edit',
                    method: 'PUT',
                    body: formData,
                }
            },
            invalidatesTags: ['Products'],
        }),

        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `remove/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useEditProductMutation,
    useDeleteProductMutation,
} = productApi
