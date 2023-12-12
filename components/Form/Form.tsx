import { FC, useReducer, Reducer, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInputProps, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'
import { ValidationError } from '../../types/api'
import SegmentedControl from '@react-native-segmented-control/segmented-control'

export interface FieldState {
  // type: 'text' | 'select' | 'date' | 'radio'
  id: string
  value: string
  isValid: boolean
  isTouched: boolean
  label?: string
  errMsg?: string
  defaultValue?: string
  attrs?: TextInputProps
  matchValidatorConfig?: { id: string }
  selectItems?: { label: string; value: string }[]
}

interface FormState {
  formIsValid: boolean
  formIsTouched: boolean
  formIsSubmitted: boolean
  isLoading?: boolean
  errMsg?: string
}

interface FieldConfig {
  type: 'text' | 'select' | 'date' | 'radio'
  id: string
  label?: string
  defaultValue?: string
  errMsg?: string
  attrs?: TextInputProps
  validator?: (value: string, matchValue?: string) => boolean
  matchValidatorConfig?: { id: string }
  selectItems?: { label: string; value: string }[]
}

interface FormConfig {
  submitText: string
  onSubmit: (...args: FieldState[]) => Promise<{ data: { errMsg?: string; validationErrors?: ValidationError[] }; status: number | null }>
  errMsg?: string
  onChangeFields?: (fields: FieldState[]) => void
}

type FieldsAction =
  | { type: 'CHANGE'; id: string; value: string; fieldsConfig: FieldConfig[] }
  | { type: 'CHECK-ALL'; fieldsConfig: FieldConfig[] }
  | { type: 'CLEAR'; fieldsConfig: FieldConfig[] }
  | { type: 'UPDATE_SELECT_LIST'; fieldsConfig: FieldConfig[] }
type FormAction =
  | { type: 'SUBMITTING'; fields: FieldState[]; fieldsConfig: FieldConfig[] }
  | { type: 'TOUCHED' }
  | { type: 'RESET' }
  | { type: 'ERR_MSG'; errMsg: string }
  | { type: 'LOADING'; isLoading: boolean }

interface Props {
  fieldsConfig: FieldConfig[]
  formConfig: FormConfig
}

const setupFields = (fieldsConfig: FieldConfig[]) => {
  return fieldsConfig.map((field) => ({
    // type: field.type ?? 'text',
    id: field.id,
    value: field.defaultValue || '',
    isValid: true,
    isTouched: false,
    label: field.label,
    errMsg: field.errMsg,
    attrs: field.attrs,
    validator: field.validator,
    matchValidatorConfig: field.matchValidatorConfig,
    selectItems: field.selectItems
  }))
}

const reducerFields: Reducer<FieldState[], FieldsAction> = (state, action) => {
  const prevFields = [...state]

  switch (action.type) {
    case 'CHANGE':
      const index = state.findIndex((field) => field.id === action.id)
      const validator = action.fieldsConfig[index].validator
      const field = state[index]
      field.value = action.value?.trim()
      field.isTouched = true
      const matchValue = state.find((_) => _.id === field.matchValidatorConfig?.id)?.value
      field.isValid = validator ? validator(action.value, matchValue) : true
      prevFields[index] = field
      return prevFields
    case 'CHECK-ALL':
      return state.map((field, i) => {
        const validator = action.fieldsConfig[i].validator
        const matchValue = state.find((_) => _.id === field.matchValidatorConfig?.id)?.value
        field.isValid = validator ? validator(field.value, matchValue) : true
        return field
      })
    case 'CLEAR':
      return state.map((field, i) => {
        if (action.fieldsConfig[i].type === 'radio') return field
        field.value = ''
        field.isValid = true
        field.isTouched = false
        return field
      })
    case 'UPDATE_SELECT_LIST':
      return state.map((field, i) => {
        if (action.fieldsConfig[i].selectItems) field.selectItems = action.fieldsConfig[i].selectItems
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
        formIsValid: action.fields.every((field, i) => {
          const validator = action.fieldsConfig[i].validator
          return validator ? field.isValid : true
        }),
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
        formIsSubmitted: false,
        errMsg: undefined
      }
    case 'ERR_MSG':
      return {
        ...state,
        errMsg: action.errMsg
      }
    case 'LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      }
    default:
      return state
  }
}

const Form: FC<Props> = ({ fieldsConfig, formConfig }) => {
  const defaultFields: FieldState[] = setupFields(fieldsConfig)

  const [fields, dispatchFields] = useReducer(reducerFields, defaultFields)
  const [form, dispatchForm] = useReducer(reducerForm, {
    formIsValid: true,
    formIsTouched: false,
    formIsSubmitted: false,
    isLoading: false
  })

  const inputHandler = (id: string, value: string) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value, fieldsConfig })
  }

  const selectHandler = (id: string, value: string, index: number) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value, fieldsConfig })
  }

  const submitHandler = () => {
    dispatchFields({ type: 'CHECK-ALL', fieldsConfig })
    dispatchForm({ type: 'SUBMITTING', fields, fieldsConfig })
  }

  useEffect(() => {
    const formValidationOn = fields.some((_, i) => !!fieldsConfig[i].validator)

    if (form.formIsValid && (form.formIsTouched || !formValidationOn) && form.formIsSubmitted) {
      dispatchForm({ type: 'RESET' })
      dispatchForm({ type: 'LOADING', isLoading: true })

      formConfig.onSubmit(...fields).then((res) => {
        dispatchForm({ type: 'LOADING', isLoading: false })

        if (res.status === 422) {
          const errMsg = res.data.validationErrors
            ? res.data.validationErrors.map((err) => `${err.path} ${err.msg}`).join('\n')
            : 'Server validation error'
          dispatchForm({ type: 'ERR_MSG', errMsg })
        } else if (res.status === null && res.data && res.data.errMsg) {
          Alert.alert('Error', res.data.errMsg, [{ text: 'OK' }])
        } else if (res.status !== 401) {
          dispatchFields({ type: 'CLEAR', fieldsConfig })
        }
      })
    }
  }, [form.formIsSubmitted, form.formIsValid, form.formIsTouched])

  // Update select list when selectItems change
  useEffect(() => {
    dispatchFields({ type: 'UPDATE_SELECT_LIST', fieldsConfig })
    dispatchFields({ type: 'CLEAR', fieldsConfig })
  }, [...fieldsConfig.map((field) => field.selectItems)])

  // Call onChangeFields when some of fields was changed
  useEffect(() => {
    formConfig.onChangeFields?.(fields)
  }, [...fields.map((field) => field.value)])

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position">
        <BaseCard style={styles.form}>
          {form.isLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator style={styles.spinner} size="large" color="black" />
            </View>
          )}
          {formConfig.errMsg && <Text style={styles.error}>{formConfig.errMsg}</Text>}
          {form.errMsg && <Text style={styles.error}>{form.errMsg}</Text>}
          {fields.map((field, i) => {
            switch (fieldsConfig[i].type) {
              case 'select':
                return (
                  <BaseInput
                    type="select"
                    selectItems={field.selectItems}
                    key={field.id}
                    label={field.label}
                    isValid={field.isValid}
                    errMsg={field.errMsg}
                    value={field.value}
                    onChangeSelect={selectHandler.bind(null, field.id)}
                    {...field.attrs}
                  />
                )
              case 'radio':
                return (
                  <SegmentedControl
                    key={field.id}
                    values={field.selectItems?.map((item) => item.label)}
                    selectedIndex={field.selectItems?.findIndex((item) => item.value == field.value) || 0}
                    onChange={(event) => {
                      if (field.selectItems) inputHandler(field.id, field.selectItems[event.nativeEvent.selectedSegmentIndex].value)
                    }}
                    style={{ marginBottom: 8 }}
                  />
                )
              default:
                return (
                  <BaseInput
                    type={fieldsConfig[i].type}
                    key={field.id}
                    label={field.label}
                    isValid={field.isValid}
                    errMsg={field.errMsg}
                    value={field.value}
                    onChangeText={inputHandler.bind(null, field.id)}
                    {...field.attrs}
                  />
                )
            }
          })}
          <BaseButton onPress={submitHandler}>{formConfig.submitText}</BaseButton>
        </BaseCard>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  form: {
    position: 'relative',
    marginVertical: 8
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
    borderRadius: 8
  },
  error: {
    color: 'red',
    marginBottom: 8
  }
})

export default Form
