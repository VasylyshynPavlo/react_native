import { FlatList, Text, View, RefreshControl, Alert, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/store'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetCategoryQuery, useDeleteCategoryMutation } from '@/services/categoryService'
import { BASE_URL } from '@/constants/Urls'
import { IconSymbol } from '@/components/ui/IconSymbol'

const CategoriesScreen = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { data: categories, isLoading, error, refetch, isFetching } = useGetCategoryQuery()
    const [deleteCategory] = useDeleteCategoryMutation()
    const token = useAppSelector((state) => state.auth.token)

    if (error) {
        console.log('error', error)
    }

    const handleRefresh = useCallback(() => {
        refetch()
    }, [refetch])

    const handleDelete = (id: number) => {
        deleteCategory(id)
            .unwrap()
            .then(() => {
                refetch()
                Alert.alert('Category deleted successfully')
            })
            .catch((error) => {
                console.error('Error deleting category:', error)
                Alert.alert('Error', 'Failed to delete category')
            })
    }

    return (
        <SafeAreaView className="flex-1">
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                        <View className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4 relative">
                            <Image
                                source={{ uri: `${BASE_URL}/uploading/1200_${item.image}` }}
                                style={{ width: '100%', height: 200, borderRadius: 8 }}
                                resizeMode="cover"
                            />
                            <Text className="text-sm text-gray-400 mt-2">{`ID: ${item.id}`}</Text>
                            <Text className="text-black dark:text-white text-lg font-semibold mt-2">{item.name}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</Text>

                            {/* Delete Icon Button */}
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    backgroundColor: '#f44336',
                                    borderRadius: 20,
                                    padding: 5,
                                }}
                            >
                                <IconSymbol
                                    name="delete.fill"
                                    size={28}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={handleRefresh}
                        colors={['#000']}
                        tintColor="#000"
                    />
                }
                ListEmptyComponent={
                    !isFetching
                        ? <Text className="text-center text-gray-500 mt-4">No categories found</Text>
                        : null
                }
            />
        </SafeAreaView>
    )
}

export default CategoriesScreen
