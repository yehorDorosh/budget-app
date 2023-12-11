import { FC, Fragment, useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { isDateValid } from '../../utils/date'

interface Props extends React.ComponentProps<typeof TextInput> {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  type?: 'text' | 'select' | 'date'
  onChangeText?: (text: string) => void
  onChangeSelect?: (value: string, index: number) => void
  selectItems?: { label: string; value: string }[]
}

const BaseInput: FC<Props> = ({ type = 'text', label, isValid, value, errMsg, selectItems, onChangeText, onChangeSelect, ...props }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

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
      {type === 'date' && (
        <Fragment>
          <TextInput style={styles.input} value={value} onChangeText={onChangeText} onPressIn={() => setShowDatePicker(true)} {...props} />
          {showDatePicker && (
            <DateTimePicker
              value={value && isDateValid(value) ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                if (date && event.type === 'set') {
                  onChangeText!(date.toISOString().split('T')[0])
                }
                setShowDatePicker(false)
              }}
            />
          )}
        </Fragment>
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
