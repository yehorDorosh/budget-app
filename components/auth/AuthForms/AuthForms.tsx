import { View, Text, StyleSheet } from 'react-native'
import LoginForm from '../LoginForm/LoginForm'
import SignUpForm from '../SignUpForm/SignUpForm'
import BaseButton from '../../ui/BaseButton'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SendRestorePasswordEmailScreenNavigationProp } from '../../../types/navigation'
import { ColorsCodes } from '../../../styles/Colors'

const AuthForms = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login')
  const navigation = useNavigation<SendRestorePasswordEmailScreenNavigationProp>()

  return (
    <View>
      <View style={styles.buttons}>
        <BaseButton mode="link" onPress={() => setActiveForm('login')} active={activeForm === 'login'}>
          Login
        </BaseButton>
        <Text style={styles.slash}> / </Text>
        <BaseButton mode="link" onPress={() => setActiveForm('signup')} active={activeForm === 'signup'}>
          Sign Up
        </BaseButton>
      </View>
      {activeForm === 'login' && <LoginForm />}
      {activeForm === 'signup' && <SignUpForm />}
      <Text style={styles.link} onPress={() => navigation.navigate('SendRestorePasswordEmail')}>
        Forgot password?
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16
  },
  slash: {
    textAlign: 'center',
    fontSize: 24
  },
  link: { textAlign: 'center', textDecorationLine: 'underline', color: ColorsCodes.grey }
})

export default AuthForms
