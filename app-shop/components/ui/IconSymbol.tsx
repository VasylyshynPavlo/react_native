import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native'

function mapToMaterialIcon(name: string): React.ComponentProps<typeof MaterialIcons>['name'] {
    return name
        .replace('.fill', '')
        .replace(/_/g, '-') as React.ComponentProps<typeof MaterialIcons>['name'];
}

export function IconSymbol({
                               name,
                               size = 24,
                               color,
                               style,
                           }: {
    name: string
    size?: number
    color: string | OpaqueColorValue
    style?: StyleProp<TextStyle>
}) {
    const materialName = mapToMaterialIcon(name);
    return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
