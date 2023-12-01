import { FC, useReducer, Reducer, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInputProps } from 'react-native'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'

interface FieldState {
  id: string
  value: string
  isValid: boolean
  isTouched: boolean
  label?: string
  errMsg?: string
  defaultValue?: string
  attrs?: TextInputProps
  validator?: (value: string) => boolean
}

interface FieldConfig {
  id: string
  label?: string
  defaultValue?: string
  errMsg?: string
  attrs?: TextInputProps
  validator?: (value: string) => boolean
}

type FieldsAction = { type: 'CHANGE'; id: string; value: string } | { type: 'CHECK-ALL' }

interface Props {
  fieldsConfig: FieldConfig[]
}

const reducerFields: Reducer<FieldState[], FieldsAction> = (state, action) => {
  const prevFields = [...state]

  switch (action.type) {
    case 'CHANGE':
      const index = state.findIndex((field) => field.id === action.id)
      const field = state[index]
      field.value = action.value
      field.isTouched = true
      field.isValid = field.validator ? field.validator(action.value) : true
      prevFields[index] = field
      return prevFields
    case 'CHECK-ALL':
      return state.map((field) => {
        field.isValid = field.validator ? field.validator(field.value) : true
        return field
      })
    default:
      return state
  }
}

const Form: FC<Props> = ({ fieldsConfig }) => {
  const defaultFields: FieldState[] = fieldsConfig.map((field) => ({
    id: field.id,
    value: field.defaultValue || '',
    isValid: true,
    isTouched: false,
    label: field.label,
    errMsg: field.errMsg,
    attrs: field.attrs,
    validator: field.validator
  }))

  const [fields, dispatchFields] = useReducer(reducerFields, defaultFields)
  const [formIsValid, setFormIsValid] = useState(true)

  const submitHandler = () => {
    dispatchFields({ type: 'CHECK-ALL' })
  }

  return (
    <BaseCard>
      {fields.map((field) => (
        <BaseInput
          key={field.id}
          label={field.label}
          isValid={field.isValid}
          errMsg={field.errMsg}
          value={field.value}
          onChangeText={(value) => {
            dispatchFields({ type: 'CHANGE', id: field.id, value })
          }}
          {...field.attrs}
        />
      ))}
      <BaseButton onPress={submitHandler}>Submit</BaseButton>
    </BaseCard>
  )
}

const styles = StyleSheet.create({})

export default Form
