import React, { FC } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import ShadowStyles from '../../styles/ShadowStyles'

interface Props {
  children: React.ReactNode
  onPress: () => void
}

const Button: FC<Props> = ({ children, onPress }) => {
  return (
    <Pressable style={({ pressed }) => [styles.button, ShadowStyles.shadow, pressed && styles.pressed]} onPress={onPress}>
      <View>
        <Text style={styles.label}>{children}</Text>
      </View>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#000'
  },
  pressed: {
    opacity: 0.7
  },
  label: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  }
})
