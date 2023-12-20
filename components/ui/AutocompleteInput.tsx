import { useEffect, useState, FC } from 'react'
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native'
import uuid from 'react-native-uuid'
import InputStyles from '../../styles/InputStyles'
import Colors from '../../styles/Colors'

interface Props {
  isValid: boolean
  label?: string
  value?: string
  errMsg?: string
  dataList: string[]
  onChangeText?: (text: string) => void
  onDataListItemPress: (item: string) => void
  scrollSwitch?: (value: boolean) => void
}

const AutocompleteInput: FC<Props> = ({
  isValid,
  label,
  value,
  errMsg,
  dataList,
  onChangeText,
  onDataListItemPress,
  scrollSwitch,
  ...props
}) => {
  const [openAutocomplete, setOpenAutocomplete] = useState(false)

  const onChangeAutocompleteInputHandler = (value: string) => {
    setOpenAutocomplete(true)
    onChangeText?.(value)
  }

  const onDataListItemPressHandler = (item: string) => {
    onDataListItemPress?.(item)
    setOpenAutocomplete(false)
  }

  useEffect(() => {
    if (openAutocomplete && dataList?.length) {
      scrollSwitch?.(false)
    } else {
      scrollSwitch?.(true)
    }
  }, [openAutocomplete, dataList?.length])

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.autocompleteContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeAutocompleteInputHandler}
          onBlur={() => setOpenAutocomplete(false)}
          {...props}
        />
        {dataList && dataList.length ? (
          <View style={[styles.autocomplete, !openAutocomplete && styles.hidden]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {dataList.map((item) => (
                <Pressable key={`${item}-${uuid.v4()}`} onPress={onDataListItemPressHandler?.bind(this, item)}>
                  <Text style={styles.autocompleteItem}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {!isValid && errMsg && <Text style={styles.errMsg}>{errMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InputStyles,
  autocompleteContainer: {
    position: 'relative'
  },
  autocomplete: {
    position: 'absolute',
    zIndex: 1,
    top: '90%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: Colors.input.border,
    padding: 16,
    backgroundColor: Colors.autocompleteInput.bg,
    maxHeight: 200
  },
  autocompleteItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.autocompleteInput.border
  },
  hidden: {
    display: 'none'
  }
})

export default AutocompleteInput
