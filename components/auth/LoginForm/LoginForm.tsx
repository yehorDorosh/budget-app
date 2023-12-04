import { View, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { emailValidator, passwordValidator } from '../../../utils/validators'

const LoginForm = () => {
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
        onSubmit: () => {
          console.log('Login')
        }
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default LoginForm
