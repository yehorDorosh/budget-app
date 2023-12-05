import 'react-native-gesture-handler'
import { Fragment } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from './screens/Home'
import { Provider } from 'react-redux'
import store from './store'
import LogOutButton from './components/layout/header/LogOutButton'
import { decode, encode } from 'base-64'
import Profile from './screens/Profile'

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
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
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile'
        }}
      />
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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </Fragment>
  )
}

const styles = StyleSheet.create({})
