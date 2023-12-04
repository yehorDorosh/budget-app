import { View, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { emailValidator, passwordValidator } from '../../../utils/validators'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { login } from '../../../store/user/user-actions'
import { FieldState } from '../../Form/Form'

const LoginForm = () => {
  const dispatch = useAppDispatch()

  const onSubmitHandler = (...fields: FieldState[]) => {
    dispatch(login({ email: fields[0].value, password: fields[1].value }))
  }

  return (
    <Form
      fieldsConfig={[
        {
          id: 'email',
          label: 'Email',
          errMsg: 'Password is required',
          validator: emailValidator,
          attrs: { autoCapitalize: 'none' }
        },
        {
          id: 'password',
          label: 'Password',
          errMsg: 'Password is required',
          validator: passwordValidator,
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        }
      ]}
      formConfig={{
        submitText: 'Login',
        onSubmit: onSubmitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default LoginForm
