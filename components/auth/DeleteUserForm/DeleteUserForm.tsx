import { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { deleteUser } from '../../../store/user/user-actions'
import { notEmptyValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useNavigation } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../../../types/navigation'
import { userActions } from '../../../store/user/user-slice'

const DeleteUserForm = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const token = useAppSelector((state) => state.user.token)
  const [userSuccessfullyDeleted, setUserSuccessfullyDeleted] = useState(false)

  if (!token) {
    navigation.navigate('Home')
    return null
  }

  const onSubmitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(deleteUser({ token, password: fields[0].value }))
    if (res.status === 200) {
      dispatch(userActions.logout())
    }
    return res
  }

  useEffect(() => {
    if (userSuccessfullyDeleted) {
      navigation.navigate('Home')
    }
  }, [userSuccessfullyDeleted])

  return (
    <Form
      fieldsConfig={[
        {
          id: 'password',
          label: 'Password',
          errMsg: 'Password is required',
          validator: notEmptyValidator,
          attrs: { autoCapitalize: 'none', secureTextEntry: true, autoCorrect: false }
        }
      ]}
      formConfig={{
        submitText: 'Delete Account',
        onSubmit: onSubmitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default DeleteUserForm
