import { View, Text } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import LoginForm from '../components/auth/LoginForm/LoginForm'

const Home = () => {
  return (
    <View style={ScreenStyles.screen}>
      <LoginForm />
    </View>
  )
}

export default Home
