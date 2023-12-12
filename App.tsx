import 'react-native-gesture-handler'
import { Fragment } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from './screens/Home'
import { Provider } from 'react-redux'
import store from './store'
import LogOutButton from './components/layout/header/LogOutButton'
import { decode, encode } from 'base-64'
import Profile from './screens/Profile'
import { useAppSelector } from './hooks/useReduxTS'
import SendRestorePasswordEmail from './screens/SendRestorePasswordEmail'
import Budget from './screens/Budget'
import Categories from './screens/Categories'

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
  const token = useAppSelector((state) => state.user.token)

  return (
    <Drawer.Navigator
      screenOptions={{
        headerRight: ({ tintColor }) => <LogOutButton tintColor={tintColor} />
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home'
        }}
      />
      {token && (
        <Drawer.Screen
          name="Budget"
          component={Budget}
          options={{
            title: 'Budget'
          }}
        />
      )}
      {token && (
        <Drawer.Screen
          name="Categories"
          component={Categories}
          options={{
            title: 'Categories'
          }}
        />
      )}
      {token && (
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Profile'
          }}
        />
      )}
    </Drawer.Navigator>
  )
}

export default function App() {
  return (
    <Fragment>
      <StatusBar style="auto" />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="SendRestorePasswordEmail" component={SendRestorePasswordEmail} options={{ title: 'Restore password' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </Fragment>
  )
}

const styles = StyleSheet.create({})
