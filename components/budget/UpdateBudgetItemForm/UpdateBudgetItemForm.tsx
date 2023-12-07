import { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BudgetItem } from '../../../store/budget/budget-item-slice'

interface Props {
  token: string
  currentBudgetItem: BudgetItem
  onSave: (budgetItem: BudgetItem) => void
}

const UpdateBudgetItemForm: FC<Props> = () => {
  return (
    <View>
      <Text>UpdateBudgetItemForm</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default UpdateBudgetItemForm
