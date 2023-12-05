import { View, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { emailValidator, passwordValidator, shouldMatchValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { signUp } from '../../../store/user/user-actions'

const SignUpForm = () => {
  const dispatch = useAppDispatch()

  const onSubmitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(signUp({ email: fields[0].value, password: fields[1].value }))
    return res
  }

  return (
    <Form
      fieldsConfig={[
        {
          id: 'email',
          label: 'Email',
          errMsg: 'Email should be valid',
          validator: emailValidator,
          attrs: { autoCapitalize: 'none' }
        },
        {
          id: 'password',
          label: 'Password',
          errMsg: 'Password should contain at least 8 characters, 1 uppercase letter and at least 1 number',
          validator: passwordValidator,
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        },
        {
          id: 'check-password',
          label: 'Repeat password',
          errMsg: 'Passwords should match',
          validator: shouldMatchValidator,
          matchValidatorConfig: { id: 'password' },
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        }
      ]}
      formConfig={{
        submitText: 'Sign In',
        onSubmit: onSubmitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default SignUpForm
