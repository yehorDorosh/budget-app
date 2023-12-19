import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DrawerNavigationProp } from '@react-navigation/drawer'

export type DrawerStackParamList = {
  BudgetListScreen: undefined
  BudgetScreen: undefined
  Categories: undefined
  Home: undefined
  MonthlyTrendScreen: undefined
  Profile: undefined
  // define other routes here
}

export type NativeStackParamList = {
  SendRestorePasswordEmail: undefined
  DrawerNavigation: undefined
}

export type BudgetListScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'BudgetListScreen'>
export type BudgetScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'BudgetScreen'>
export type CategoriesScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'Categories'>
export type HomeScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'Home'>
export type MonthlyTrendScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'MonthlyTrendScreen'>
export type ProfileScreenNavigationProp = DrawerNavigationProp<DrawerStackParamList, 'Profile'>

export type SendRestorePasswordEmailScreenNavigationProp = NativeStackNavigationProp<NativeStackParamList, 'SendRestorePasswordEmail'>
