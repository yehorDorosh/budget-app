import { FC, useReducer, Reducer, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInputProps, Alert } from 'react-native'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'

export interface FieldState {
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

interface FormState {
  formIsValid: boolean
  formIsTouched: boolean
  formIsSubmitted: boolean
}

interface FieldConfig {
  id: string
  label?: string
  defaultValue?: string
  errMsg?: string
  attrs?: TextInputProps
  validator?: (value: string) => boolean
}

interface FormConfig {
  submitText: string
  onSubmit: (...args: FieldState[]) => Promise<{ data: { errMsg?: string }, status: number | null}>
  errMsg?: string
}

type FieldsAction = { type: 'CHANGE'; id: string; value: string } | { type: 'CHECK-ALL' }
type FormAction = { type: 'SUBMITTING'; fields: FieldState[] } | { type: 'TOUCHED' } | { type: 'RESET' }

interface Props {
  fieldsConfig: FieldConfig[]
  formConfig: FormConfig
}

const reducerFields: Reducer<FieldState[], FieldsAction> = (state, action) => {
  const prevFields = [...state]

  switch (action.type) {
    case 'CHANGE':
      const index = state.findIndex((field) => field.id === action.id)
      const field = state[index]
      field.value = action.value.trim()
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

const reducerForm: Reducer<FormState, FormAction> = (state, action) => {
  switch (action.type) {
    case 'SUBMITTING':
      return {
        ...state,
        formIsValid: action.fields.every((field) => field.isValid),
        formIsSubmitted: true
      }
    case 'TOUCHED':
      return {
        ...state,
        formIsTouched: true
      }
    case 'RESET':
      return {
        ...state,
        formIsSubmitted: false
      }
    default:
      return state
  }
}

const Form: FC<Props> = ({ fieldsConfig, formConfig }) => {
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
  const [form, dispatchForm] = useReducer(reducerForm, {
    formIsValid: true,
    formIsTouched: false,
    formIsSubmitted: false
  })
  const [formError, setFormError] = useState<string | undefined>()

  const inputHandler = (id: string, value: string) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value })
  }

  const submitHandler = () => {
    dispatchFields({ type: 'CHECK-ALL' })
    dispatchForm({ type: 'SUBMITTING', fields })
  }

  useEffect(() => {
    if (form.formIsValid && form.formIsTouched && form.formIsSubmitted) {
      dispatchForm({ type: 'RESET' })
      formConfig.onSubmit(...fields).then((res) => {
        if (res.status === 422) {
          setFormError('Server validation error')
        } else if (res.status === null && res.data && res.data.errMsg) {
          Alert.alert('Error', res.data.errMsg, [{ text: 'OK' }])
        }
      })
      
    }
  }, [form.formIsSubmitted, form.formIsValid, form.formIsTouched])

  return (
    <BaseCard>
      {formConfig.errMsg && <Text style={styles.error}>{formConfig.errMsg}</Text>}
      {formError && <Text style={styles.error}>{formError}</Text>}
      {fields.map((field) => (
        <BaseInput
          key={field.id}
          label={field.label}
          isValid={field.isValid}
          errMsg={field.errMsg}
          value={field.value}
          onChangeText={inputHandler.bind(null, field.id)}
          {...field.attrs}
        />
      ))}
      <BaseButton onPress={submitHandler}>{formConfig.submitText}</BaseButton>
    </BaseCard>
  )
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 8
  }
})

export default Form
