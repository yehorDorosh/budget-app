import { FC, useReducer, Reducer, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInputProps, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'
import { ValidationError } from '../../types/api'
import SegmentedControl from '@react-native-segmented-control/segmented-control'

export interface FieldState {
  value: string
  isValid: boolean
  isTouched: boolean
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
  notClearable?: boolean
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
    value: field.defaultValue || '',
    isValid: true,
    isTouched: false
  }))
}

const reducerFields: Reducer<FieldState[], FieldsAction> = (state, action) => {
  const prevFields = [...state]

  switch (action.type) {
    case 'CHANGE':
      const index = action.fieldsConfig.findIndex((field) => field.id === action.id)
      const validator = action.fieldsConfig[index].validator
      const field = state[index]
      field.value = action.value?.trim()
      field.isTouched = true
      const matchValue = state.find((_, i) => action.fieldsConfig[i].id === action.fieldsConfig[index].matchValidatorConfig?.id)?.value
      field.isValid = validator ? validator(action.value, matchValue) : true
      prevFields[index] = field
      return prevFields
    case 'CHECK-ALL':
      return state.map((field, index) => {
        const validator = action.fieldsConfig[index].validator
        const matchValue = state.find((_, i) => action.fieldsConfig[i].id === action.fieldsConfig[index].matchValidatorConfig?.id)?.value
        field.isValid = validator ? validator(field.value, matchValue) : true
        return field
      })
    case 'CLEAR':
      return state.map((field, i) => {
        if (action.fieldsConfig[i].type === 'radio' || action.fieldsConfig[i].notClearable) return field
        field.value = ''
        field.isValid = true
        field.isTouched = false
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
    const formValidationOn = fieldsConfig.some((field) => !!field.validator)

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

  // Clear form values when selectItems was changed
  useEffect(() => {
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
                    selectItems={fieldsConfig[i].selectItems}
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    value={field.value}
                    onChangeSelect={selectHandler.bind(null, fieldsConfig[i].id)}
                    {...fieldsConfig[i].attrs}
                  />
                )
              case 'radio':
                return (
                  <SegmentedControl
                    key={fieldsConfig[i].id}
                    values={fieldsConfig[i].selectItems?.map((item) => item.label)}
                    selectedIndex={fieldsConfig[i].selectItems?.findIndex((item) => item.value == field.value) || 0}
                    onChange={(event) => {
                      if (fieldsConfig[i].selectItems)
                        inputHandler(fieldsConfig[i].id, fieldsConfig[i].selectItems![event.nativeEvent.selectedSegmentIndex].value)
                    }}
                    style={{ marginBottom: 8 }}
                  />
                )
              default:
                return (
                  <BaseInput
                    type={fieldsConfig[i].type}
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    value={field.value}
                    onChangeText={inputHandler.bind(null, fieldsConfig[i].id)}
                    {...fieldsConfig[i].attrs}
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
