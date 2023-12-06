import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import { useAppSelector } from '../hooks/useReduxTS'
import ChangeEmailForm from '../components/auth/ChangeEmailForm/ChangeEmailForm'
import ChangePasswordForm from '../components/auth/ChangePasswordForm/ChangePasswordForm'
import DeleteUserForm from '../components/auth/DeleteUserForm/DeleteUserForm'
import BaseButton from '../components/ui/BaseButton'

const Profile = () => {
  const user = useAppSelector((state) => state.user)
  const [activeForm, setActiveForm] = useState<'email' | 'password' | 'delete' | null>(null)
  return (
    <View style={ScreenStyles.screen}>
      <Text>
        email: <Text>{user.email}</Text>
      </Text>
      <View>
        <BaseButton style={[styles.btn]} active={activeForm === 'email'} onPress={() => setActiveForm('email')}>
          Change Email
        </BaseButton>
        <BaseButton style={[styles.btn]} active={activeForm === 'password'} onPress={() => setActiveForm('password')}>
          Change Password
        </BaseButton>
        <BaseButton style={[styles.btn]} active={activeForm === 'delete'} onPress={() => setActiveForm('delete')}>
          Delete Account
        </BaseButton>
      </View>
      {activeForm === 'email' && <ChangeEmailForm />}
      {activeForm === 'password' && <ChangePasswordForm />}
      {activeForm === 'delete' && <DeleteUserForm />}
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 8
  }
})

export default Profile
