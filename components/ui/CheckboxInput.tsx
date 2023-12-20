import { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Checkbox from 'expo-checkbox'
import InputStyles from '../../styles/InputStyles'

interface Props {
  isValid: boolean
  label?: string
  errMsg?: string
  onChangeCheckbox?: (value: boolean) => void
  isChecked?: boolean
}

const CheckboxInput: FC<Props> = ({ isValid, label, errMsg, onChangeCheckbox, isChecked }) => {
  const onChangeCheckboxLabelHandler = () => {
    onChangeCheckbox!(!isChecked)
  }

  return (
    <View style={styles.field}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxSection}>
          <Checkbox value={isChecked} onValueChange={onChangeCheckbox} />
          <Text style={styles.checkboxLabel} onPress={onChangeCheckboxLabelHandler}>
            {label}
          </Text>
        </View>
      </View>

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles,
  checkboxContainer: {
    flex: 1
  },
  checkboxSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {},
  checkboxLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4
  }
})

export default CheckboxInput
