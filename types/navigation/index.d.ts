import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DrawerNavigationProp } from '@react-navigation/drawer'

export type DrawerStackParamList = {
  Home: undefined
  // define other routes here
}

export type NativeStackParamList = {
  SendRestorePasswordEmail: undefined
}

export type HomeScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'Home'>

export type SendRestorePasswordEmailScreenNavigationProp = NativeStackNavigationProp<NativeStackParamList, 'SendRestorePasswordEmail'>
