import { router, Stack } from 'expo-router'
import { TouchableOpacity, useColorScheme } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { IconSymbol } from '@/components/ui/IconSymbol'
// import {StatusBar} from "expo-status-bar";

const ScreensLayout = () => {
    const colorScheme = useColorScheme();
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="add-category"
                    options={{
                        headerShown: true,
                        title: 'Add Category',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.replace('/categories')} className="px-4">
                                {/*<Ionicons name="arrow-back" size={24} color="black" />*/}
                                <IconSymbol name="arrow_back.fill" color={colorScheme === 'dark' ? 'white' : 'black'} size={28}>
                                </IconSymbol>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
            {/*<StatusBar backgroundColor="#341234" />*/}
        </>
    )
}

export default ScreensLayout
