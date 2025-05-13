import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity, useColorScheme,
    View,
} from 'react-native'
import React, { useState } from 'react'
import { useAddCategoryMutation } from '@/services/categoryService'
import { getFileFromUriAsync } from '@/utils/getFileFromUriAsync'
import * as ImagePicker from 'expo-image-picker'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons'

const AddCategoryScreen = () => {
    const [form, setForm] = React.useState({ name: '', description: '' })
    const [formError, setFormError] = useState({
        name: { error: false, message: '' },
        description: { error: false, message: '' },
        avatar: { error: false, message: '' },
    })
    const [image, setImage] = useState<string | null>(null)
    const colorScheme = useColorScheme()

    const [create, { isLoading }] = useAddCategoryMutation()

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))

        if (value.trim() !== '') {
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

        if (!form.name) {
            handleFormError('description', true, 'Description is required')
            errorCount++
        } else {
            handleFormError('description', false, '')
        }

        if (!image) {
            handleFormError('avatar', true, 'Avatar is required')
            errorCount++
        } else {
            handleFormError('avatar', false, '')
        }

        return errorCount === 0
    }

    const handleAddCategory = async () => {
        const ifFormValid = await validateForm()
        if (!ifFormValid) return

        try {
            if (image) {
                const file = await getFileFromUriAsync(image)

                const result = await create({
                    ...form,
                    //@ts-ignore
                    image: file,
                }).unwrap()
                router.replace('/categories')
            }
        } catch (error) {
            console.log('--Error create category---', error)
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

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        className="w-full flex justify-center items-center px-6 gap-2">

                        <FormField
                            title="Name"
                            value={form.name}
                            placeholder="Enter category name"
                            handleChangeText={(value) => handleChange('name', value)}
                            keyboardType="default"
                            otherStyles=""
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
                            otherStyles=""
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
                            {formError.avatar.error && (
                                <Text className="text-red-500 text-sm mt-2">{formError.avatar.message}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleAddCategory}
                            className={`w-full rounded-lg mt-4 px-4 py-3 bg-black dark:bg-white`}>
                            <Text className={`text-white dark:text-black text-center text-base font-medium`}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddCategoryScreen
