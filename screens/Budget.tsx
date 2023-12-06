import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import { useAppDispatch } from '../hooks/useReduxTS'
import { getBudgetItems } from '../store/budget/budget-item-actions'
import { BudgetItem } from '../store/budget/budget-item-slice'

const Budget = () => {
  const token = useRouteGuard()!
  const dispatch = useAppDispatch()
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])

  useEffect(() => {
    const getBudgetItemsAsync = async () => {
      const { data, status } = await dispatch(getBudgetItems({ token }))

      if (status === 200) {
        setBudgetItems(data.payload.budgetItems)
      }
    }

    if (token) {
      getBudgetItemsAsync()
    }
  }, [token])

  return (
    <View style={ScreenStyles.screen}>
      <Text>Budget</Text>
      {budgetItems.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({})

export default Budget
