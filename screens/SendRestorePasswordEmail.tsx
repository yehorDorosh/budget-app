import { View, Text, StyleSheet } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import SendRestorePasswordEmailForm from '../components/auth/SendRestorePasswordEmailForm/SendRestorePasswordEmailForm'

const SendRestorePasswordEmail = () => {
  return (
    <View style={ScreenStyles.screen}>
      <SendRestorePasswordEmailForm />
    </View>
  )
}

const styles = StyleSheet.create({})

export default SendRestorePasswordEmail
