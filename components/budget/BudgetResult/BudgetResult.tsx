import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import BaseCard from '../../ui/BaseCard'
import { getStatistics } from '../../../store/budget/budget-item-actions'
import { StatisticsPayload } from '../../../types/api'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

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
              <Text style={[styles.text, styles.th]}>Category</Text>
              <Text style={[styles.text, styles.th]}>Value</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Income</Text>
              <Text style={styles.text}>{statistics.incomes}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Expenses</Text>
              <Text style={styles.text}>{statistics.expenses}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Total</Text>
              <Text style={styles.text}>{statistics.sum}</Text>
            </View>
          </View>
        </View>
        <View style={styles.byCategories}>
          <Text style={styles.tableTitle}>Most Expenses</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.text, styles.th]}>Name</Text>
              <Text style={[styles.text, styles.th]}>Value</Text>
            </View>

            <ScrollView>
              {statistics.categoriesRates.map((category, i) => {
                return (
                  <View key={category.name} style={styles.row}>
                    <Text style={[styles.text, styles.label]}>
                      {i + 1} {category.name}
                    </Text>
                    <Text style={styles.text}>{category.sum}</Text>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </BaseCard>
  )
}

const styles = StyleSheet.create({
  container: {},
  summary: {
    marginBottom: 22
  },
  byCategories: {},
  tableTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  th: {
    fontWeight: 'bold'
  },
  table: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },
  text: {
    fontSize: 18
  },
  label: {
    maxWidth: '60%'
  }
})

export default BudgetResult
