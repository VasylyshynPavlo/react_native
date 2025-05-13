import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import React from 'react'
import { OpaqueColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'

const MAPPING = {
    'house.fill': 'home',
    'category.fill': 'category',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'delete.fill': 'delete',
    'edit.fill': 'edit',
    'add.fill': 'add',
    'arrow_back.fill': 'arrow-back',
    'image.fill': 'image',
} as Partial<Record<import('expo-symbols').SymbolViewProps['name'], React.ComponentProps<typeof MaterialIcons>['name']>>

export type IconSymbolName =
    | 'house.fill'
    | 'category.fill'
    | 'paperplane.fill'
    | 'chevron.left.forwardslash.chevron.right'
    | 'chevron.right'
    | 'delete.fill'
    | 'edit.fill'
    | 'add.fill'
    | 'arrow_back.fill'
    | 'image.fill'

export function IconSymbol({
                               name,
                               size = 24,
                               color,
                               style,
                           }: {
    name: IconSymbolName
    size?: number
    color: string | OpaqueColorValue
    style?: StyleProp<TextStyle>
    weight?: SymbolWeight
}) {
    // @ts-ignore
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}
