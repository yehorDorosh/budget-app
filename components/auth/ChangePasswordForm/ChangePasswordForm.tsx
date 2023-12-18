import { StyleSheet, Alert } from 'react-native'
import Form from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { updateUser } from '../../../store/user/user-actions'
import { passwordValidator, shouldMatchValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useNavigation } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../../../types/navigation'

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const token = useAppSelector((state) => state.user.token)

  if (!token) {
    navigation.navigate('Home')
    return null
  }

  const onSubmitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(updateUser({ token, payload: { password: fields[0].value.toString() } }))
    if (res.status === 200) {
      Alert.alert('Success', 'Password changed successfully')
    }
    return res
  }

  return (
    <Form
      fieldsConfig={[
        {
          type: 'text',
          id: 'password',
          label: 'New password',
          errMsg: 'Password should contain at least 8 characters, 1 uppercase letter and at least 1 number',
          validator: passwordValidator,
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        },
        {
          type: 'text',
          id: 'check-password',
          label: 'Repeat password',
          errMsg: 'Passwords should match',
          validator: shouldMatchValidator,
          matchValidatorConfig: { id: 'password' },
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        }
      ]}
      formConfig={{
        submitText: 'Change Password',
        onSubmit: onSubmitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default ChangePasswordForm
