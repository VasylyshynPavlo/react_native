import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAddProductMutation } from '@/services/productsService'
import { useGetCategoryQuery } from '@/services/categoryService'
import { getFileFromUriAsync } from '@/utils/getFileFromUriAsync'
import * as ImagePicker from 'expo-image-picker'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'

interface ImageData {
    uri: string
    id: string
}

interface Category {
    id: number
    name: string
}

const AddProductScreen = () => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        categoryId: 0,
    })
    const [formError, setFormError] = useState({
        name: { error: false, message: '' },
        price: { error: false, message: '' },
        description: { error: false, message: '' },
        categoryId: { error: false, message: '' },
        images: { error: false, message: '' },
    })
    const [images, setImages] = useState<ImageData[]>([])
    const colorScheme = useColorScheme()

    const [create, { isLoading }] = useAddProductMutation()
    const { data: categories, isLoading: categoriesLoading } = useGetCategoryQuery()

    const handleChange = (field: keyof typeof form, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (value.toString().trim() !== '' && (field !== 'categoryId' || value !== 0)) {
            handleFormError(field, false, '')
        }
    }

    const handleFormError = (field: keyof typeof formError, error: boolean, message = '') => {
        setFormError((prev) => ({
            ...prev,
            [field]: { error, message },
        }))
    }

    const validateForm = (): boolean => {
        let errorCount = 0
        if (!form.name) {
            handleFormError('name', true, 'Name is required')
            errorCount++
        } else {
            handleFormError('name', false, '')
        }
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
            handleFormError('price', true, 'Valid price is required')
            errorCount++
        } else {
            handleFormError('price', false, '')
        }
        if (!form.description) {
            handleFormError('description', true, 'Description is required')
            errorCount++
        } else {
            handleFormError('description', false, '')
        }
        if (form.categoryId === 0) {
            handleFormError('categoryId', true, 'Category is required')
            errorCount++
        } else {
            handleFormError('categoryId', false, '')
        }
        if (images.length === 0) {
            handleFormError('images', true, 'At least one image is required')
            errorCount++
        } else {
            handleFormError('images', false, '')
        }
        return errorCount === 0
    }

    const handleAddProduct = async () => {
        const isFormValid = validateForm()
        if (!isFormValid) return

        try {
            const imageFiles = (
                await Promise.all(
                    images.map(async (img) => await getFileFromUriAsync(img.uri))
                )
            ).filter((file): file is NonNullable<typeof file> => file !== null)

            if (imageFiles.length !== images.length) {
                alert('Some images could not be processed. Please try again.')
                return
            }


            const result = await create({
                name: form.name,
                price: Number(form.price),
                description: form.description,
                categoryId: form.categoryId,
                // @ts-ignore
                images: imageFiles,
            }).unwrap()
            router.replace('/products')
        } catch (error) {
            console.log('--Error creating product---', error)
            alert('Error creating product')
        }
    }

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            alert('To select photos, please allow access to your files')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.canceled) {
            setImages((prev) => [
                ...prev,
                { uri: result.assets[0].uri, id: Math.random().toString(36).substring(2) },
            ])
            handleFormError('images', false, '')
        }
    }

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id))
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="w-full flex justify-center items-center px-6 gap-2">
                        <FormField
                            title="Name"
                            value={form.name}
                            placeholder="Enter product name"
                            handleChangeText={(value) => handleChange('name', value)}
                            keyboardType="default"
                            otherStyles=""
                            autoCapitalize="none"
                            error={formError.name.error}
                            errorMessage={formError.name.message}
                        />
                        <FormField
                            title="Price"
                            value={form.price}
                            placeholder="

Enter product price"
                            handleChangeText={(value) => handleChange('price', value)}
                            keyboardType="numeric"
                            otherStyles=""
                            autoCapitalize="none"
                            error={formError.price.error}
                            errorMessage={formError.price.message}
                        />
                        <FormField
                            title="Description"
                            value={form.description}
                            placeholder="Enter product description"
                            handleChangeText={(value) => handleChange('description', value)}
                            keyboardType="default"
                            otherStyles=""
                            autoCapitalize="none"
                            error={formError.description.error}
                            errorMessage={formError.description.message}
                        />
                        <View className="w-full mt-4">
                            <Text className="text-base font-medium mb-2">Category</Text>
                            <View
                                className={`w-full border-2 rounded-lg ${
                                    formError.categoryId.error
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                                <Picker
                                    selectedValue={form.categoryId}
                                    onValueChange={(value) => handleChange('categoryId', value)}
                                    style={{
                                        color: colorScheme === 'dark' ? '#fff' : '#000',
                                        backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff',
                                    }}
                                >
                                    <Picker.Item label="Select a category" value={0} />
                                    {categories?.map((category: Category) => (
                                        <Picker.Item
                                            key={category.id}
                                            label={category.name}
                                            value={category.id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            {formError.categoryId.error && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {formError.categoryId.message}
                                </Text>
                            )}
                        </View>
                        <View className="w-full flex items-center justify-center mt-6 mb-2">
                            <TouchableOpacity
                                onPress={pickImage}
                                className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4"
                            >
                                <Text className="text-base font-medium text-gray-700 dark:text-gray-200">
                                    Add Photo
                                </Text>
                            </TouchableOpacity>
                            <View className="flex-row flex-wrap justify-center gap-2">
                                {images.map((img) => (
                                    <View key={img.id} className="relative">
                                        <Image
                                            source={{ uri: img.uri }}
                                            className="w-24 h-24 rounded-lg"
                                        />
                                        <TouchableOpacity
                                            onPress={() => removeImage(img.id)}
                                            className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            <Ionicons name="close" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            {formError.images.error && (
                                <Text className="text-red-500 text-sm mt-2">
                                    {formError.images.message}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={handleAddProduct}
                            disabled={isLoading || categoriesLoading}
                            className={`w-full rounded-lg mt-4 px-4 py-3 ${
                                isLoading || categoriesLoading
                                    ? 'bg-gray-400 dark:bg-gray-600'
                                    : 'bg-black dark:bg-white'
                            }`}
                        >
                            <Text
                                className={`text-center text-base font-medium ${
                                    isLoading || categoriesLoading
                                        ? 'text-gray-600 dark:text-gray-400'
                                        : 'text-white dark:text-black'
                                }`}
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddProductScreen
