import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useEditCategoryMutation, useGetCategoryByIdQuery } from '@/services/categoryService'
import { getFileFromUriAsync } from '@/utils/getFileFromUriAsync'
import * as ImagePicker from 'expo-image-picker'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons'
import { BASE_URL } from '@/constants/Urls'

const EditCategoryScreen = () => {
    const { id } = useLocalSearchParams()
    const colorScheme = useColorScheme()

    const { data: category, isLoading: isLoadingCategory, refetch } = useGetCategoryByIdQuery(Number(id), {
        skip: !id,
    })
    const [edit, { isLoading }] = useEditCategoryMutation()

    const [form, setForm] = useState({ name: '', description: '' })
    const [image, setImage] = useState<string | null>(null)
    const [originalImage, setOriginalImage] = useState<string | null>(null)

    const [formError, setFormError] = useState({
        name: { error: false, message: '' },
        description: { error: false, message: '' },
        avatar: { error: false, message: '' },
    })

    useEffect(() => {
        if (id) {
            refetch()
        }
    }, [id, refetch])

    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description
            })
            const fullImageUrl = `${BASE_URL}/uploading/1200_${category.image}`

            if (category.image) {
                setImage(fullImageUrl)
                setOriginalImage(fullImageUrl)
                console.log("Image found")
                console.log(`${BASE_URL}/uploading/${category.image}`)
            }
            else {
                console.error('Image could not be found')
            }
        }
    }, [category])
    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (value.trim() !== '') handleFormError(field, false, '')
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
        }

        if (!form.description) {
            handleFormError('description', true, 'Description is required')
            errorCount++
        }

        if (!image) {
            handleFormError('avatar', true, 'Avatar is required')
            errorCount++
        }

        return errorCount === 0
    }

    const handleEditCategory = async () => {
        const isValid = validateForm()
        if (!isValid) return

        try {
            const payload: any = {
                id: Number(id),
                ...form
            }

            if (image !== originalImage && image) {
                const file = await getFileFromUriAsync(image)
                payload.image = file
            }

            await edit(payload).unwrap()
            router.replace('/categories')
        } catch (error) {
            console.log('--Error editing category--', error)
            alert('Error')
        }
    }

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissionResult.granted) {
            alert('To select a photo, please allow access to your files')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    if (isLoadingCategory) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading category...</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="w-full flex justify-center items-center px-6 gap-2">
                        <FormField
                            title="Name"
                            value={form.name}
                            placeholder="Enter category name"
                            handleChangeText={(value) => handleChange('name', value)}
                            keyboardType="default"
                            autoCapitalize="none"
                            error={formError.name.error}
                            errorMessage={formError.name.message}
                        />

                        <FormField
                            title="Description"
                            value={form.description}
                            placeholder="Enter category description"
                            handleChangeText={(value) => handleChange('description', value)}
                            keyboardType="default"
                            autoCapitalize="none"
                            error={formError.description.error}
                            errorMessage={formError.description.message}
                        />

                        <View className="w-full flex items-center justify-center mt-6 mb-2">
                            <TouchableOpacity
                                onPress={pickImage}
                                className="relative w-32 h-32 overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                {image ? (
                                    <Image source={{ uri: image }} className="w-full h-full" />
                                ) : (
                                    <View className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <Ionicons name="image" size={64} color={colorScheme === 'dark' ? '#ffffff' : '#6b7280'} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {formError.avatar.error && <Text className="text-red-500 text-sm mt-2">{formError.avatar.message}</Text>}
                        </View>

                        <TouchableOpacity
                            onPress={handleEditCategory}
                            className={`w-full rounded-lg mt-4 px-4 py-3 bg-black dark:bg-white`}>
                            <Text className={`text-white dark:text-black text-center text-base font-medium`}>
                                Save changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EditCategoryScreen
