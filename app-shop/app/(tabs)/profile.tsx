import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { logOut } from '@/store/slices/userSlice'
import { useAppDispatch } from '@/store'
import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { useGetProfileQuery } from '@/services/accountService'
import {BASE_URL} from "@/constants/Urls";

const ProfileScreen = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const colorScheme = useColorScheme()
    const { data: user, isLoading, error } = useGetProfileQuery()

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token')

        dispatch(logOut())
        router.replace('/sign-in')
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="w-full flex px-6 py-12 gap-2">
                        {user ? (
                            <>
                                <View className="flex-row items-center justify-between p-4">
                                    <View className="w-36 h-36 rounded-full bg-gray-300 ml-4 overflow-hidden">
                                        <Image source={{ uri:`${BASE_URL}/uploading/1200_${user.photo}`}}
                                               className="w-full h-full"
                                               resizeMode="cover"/>
                                    </View>
                                    <View className="flex-col text-start">
                                        <Text className="text-3xl text-black dark:text-white">{user.firstName}</Text>
                                        <Text className="text-3xl text-black dark:text-white">{user.lastName}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    className="w-full rounded-lg mt-4 px-4 py-3 dark:bg-white bg-black">
                                    <Text
                                        className={`${colorScheme === 'dark' ? 'text-black' : 'text-white'} text-center text-lg font-bold`}>
                                        Logout
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <></>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {/*<Text>Інформація про користувача:</Text>*/}
            {/*{user ? (*/}
            {/*  <>*/}
            {/*    <Text>Email: {user.email}</Text>*/}
            {/*    /!*<Text>Ім’я: {user.name}</Text>*!/*/}
            {/*    /!*<Text>Роль: {user.roles.join(', ')}</Text>*!/*/}

            {/*    <TouchableOpacity*/}
            {/*      onPress={handleLogout}*/}
            {/*    >*/}
            {/*      <Text>Вийти</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*  </>*/}
            {/*) : (*/}
            {/*  <Text>Завантаження даних...</Text>*/}
            {/*)}*/}
        </SafeAreaView>
    )
}

export default ProfileScreen
