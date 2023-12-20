import { FC, useState, Fragment } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { isDateValid } from '../../utils/date'
import DateTimePicker from '@react-native-community/datetimepicker'
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

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

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

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles
})

export default DateInput
