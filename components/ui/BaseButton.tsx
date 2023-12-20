import React, { FC } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import ShadowStyles from '../../styles/ShadowStyles'
import Colors from '../../styles/Colors'

interface Props {
  children: React.ReactNode
  onPress: () => void
  mode?: 'link' | 'button' | 'smallBtn'
  active?: boolean
  style?: StyleProp<ViewStyle>[]
}

const BaseButton: FC<Props> = ({ children, onPress, mode = 'button', active = false, style = [] }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles[mode],
        pressed && styles.pressed,
        active && (mode === 'button' || mode === 'smallBtn') && styles.activeButton,
        ...style
      ]}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.label,
            mode === 'button' && [styles.labelButton, active && styles.activeText],
            mode === 'link' && [styles.labelLink, active && styles.activeLink],
            mode === 'smallBtn' && [styles.labelSmallBtn, active && styles.activeText]
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
    backgroundColor: Colors.btn.bg
  },
  link: {},
  smallBtn: {
    ...ShadowStyles.shadow,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.btn.bg
  },
  pressed: {
    opacity: 0.7
  },
  label: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  },
  labelButton: {
    color: Colors.btn.text
  },
  labelLink: {
    color: Colors.btn.bg
  },
  labelSmallBtn: {
    fontSize: 18,
    color: Colors.btn.text
  },
  activeLink: {
    textDecorationLine: 'underline'
  },
  activeButton: {
    backgroundColor: Colors.btn.activeBg,
    borderWidth: 1,
    borderColor: Colors.btn.activeBorder
  },
  activeText: {
    color: Colors.btn.activeText
  }
})
