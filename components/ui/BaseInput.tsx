import { FC } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'

interface Props extends React.ComponentProps<typeof TextInput> {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  type?: 'text' | 'select'
  onChangeText?: (text: string) => void
  onChangeSelect?: (value: string, index: number) => void
  selectItems?: { label: string; value: string }[]
}

const BaseInput: FC<Props> = ({ type = 'text', label, isValid, value, errMsg, selectItems, onChangeText, onChangeSelect, ...props }) => {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
      {type === 'text' && <TextInput style={styles.input} value={value} onChangeText={onChangeText} {...props} />}
      {type === 'select' && (
        <View style={styles.select}>
          <Picker selectedValue={value} onValueChange={onChangeSelect} mode="dropdown">
            {selectItems &&
              selectItems.map((item) => <Picker.Item style={styles.select} key={item.label} label={item.label} value={item.value} />)}
          </Picker>
        </View>
      )}
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
  },
  select: {
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 8
  }
})

export default BaseInput
