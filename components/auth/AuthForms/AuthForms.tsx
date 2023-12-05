import { View, Text, StyleSheet } from 'react-native'
import LoginForm from '../LoginForm/LoginForm'
import SignUpForm from '../SignUpForm/SignUpForm'
import BaseButton from '../../ui/BaseButton'
import { useState } from 'react'

const AuthForms = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login')

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
  }
})

export default AuthForms
