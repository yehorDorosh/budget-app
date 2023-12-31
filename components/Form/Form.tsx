import { FC, useReducer, Reducer, useEffect, useRef, useCallback, useState } from 'react'
import { View, Text, StyleSheet, TextInputProps, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import BaseCard from '../ui/BaseCard'
import { ValidationError } from '../../types/api'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { arraysAreEqual, objectAreEqual } from '../../utils/comparator'
import AutocompleteInput from '../ui/AutocompleteInput'
import SelectInput from '../ui/SelectInput'
import CheckboxInput from '../ui/CheckboxInput'
import DateInput from '../ui/DateInput'
import Colors from '../../styles/Colors'

export interface FieldState {
  value: string | boolean
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
  type: 'text' | 'select' | 'date' | 'radio' | 'checkbox' | 'autocomplete'
  id: string
  label?: string
  defaultValue?: string | boolean
  errMsg?: string
  attrs?: TextInputProps
  validator?: (value: string, matchValue?: string) => boolean
  matchValidatorConfig?: { id: string }
  selectItems?: { label: string; value: string }[]
  notClearable?: boolean
  value?: string | boolean
  dataList?: string[]
}

interface FormConfig {
  submitText?: string
  onSubmit?: (...args: FieldState[]) => Promise<{ data: { errMsg?: string; validationErrors?: ValidationError[] }; status: number | null }>
  errMsg?: string
  onChangeFields?: (fields: FieldState[]) => void
}

type FieldsAction =
  | { type: 'CHANGE'; id: string; value: string | boolean; fieldsConfig: FieldConfig[] }
  | { type: 'CHECK_ALL'; fieldsConfig: FieldConfig[] }
  | { type: 'CLEAR_ALL'; fieldsConfig: FieldConfig[] }
  | { type: 'SET_DEFAULT'; fieldsConfig: FieldConfig[] }
  | { type: 'RESET_TOUCH'; id: string; fieldsConfig: FieldConfig[] }
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
      field.value = typeof action.value === 'string' ? action.value : action.value
      field.isTouched = true
      const matchValue = state.find((_, i) => action.fieldsConfig[i].id === action.fieldsConfig[index].matchValidatorConfig?.id)?.value
      field.isValid = validator ? validator(action.value.toString(), matchValue?.toString()) : true
      prevFields[index] = field
      return prevFields
    case 'CHECK_ALL':
      return state.map((field, index) => {
        const validator = action.fieldsConfig[index].validator
        const matchValue = state.find((_, i) => action.fieldsConfig[i].id === action.fieldsConfig[index].matchValidatorConfig?.id)?.value
        field.isValid = validator
          ? validator(field.value.toString(), matchValue?.toString()) && (field.isTouched || !!action.fieldsConfig[index].defaultValue)
          : true
        return field
      })
    case 'CLEAR_ALL':
      return state.map((field, i) => {
        if (action.fieldsConfig[i].type === 'radio' || action.fieldsConfig[i].notClearable) return field
        field.value = ''
        field.isValid = true
        field.isTouched = false
        return field
      })
    case 'SET_DEFAULT':
      return state.map((field, i) => {
        field.value = action.fieldsConfig[i].defaultValue || ''
        return field
      })
    case 'RESET_TOUCH':
      const clearIndex = action.fieldsConfig.findIndex((field) => field.id === action.id)
      const clearField = state[clearIndex]
      clearField.isTouched = false
      action.fieldsConfig[clearIndex].defaultValue = ''
      prevFields[clearIndex] = clearField
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
  const prevFieldsConfig = useRef(fieldsConfig) // use to get previous fieldsConfig for useEffect
  const defaultFields: FieldState[] = setupFields(fieldsConfig)
  const [enableScroll, setEnableScroll] = useState(true)

  const [fields, dispatchFields] = useReducer(reducerFields, defaultFields)
  const [form, dispatchForm] = useReducer(reducerForm, {
    formIsValid: true,
    formIsTouched: false,
    formIsSubmitted: false,
    isLoading: false
  })

  const inputHandler = useCallback((id: string, value: string) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value, fieldsConfig })
  }, [])

  const selectHandler = useCallback((id: string, value: string, index: number) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value, fieldsConfig })
  }, [])

  const checkboxHandler = useCallback((id: string, value: boolean) => {
    dispatchForm({ type: 'TOUCHED' })
    dispatchFields({ type: 'CHANGE', id, value, fieldsConfig })
  }, [])

  const submitHandler = () => {
    dispatchFields({ type: 'CHECK_ALL', fieldsConfig })
    dispatchForm({ type: 'SUBMITTING', fields, fieldsConfig })
  }

  useEffect(() => {
    if (form.formIsSubmitted) dispatchForm({ type: 'RESET' })
    const formValidationOn = fieldsConfig.some((field) => !!field.validator)

    if (form.formIsValid && (form.formIsTouched || !formValidationOn) && form.formIsSubmitted) {
      dispatchForm({ type: 'LOADING', isLoading: true })

      formConfig.onSubmit?.(...fields).then((res) => {
        dispatchForm({ type: 'LOADING', isLoading: false })

        if (res.status === 422) {
          const errMsg = res.data.validationErrors
            ? res.data.validationErrors.map((err) => `${err.path} ${err.msg}`).join('\n')
            : 'Server validation error'
          dispatchForm({ type: 'ERR_MSG', errMsg })
        } else if (res.status === null && res.data && res.data.errMsg) {
          Alert.alert('Error', res.data.errMsg, [{ text: 'OK' }])
        } else if (res.status !== 401) {
          dispatchFields({ type: 'CLEAR_ALL', fieldsConfig })
        }
      })
    }
  }, [form.formIsSubmitted])

  // Clear select fields when selectItems was changed
  useEffect(() => {
    fields.forEach((_, i) => {
      const prevSelectItems = prevFieldsConfig.current[i].selectItems
      const currSelectItems = fieldsConfig[i].selectItems
      // For fields with type 'select' and selectItems was changed, set isTouch to false and clear defaultValue
      if (fieldsConfig[i].selectItems && fieldsConfig[i].type === 'select' && !arraysAreEqual(prevSelectItems, currSelectItems)) {
        dispatchFields({ type: 'RESET_TOUCH', id: fieldsConfig[i].id, fieldsConfig })
      }
    })
  }, [...fieldsConfig.map((field) => field.selectItems)])

  // Call onChangeFields when some of fields was changed
  useEffect(() => {
    formConfig.onChangeFields?.(fields)
  }, [...fields.map((field) => field.value)])

  useEffect(() => {
    const timer = setTimeout(() => {
      fields.forEach((field, i) => {
        const prevValue = field.value
        const currValue = fieldsConfig[i].value
        const isDifferent =
          Array.isArray(prevValue) && Array.isArray(currValue)
            ? !arraysAreEqual(prevValue, currValue)
            : typeof prevValue === 'object' && typeof currValue === 'object'
              ? !objectAreEqual(prevValue, currValue)
              : prevValue !== currValue
        if (fieldsConfig[i].value && currValue !== undefined && isDifferent) {
          dispatchFields({ type: 'CHANGE', id: fieldsConfig[i].id, value: currValue, fieldsConfig })
        }
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [...fieldsConfig.map((field) => field.value)])

  return (
    <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={enableScroll}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-200}>
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
                if (typeof field.value === 'boolean') return null
                return (
                  <SelectInput
                    selectItems={fieldsConfig[i].selectItems ?? []}
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    value={field.value}
                    onChangeSelect={selectHandler.bind(null, fieldsConfig[i].id)}
                  />
                )
              case 'checkbox':
                if (field.value === undefined) return null
                return (
                  <CheckboxInput
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    isChecked={field.value as unknown as boolean}
                    onChangeCheckbox={checkboxHandler.bind(null, fieldsConfig[i].id)}
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
                    tintColor={Colors.segmentControl.activeBg}
                    backgroundColor={Colors.segmentControl.bg}
                    fontStyle={{ color: Colors.segmentControl.text }}
                    activeFontStyle={{ color: Colors.segmentControl.activeText }}
                  />
                )
              case 'autocomplete':
                if (typeof field.value === 'boolean') return null
                return (
                  <AutocompleteInput
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    value={field.value}
                    dataList={fieldsConfig[i].dataList ?? []}
                    onDataListItemPress={inputHandler.bind(null, fieldsConfig[i].id)}
                    onChangeText={inputHandler.bind(null, fieldsConfig[i].id)}
                    scrollSwitch={(value) => setEnableScroll(value)}
                    {...fieldsConfig[i].attrs}
                  />
                )
              case 'date':
                if (typeof field.value === 'boolean') return null
                return (
                  <DateInput
                    key={fieldsConfig[i].id}
                    label={fieldsConfig[i].label}
                    isValid={field.isValid}
                    errMsg={fieldsConfig[i].errMsg}
                    value={field.value}
                    onChangeText={inputHandler.bind(null, fieldsConfig[i].id)}
                    {...fieldsConfig[i].attrs}
                  />
                )
              default:
                if (typeof field.value === 'boolean') return null
                return (
                  <BaseInput
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
          {formConfig.submitText && formConfig.onSubmit && <BaseButton onPress={submitHandler}>{formConfig.submitText}</BaseButton>}
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
