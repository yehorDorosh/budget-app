import 'react-native-gesture-handler'
import { Fragment } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from './screens/Home'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Add a new Budget item'
        }}
      />
    </Drawer.Navigator>
  )
}

export default function App() {
  return (
    <Fragment>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
