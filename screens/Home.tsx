import { View, Text } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import LoginForm from '../components/auth/LoginForm/LoginForm'
import { useAppSelector } from '../hooks/useReduxTS'

const Home = () => {
  const user = useAppSelector((state) => state.user)

  return (
    <View style={ScreenStyles.screen}>
      {user && <Text>{user.email}</Text>}
      <LoginForm />
    </View>
  )
}

export default Home
