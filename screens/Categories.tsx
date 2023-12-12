import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'

const Categories = () => {
  const token = useRouteGuard()!

  return (
    <View style={ScreenStyles.screen}>
      <Text>Categories</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Categories
