import React, { useState } from 'react'
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
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons'
import { getFileFromUriAsync } from '@/utils/getFileFromUriAsync'
import { useRegisterMutation } from '@/services/accountService'
import LoadingOverlay from '@/components/LoadingOverlay'
import FormField from '@/components/FormField'
import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'
import { IUser } from '@/interfaces/account'
import { setCredentials } from '@/store/slices/userSlice'
import { useAppDispatch } from '@/store'

const SignupScreen = () => {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const dispatch = useAppDispatch()
    const [formError, setFormError] = useState({
        firstName: { error: false, message: '' },
        lastName: { error: false, message: '' },
        email: { error: false, message: '' },
        password: { error: false, message: '' },
        avatar: { error: false, message: '' },
    })

    const colorScheme = useColorScheme()

    const [image, setImage] = useState<string | null>(null)

    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const [register, { isLoading }] = useRegisterMutation()

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

        if (!form.firstName) {
            handleFormError('firstName', true, 'Name is required')
            errorCount++
        } else {
            handleFormError('firstName', false, '')
        }

        if (!form.lastName) {
            handleFormError('lastName', true, 'Surname is required')
            errorCount++
        } else {
            handleFormError('lastName', false, '')
        }

        if (!form.email) {
            handleFormError('email', true, 'Email is required')
            errorCount++
        } else {
            handleFormError('email', false, '')
        }

        if (!form.password) {
            handleFormError('password', true, 'Password is required')
            errorCount++
        } else {
            handleFormError('password', false, '')
        }

        if (!image) {
            handleFormError('avatar', true, 'Avatar is required')
            errorCount++
        } else {
            handleFormError('avatar', false, '')
        }

        return errorCount === 0
    }

    const handleSignup = async () => {
        const isFormValid = validateForm()
        if (!isFormValid) return

        try {
            if (image) {
                const file = await getFileFromUriAsync(image)

                const result = await register({
                    ...form,
                    //@ts-ignore
                    image: file,
                }).unwrap()
                const { token } = result
                await SecureStore.setItemAsync('token', token)
                const user = jwtDecode<IUser>(token)
                dispatch(setCredentials({ token: token, user }))
                router.replace('/profile')
            }
        } catch (error) {
            console.log('--Error register---', error)
            alert('Error')
        }
        setIsSuccess(true)
        //Alert.alert('Success', `Welcome, ${form.name}!`);
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
                    <LoadingOverlay visible={isLoading} />
                    <View
                        className="w-full flex justify-center items-center px-6 py-12 gap-2"
                        style={{
                            minHeight: Dimensions.get('window').height,
                        }}>
                        <Text className={`text-3xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>Register</Text>

                        {isSuccess ? (
                            <Text className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
                                Enter Success
                            </Text>
                        ) : null}

                        <FormField
                            title="Name"
                            value={form.firstName}
                            placeholder="Enter your name"
                            handleChangeText={(value) => handleChange('firstName', value)}
                            keyboardType="default"
                            otherStyles=""
                            autoCapitalize="none"
                            error={formError.firstName.error}
                            errorMessage={formError.firstName.message}
                        />

                        <FormField
                            title="Surname"
                            value={form.lastName}
                            placeholder="Enter your surname"
                            handleChangeText={(value) => handleChange('lastName', value)}
                            keyboardType="default"
                            otherStyles=""
                            autoCapitalize="none"
                            error={formError.lastName.error}
                            errorMessage={formError.lastName.message}
                        />

                        <FormField
                            title="Email"
                            value={form.email}
                            placeholder="Enter your email"
                            handleChangeText={(value) => handleChange('email', value)}
                            keyboardType="email-address"
                            otherStyles=""
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            error={formError.email.error}
                            errorMessage={formError.email.message}
                        />

                        <FormField
                            title="Password"
                            value={form.password}
                            placeholder="Enter your password"
                            handleChangeText={(value) => handleChange('password', value)}
                            keyboardType="default"
                            otherStyles=""
                            secureTextEntry={true}
                            textContentType="password"
                            autoCapitalize="none"
                            error={formError.password.error}
                            errorMessage={formError.password.message}
                        />

                        <View className="w-full flex items-center justify-center mt-6 mb-2">
                            <TouchableOpacity
                                onPress={pickImage}
                                className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                {image ? (
                                    <Image source={{ uri: image }} className="w-full h-full" />
                                ) : (
                                    <View className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <Ionicons name="person" size={64} color={colorScheme === 'dark' ? '#ffffff' : '#6b7280'} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {formError.avatar.error && (
                                <Text className="text-red-500 text-sm mt-2">{formError.avatar.message}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleSignup}
                            className={`w-full rounded-lg mt-4 px-4 py-3 ${colorScheme === 'dark' ? 'bg-white' : 'bg-black'}`}>
                            <Text className={`${colorScheme === 'dark' ? 'text-black' : 'text-white'} text-center text-lg font-bold`}>
                                Register
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.replace('/sign-in')}
                            className="w-full flex justify-center items-center mt-2">
                            <Text
                                className={`${colorScheme === 'dark' ? 'text-white' : 'text-black'} text-center text-base font-medium`}>
                                Doesn&#39;t have an account? Register now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignupScreen
