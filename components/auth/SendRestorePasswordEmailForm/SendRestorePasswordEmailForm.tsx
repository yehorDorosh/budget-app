import { Fragment, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { emailValidator } from '../../../utils/validators'
import { getRestoreEmail } from '../../../store/user/user-actions'
import { useAppDispatch } from '../../../hooks/useReduxTS'

const SendRestorePasswordEmailForm = () => {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch()

  const onSubmitHandler = async (...fields: any[]) => {
    const res = await dispatch(getRestoreEmail({ email: fields[0].value }))
    if (res.status === 200) {
      setEmail(fields[0].value)
    }
    return res
  }

  if (email) {
    return <Text>The email with instructions on how to reset your password was sent to the email address {email}</Text>
  }

  return (
    <Fragment>
      <Form
        fieldsConfig={[
          {
            type: 'text',
            id: 'email',
            label: 'Email',
            errMsg: 'Email should be valid',
            validator: emailValidator,
            attrs: { autoCapitalize: 'none' }
          }
        ]}
        formConfig={{
          submitText: 'Send Email with Restore Password Link',
          onSubmit: onSubmitHandler
        }}
      />
    </Fragment>
  )
}

const styles = StyleSheet.create({})

export default SendRestorePasswordEmailForm
