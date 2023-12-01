import { FC } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

interface Props extends React.ComponentProps<typeof TextInput> {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  onChangeText: (text: string) => void
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
  field: {
    marginBottom: 16
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 24,
    lineHeight: 32
  },
  errMsg: {
    color: 'red'
  }
})

export default BaseInput
