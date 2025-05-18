import React, { useState, useCallback } from 'react'
import {
    FlatList,
    Text,
    View,
    RefreshControl,
    useColorScheme,
    TouchableWithoutFeedback, TouchableOpacity, Modal, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useDeleteProductMutation, useGetProductsQuery } from '@/services/productsService'
import { BASE_URL } from '@/constants/Urls'
import Carousel from 'react-native-reanimated-carousel'
import { Image } from 'expo-image'
import { IconSymbol } from '@/components/ui/IconSymbol'

const ProductsScreen = () => {
    const router = useRouter()
    const { data: products, error, refetch, isFetching } = useGetProductsQuery()
    if (products) console.log(products)
    const [deleteProduct] = useDeleteProductMutation()
    const [carouselWidth, setCarouselWidth] = useState<number>(0);

    const colorScheme = useColorScheme()

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
                        deleteProduct(id)
                            .unwrap()
                            .then(() => {
                                refetch()
                                Alert.alert('Product deleted successfully')
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

    return (
        <SafeAreaView className="flex-1">
            <View>
                <TouchableOpacity
                    className="flex-row items-center justify-center p-2 bg-transparent rounded-md border-black dark:border-gray-500 border dark:border"
                    style={{ borderStyle: 'dashed' }}
                    onPress={() => router.replace('/add-product')}
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
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                        <View
                            className="bg-white dark:bg-gray-900 rounded-t-lg shadow-md p-4 mb-0 relative"
                            onLayout={(event) => {
                                const { width } = event.nativeEvent.layout;
                                setCarouselWidth(width-32);
                            }}
                        >
                            {carouselWidth > 0 && (
                                <TouchableOpacity>
                                    <Carousel
                                        loop
                                        width={carouselWidth}
                                        height={300}
                                        autoPlay={false}
                                        data={item.imageUrls}
                                        scrollAnimationDuration={500}
                                        renderItem={({ item }) => (
                                            <TouchableWithoutFeedback>
                                                <Image
                                                    source={{ uri: `${BASE_URL}/uploading/1200_${item}` }}
                                                    style={{ width: carouselWidth, height: 300, borderRadius: 8 }}
                                                    contentFit="cover"
                                                />
                                            </TouchableWithoutFeedback>
                                        )}
                                    />
                                </TouchableOpacity>
                            )}

                            <Text className="text-sm text-gray-400 mt-2">{`ID: ${item.id}`}</Text>
                            <Text className="text-black dark:text-white text-lg font-semibold mt-2">{item.name}</Text>
                            <Text className="text-black dark:text-white text-4xl font-bold mt-2">${item.price}</Text>
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
                                // onPress={() => router.replace(`/edit-product/${item.id}`)}
                                onPress={() => alert('Не вийшло😭')}
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
        </SafeAreaView>
    )
}

export default ProductsScreen
