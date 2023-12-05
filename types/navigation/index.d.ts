import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type RootStackParamList = {
  Home: undefined
  // define other routes here
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
