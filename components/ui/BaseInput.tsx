import React, { FC } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import InputStyles from '../../styles/InputStyles'

interface Props extends React.ComponentProps<typeof TextInput> {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  onChangeText?: (text: string) => void
}

const BaseInput: FC<Props> = ({ label, isValid, value, errMsg, onChangeText, ...props }) => {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput style={styles.input} value={value} onChangeText={onChangeText} {...props} />

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles
})

export default BaseInput
