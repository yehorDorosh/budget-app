import React, { FC, memo } from 'react'
import BaseButton from '../ui/BaseButton'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'

interface Props {
  btnTxt: string
  onClick: (id: string) => void
  style: StyleProp<ViewStyle>
}

const CalculatorButton: FC<Props> = ({ onClick, btnTxt, style }) => {
  return (
    <BaseButton mode="smallBtn" style={[style]} onPress={onClick.bind(this, btnTxt)}>
      {btnTxt}
    </BaseButton>
  )
}

const styles = StyleSheet.create({})

export default memo(CalculatorButton)
