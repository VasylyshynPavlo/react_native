import React, { useState } from 'react'
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native'
import { router } from 'expo-router'
import { useLoginMutation } from '@/services/accountService'
import LoadingOverlay from '@/components/LoadingOverlay'

import * as SecureStore from 'expo-secure-store'

import { jwtDecode } from 'jwt-decode'
import { useAppDispatch } from '@/store'
import { setCredentials } from '@/store/slices/userSlice'
import { IUser } from '@/interfaces/account'
import AuthFormField from '@/components/AuthFormField'

const SigninScreen = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [formError, setFormError] = useState({
        email: { error: false, message: '' },
        password: { error: false, message: '' },
    })
    const [hasServerError, setHasServerError] = useState(false)

    const colorScheme = useColorScheme()

    const [login, { isLoading, error }] = useLoginMutation()
    //console.log("Error", error);

    const dispatch = useAppDispatch()

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))

        // якщо була серверна помилка — очищаємо всі поля
        if (hasServerError) {
            setFormError({
                email: { error: false, message: '' },
                password: { error: false, message: '' },
            })
            setHasServerError(false)
        } else if (value.trim() !== '') {
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

        return errorCount === 0
    }

    const handleSignin = async () => {
        const isFormValid = validateForm()
        if (!isFormValid) return

        try {
            const result = await login(form).unwrap()
            const { token } = result
            await SecureStore.setItemAsync('token', token)
            const user = jwtDecode<IUser>(token)
            dispatch(setCredentials({ token: token, user }))
            router.replace('/profile')
        } catch (error: any) {
            if (error?.status === 400) {
                setFormError({
                    email: { error: true, message: 'Invalid email or password' },
                    password: { error: true, message: 'Invalid email or password' },
                })
                setHasServerError(true)
            }
            console.log('Login error: ', error)
        }
    }

    // var authToken = SecureStore.getItem("token");
    // if(authToken) {
    //   var userInfo = jwtDecode(authToken);
    //   console.log("User info token: ", userInfo);
    // }

    // console.log("SecureStore", SecureStore.getItem("token"));

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
                        <Text className={`text-3xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>Login</Text>

                        <AuthFormField
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

                        <AuthFormField
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

                        {/*<TouchableOpacity onPress={handleSignup} className="w-full bg-blue-500 p-4 rounded-lg mb-4">*/}
                        {/*    <Text className="text-white text-center text-lg font-bold">Вхід</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                            onPress={handleSignin}
                            className={`w-full rounded-lg mt-4 px-4 py-3 ${colorScheme === 'dark' ? 'bg-white' : 'bg-black'}`}>
                            <Text className={`${colorScheme === 'dark' ? 'text-black' : 'text-white'} text-center text-lg font-bold`}>
                                login
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.replace('/sign-up')}
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

export default SigninScreen
