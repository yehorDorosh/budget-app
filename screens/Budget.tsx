import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import BudgetItemsList from '../components/budget/BudgetItemsList/BudgetItemsList'

const Budget = () => {
  const token = useRouteGuard()!

  return (
    <View style={ScreenStyles.screen}>
      <Text>Budget</Text>
      <BudgetItemsList token={token} />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Budget
