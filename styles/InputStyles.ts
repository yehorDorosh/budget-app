import { ViewStyle, TextStyle, StyleSheet } from 'react-native'

interface InputStylesType {
  field: ViewStyle
  label: TextStyle
  input: TextStyle
  errMsg: TextStyle
}

const styles: InputStylesType = {
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
}

const InputStyles = StyleSheet.create(styles)

export default InputStyles
