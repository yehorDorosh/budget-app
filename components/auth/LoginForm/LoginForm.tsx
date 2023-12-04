import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { emailValidator, passwordValidator } from '../../../utils/validators'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { login } from '../../../store/user/user-actions'
import { FieldState } from '../../Form/Form'

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const [formError, setFormError] = useState<string | undefined>()

  const onSubmitHandler = async (...fields: FieldState[]) => {
    setFormError(undefined)
    const res = await dispatch(login({ email: fields[0].value, password: fields[1].value }))
    if (res.status === 401) {
      setFormError('Invalid email or password')
    } else if (res.status === 200) {
      console.log('Login success')
    }

    return res
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
        onSubmit: onSubmitHandler,
        errMsg: formError
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default LoginForm
