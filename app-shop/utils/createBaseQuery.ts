import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import * as SecureStore from 'expo-secure-store'
import { BASE_URL } from '@/constants/Urls'

export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/${endpoint}/`,
        prepareHeaders: async (headers) => {
            const token = await SecureStore.getItemAsync('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    })
