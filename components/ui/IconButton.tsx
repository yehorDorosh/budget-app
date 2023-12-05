import { FC } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  icon: keyof typeof Ionicons.glyphMap
  size?: number
  color: string
  onPress: () => void
  style?: object
}

const IconButton: FC<Props> = ({ icon, color, size = 24, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, style]}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5
  }
})

export default IconButton
