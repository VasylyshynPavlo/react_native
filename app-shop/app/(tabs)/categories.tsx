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
import { useAppDispatch } from '@/store'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetCategoryQuery, useDeleteCategoryMutation } from '@/services/categoryService'
import { BASE_URL } from '@/constants/Urls'
import { IconSymbol } from '@/components/ui/IconSymbol'

const CategoriesScreen = () => {
    const router = useRouter()
    const { data: categories, isLoading, error, refetch, isFetching } = useGetCategoryQuery()
    const [deleteCategory] = useDeleteCategoryMutation()

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

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete the category "${name}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
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
                    },
                },
            ],
            { cancelable: true }
        )
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
                        <View className="bg-white dark:bg-gray-900 rounded-t-lg shadow-md p-4 mb-0 relative">
                            <TouchableOpacity
                                onPress={() => handleImagePress(`${BASE_URL}/uploading/1200_${item.image}`)}
                            >
                                <Image
                                    source={{ uri: `${BASE_URL}/uploading/1200_${item.image}` }}
                                    style={{ width: '100%', aspectRatio: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>

                            <Text className="text-sm text-gray-400 mt-2">{`ID: ${item.id}`}</Text>
                            <Text className="text-black dark:text-white text-lg font-semibold mt-2">{item.name}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</Text>
                        </View>

                        <View
                            className="flex-row bg-white border dark:bg-gray-900"
                            style={{
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8,
                                borderColor: colorScheme === 'dark' ? '#374151' : '#D1D5DB',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => router.replace(`/edit-category/${item.id}`)}
                                className="flex-1 items-center justify-center p-3 border-r border-gray-300 dark:border-gray-700"
                            >
                                <IconSymbol
                                    name="edit.fill"
                                    size={28}
                                    color={colorScheme === 'dark' ? 'white' : 'black'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleDelete(item.id, item.name)}
                                className="flex-1 items-center justify-center p-3"
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
                                        style={{width: 300, height: 300, borderRadius: 8 }}
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