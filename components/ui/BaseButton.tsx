import React, { FC } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import ShadowStyles from '../../styles/ShadowStyles'

interface Props {
  children: React.ReactNode
  onPress: () => void
  mode?: 'link' | 'button'
  active?: boolean
  style?: {}[]
}

const BaseButton: FC<Props> = ({ children, onPress, mode = 'button', active = false, style = [] }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles[mode], pressed && styles.pressed, active && mode === 'button' && styles.activeButton, ...style]}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.label,
            mode === 'button' ? [styles.labelButton, active && styles.activeText] : [styles.labelLink, active && styles.activeLink]
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  )
}

export default BaseButton

const styles = StyleSheet.create({
  button: {
    ...ShadowStyles.shadow,
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#000'
  },
  link: {},
  pressed: {
    opacity: 0.7
  },
  label: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  },
  labelButton: {
    color: '#fff'
  },
  labelLink: {
    color: '#000'
  },
  activeLink: {
    textDecorationLine: 'underline'
  },
  activeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000'
  },
  activeText: {
    color: '#000'
  }
})
