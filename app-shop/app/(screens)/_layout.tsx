import { router, Stack } from 'expo-router'
import { TouchableOpacity, useColorScheme } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { IconSymbol } from '@/components/ui/IconSymbol'
// import { StatusBar } from 'expo-status-bar';

const ScreensLayout = () => {
    const colorScheme = useColorScheme()

    const backButton = () => (
        <TouchableOpacity onPress={() => router.replace('/categories')} className="px-4">
            <IconSymbol
                name="arrow_back.fill"
                color={colorScheme === 'dark' ? 'white' : 'black'}
                size={28}
            />
        </TouchableOpacity>
    )

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="add-category"
                    options={{
                        headerShown: true,
                        title: 'Add Category',
                        headerLeft: backButton,
                    }}
                />
                <Stack.Screen
                    name="edit-category/[id]"
                    options={{
                        headerShown: true,
                        title: 'Edit Category',
                        headerLeft: backButton,
                    }}
                />
            </Stack>
            {/* <StatusBar backgroundColor="#341234" /> */}
        </>
    )
}

export default ScreensLayout
