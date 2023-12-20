import { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import InputStyles from '../../styles/InputStyles'

interface Props {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  onChangeSelect: (value: string, index: number) => void
  selectItems: { label: string; value: string }[]
}

const SelectInput: FC<Props> = ({ isValid, label, value, errMsg, onChangeSelect, selectItems }) => {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.select}>
        <Picker selectedValue={value} onValueChange={onChangeSelect} mode="dropdown">
          {selectItems &&
            selectItems.map((item) => <Picker.Item style={styles.select} key={item.label} label={item.label} value={item.value} />)}
        </Picker>
      </View>

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles,
  select: {
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 8
  }
})

export default SelectInput
