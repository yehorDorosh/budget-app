import { FC, useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { isDateValid } from '../../utils/date'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import InputStyles from '../../styles/InputStyles'

interface Props {
  isValid: boolean
  label?: string
  errMsg?: string
  value?: string
  onChangeText?: (text: string) => void
}

const DateInput: FC<Props> = ({ isValid, label, errMsg, value, onChangeText, ...props }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const onPressHandler = () => {
    if (!showDatePicker) setShowDatePicker(true)
  }

  const onChangeDateHandler = (event: DateTimePickerEvent, date: Date | undefined) => {
    setShowDatePicker(false)
    if (date && event.type === 'set') {
      onChangeText!(date.toISOString().split('T')[0])
    }
  }

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput style={styles.input} value={value} onChangeText={onChangeText} onPressIn={onPressHandler} {...props} />
      {showDatePicker && (
        <DateTimePicker
          value={value && isDateValid(value) ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDateHandler}
        />
      )}

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles
})

export default DateInput
