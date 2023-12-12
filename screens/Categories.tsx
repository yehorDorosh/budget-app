import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import AddCategoryFrom from '../components/categories/AddCategoryFrom/AddCategoryFrom'

const Categories = () => {
  const token = useRouteGuard()!

  return (
    <View style={ScreenStyles.screen}>
      <AddCategoryFrom />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Categories
