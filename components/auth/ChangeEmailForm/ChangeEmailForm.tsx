import { View, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { updateUser } from '../../../store/user/user-actions'
import { emailValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useNavigation } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../../../types/navigation'

const ChangeEmailForm = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const token = useAppSelector((state) => state.user.token)

  if (!token) {
    navigation.navigate('Home')
    return null
  }

  const onSubmitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(updateUser({ token, payload: { email: fields[0].value.toString() } }))
    return res
  }

  return (
    <Form
      fieldsConfig={[
        {
          type: 'text',
          id: 'email',
          label: 'New Email',
          errMsg: 'Email should be valid',
          validator: emailValidator,
          attrs: { autoCapitalize: 'none', inputMode: 'email', autoCorrect: false }
        }
      ]}
      formConfig={{
        submitText: 'Change Email',
        onSubmit: onSubmitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default ChangeEmailForm
