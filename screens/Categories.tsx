import { View, Text, StyleSheet, ScrollView } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import AddCategoryFrom from '../components/categories/AddCategoryFrom/AddCategoryFrom'
import CategoriesList from '../components/categories/CategoriesList/CategoriesList'

const Categories = () => {
  const token = useRouteGuard()!

  return (
    <View style={[ScreenStyles.screen, styles.screen]}>
      <View style={styles.formContainer}>
        <AddCategoryFrom />
      </View>
      <View style={styles.listContainer}>
        <CategoriesList token={token} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  formContainer: {
    marginBottom: 8
  },
  listContainer: {
    flex: 1
  }
})

export default Categories
