import { StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { deleteUser } from '../../../store/user/user-actions'
import { notEmptyValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { userActions } from '../../../store/user/user-slice'

const DeleteUserForm = () => {
  const dispatch = useAppDispatch()

  const token = useAppSelector((state) => state.user.token)!

  const onSubmitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(deleteUser({ token, password: fields[0].value.toString() }))
    if (res.status === 200) {
      dispatch(userActions.logout())
    }
    return res
  }

  return (
    <Form
      fieldsConfig={[
        {
          type: 'text',
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
