import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import BaseCard from '../../ui/BaseCard'
import { getStatistics } from '../../../store/budget/budget-item-actions'
import { StatisticsPayload } from '../../../types/api'
import { View, Text, StyleSheet } from 'react-native'

const BudgetResult = () => {
  const dispatch = useAppDispatch()
  const onChangeBudgetItems = useAppSelector((state) => state.budgetItem.onChangeBudgetItems)
  const token = useAppSelector((state) => state.user.token)
  const filters = useAppSelector((state) => state.budgetItem.filters)
  const [statistics, setStatistics] = useState<StatisticsPayload>()
  const fetchStatistics = async (token: string) => {
    const res = await dispatch(getStatistics({ token }))

    if (res.data.payload) {
      setStatistics(res.data.payload)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStatistics(token)
    }
  }, [token, dispatch, filters.year, filters.active, filters.month, onChangeBudgetItems])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (token) {
      timer = setTimeout(async () => {
        fetchStatistics(token)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [filters.name])

  if (!statistics) return null

  return (
    <BaseCard>
      <View style={styles.container}>
        <View style={styles.summary}>
          <Text style={styles.tableTitle}>Summary</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text>Category</Text>
              <Text>Value</Text>
            </View>
            <View style={styles.row}>
              <Text>Income</Text>
              <Text>{statistics.incomes}</Text>
            </View>
            <View style={styles.row}>
              <Text>Expenses</Text>
              <Text>{statistics.expenses}</Text>
            </View>
            <View style={styles.row}>
              <Text>Total</Text>
              <Text>{statistics.sum}</Text>
            </View>
          </View>
        </View>
        <View style={styles.byCategories}>
          <Text style={styles.tableTitle}>Most Expenses</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text>Name</Text>
              <Text>Value</Text>
            </View>

            {statistics.categoriesRates.map((category) => {
              return (
                <View key={category.name} style={styles.row}>
                  <Text>{category.name}</Text>
                  <Text>{category.sum}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </BaseCard>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summary: {
    width: '48%'
  },
  byCategories: {
    width: '48%'
  },
  tableTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  table: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  }
})

export default BudgetResult
