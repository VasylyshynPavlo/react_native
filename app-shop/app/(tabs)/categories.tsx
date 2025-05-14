import {
    FlatList,
    Text,
    View,
    RefreshControl,
    Alert,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    useColorScheme,
} from 'react-native'
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

    // State for handling full screen image modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const colorScheme = useColorScheme()

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

    const handleImagePress = (imageUri: string) => {
        setSelectedImage(imageUri)
        setIsModalVisible(true)
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
        setSelectedImage(null)
    }

    // @ts-ignore
    return (
        <SafeAreaView className="flex-1">
            <View>
                <TouchableOpacity
                    className="flex-row items-center justify-center p-2 bg-transparent rounded-md border-black dark:border-gray-500 border dark:border"
                    style={{ borderStyle: 'dashed' }}
                    onPress={() => router.replace('/add-category')}
                >
                    <IconSymbol
                        name="add.fill"
                        size={28}
                        color={colorScheme === 'dark' ? 'white' : 'black'}
                    />
                    <Text className="ml-1 text-black dark:text-white text-base">Add</Text>
                </TouchableOpacity>

            </View>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                        <View className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4 relative">
                            <TouchableOpacity
                                onPress={() => handleImagePress(`${BASE_URL}/uploading/1200_${item.image}`)}
                            >
                                <Image
                                    source={{ uri: `${BASE_URL}/uploading/1200_${item.image}` }}
                                    style={{ width: '100%', height: 200, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>

                            <Text className="text-sm text-gray-400 mt-2">{`ID: ${item.id}`}</Text>
                            <Text className="text-black dark:text-white text-lg font-semibold mt-2">{item.name}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</Text>

                            <TouchableOpacity
                                onPress={() => router.replace(`/edit-category/${item.id}`)}
                                className="absolute bottom-2.5 border border-gray-500 rounded-md p-1.5"
                                style={{right: 60}}
                            >
                                <IconSymbol
                                    name="edit.fill"
                                    size={28}
                                    color={colorScheme === 'dark' ? 'white' : 'black'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                className="absolute bottom-2.5 border border-gray-500 rounded-md p-1.5"
                                style={{right: 10}}
                            >
                                <IconSymbol
                                    name="delete.fill"
                                    size={28}
                                    color={colorScheme === 'dark' ? 'white' : 'black'}
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

            {/* Full Screen Modal for Image */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View className="flex-1 justify-center items-center bg-black">
                        <TouchableWithoutFeedback>
                            <View className="relative">
                                {selectedImage && (
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={{ width: 300, height: 300, borderRadius: 8 }}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

export default CategoriesScreen
