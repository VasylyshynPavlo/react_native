import React, { useState } from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'
import { useColorScheme } from '@/hooks/useColorScheme'
import clsx from 'clsx'

interface FromFieldProps extends TextInputProps {
    title: string
    value: string
    placeholder: string
    handleChangeText: (value: string) => void
    errorMessage?: string
    error?: boolean
    otherStyles?: string
    secureTextEntry?: boolean
    autoComplete?: TextInputProps['autoComplete']
    textContentType?: TextInputProps['textContentType']
    autoCapitalize?: TextInputProps['autoCapitalize']
}

const AuthFormField: React.FC<FromFieldProps> = ({
                                                     title,
                                                     value,
                                                     placeholder,
                                                     handleChangeText,
                                                     otherStyles = '',
                                                     secureTextEntry,
                                                     autoComplete,
                                                     textContentType,
                                                     autoCapitalize = 'none',
                                                     errorMessage = '',
                                                     error = false,
                                                     ...rest
                                                 }) => {
    const colorScheme = useColorScheme()
    const [isFocused, setIsFocused] = useState(false)

    return (
        <View className={`w-full ${otherStyles}`}>
            <Text className={clsx(
                'text-base font-medium mb-2',
                colorScheme === 'dark' ? 'text-white' : 'text-black'
            )}>
                {title}
            </Text>

            <View
                className={clsx(
                    'w-full rounded-lg border px-4 py-2',
                    error
                        ? 'border-red-500'
                        : isFocused
                            ? colorScheme === 'dark'
                                ? 'border-gray-100'
                                : 'border-gray-500'
                            : colorScheme === 'dark'
                                ? 'border-gray-500'
                                : 'border-black'
                )}
            >
                <TextInput
                    className={clsx(
                        'w-full text-base',
                        colorScheme === 'dark' ? 'text-white' : 'text-black'
                    )}
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colorScheme === 'dark' ? '#ffffffaa' : '#000000aa'}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    autoCapitalize={autoCapitalize}
                    {...rest}
                />
            </View>

            {error && errorMessage !== '' && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                    {errorMessage}
                </Text>
            )}
        </View>
    )
}

export default AuthFormField
