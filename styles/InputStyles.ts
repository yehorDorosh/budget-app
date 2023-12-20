import { ViewStyle, TextStyle, StyleSheet } from 'react-native'
import Colors from './Colors'

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
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    lineHeight: 32,
    borderColor: Colors.input.border,
    backgroundColor: Colors.input.bg
  },
  errMsg: {
    color: Colors.error
  }
}

const InputStyles = StyleSheet.create(styles)

export default InputStyles
