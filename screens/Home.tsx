import { View, Text } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import LoginForm from '../components/auth/LoginForm/LoginForm'
import { useAppSelector } from '../hooks/useReduxTS'
import SignUpForm from '../components/auth/SignUpForm/SignUpForm'
import AuthForms from '../components/auth/AuthForms/AuthForms'

const Home = () => {
  const user = useAppSelector((state) => state.user)

  return (
    <View style={ScreenStyles.screen}>
      {user && <Text>{user.email}</Text>}
      {user && <Text>{user.token}</Text>}
      {!user.token && <AuthForms />}
    </View>
  )
}

export default Home
