import React, { FC, useEffect } from 'react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { getMonthlyTrend } from '../../../store/budget/budget-item-actions'
import { Months } from '../../../types/enums'
import BaseCard from '../../ui/BaseCard'
import { MonthlyTrendPayload } from '../../../types/api'
import Form from '../../Form/Form'
import { FieldState } from '../../Form/Form'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import BaseButton from '../../ui/BaseButton'

interface Props {
  token: string
}

const screenWidth = Dimensions.get('window').width

const MonthsTrend: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const onChangeBudgetItems = useAppSelector((state) => state.budgetItem.onChangeBudgetItems)
  const [year, setYear] = useState(new Date().getFullYear())
  const [payload, setPayload] = useState<MonthlyTrendPayload>({
    aveExpenses: null,
    aveIncomes: null,
    aveSaved: null,
    totalSaved: null,
    monthlyExpenses: [],
    monthlyIncomes: [],
    maxTotal: null
  })

  const { aveExpenses, aveIncomes, aveSaved, totalSaved, maxTotal, monthlyExpenses, monthlyIncomes } = payload
  const max = maxTotal !== null ? +maxTotal : 0
  const averageYearExpenses = aveExpenses !== null ? +aveExpenses : 0
  const averageYearIncomes = aveIncomes !== null ? +aveIncomes : 0
  const expensesByMonth: number[] = Array.from({ length: 12 }, () => 0)
  const incomesByMonth: number[] = Array.from({ length: 12 }, () => 0)

  monthlyExpenses.forEach((_) => {
    expensesByMonth[+_.month] = +_.total
  })

  monthlyIncomes.forEach((_) => {
    incomesByMonth[+_.month] = +_.total
  })

  const totalExpenses = expensesByMonth.reduce((acc, curr) => acc + curr, 0).toFixed(2)
  const totalIncomes = incomesByMonth.reduce((acc, curr) => acc + curr, 0).toFixed(2)

  const yearHandler = (fields: FieldState[]) => {
    const year = fields[0].value
    setYear(Number(year))
  }

  useEffect(() => {
    const fetchMonthlyTrend = async () => {
      if (token) {
        const res = await dispatch(getMonthlyTrend({ token, year: year.toString() }))

        if (res.data.payload) {
          setPayload(res.data.payload)
        }
      }
    }
    fetchMonthlyTrend()
  }, [year, token, dispatch, onChangeBudgetItems])

  return (
    <ScrollView>
      <View>
        <Text>Average Expenses: {averageYearExpenses}</Text>
        <Text>Average Income: {averageYearIncomes}</Text>
        <Text>Average Saved: {aveSaved}</Text>
        <Text>Total saved: {totalSaved}</Text>
        <Text>Total Expenses: {totalExpenses}</Text>
        <Text>Total Income: {totalIncomes}</Text>
      </View>
      <View style={styles.trendContainer}>
        {expensesByMonth.map((value, i) => (
          <View key={i} style={styles.column}>
            <Text style={[styles.value, styles.expense]} numberOfLines={1} ellipsizeMode="tail">
              {value.toFixed(2)}
            </Text>
            <Text style={[styles.value, styles.income]} numberOfLines={1} ellipsizeMode="tail">
              {incomesByMonth[i].toFixed(2)}
            </Text>
            <Text
              style={[styles.value, incomesByMonth[i] - value < 0 ? styles.expense : styles.income]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(incomesByMonth[i] - value).toFixed(2)}
            </Text>
            <View style={styles.columnTrend}>
              <View style={[styles.fill, styles.expenseTrend, { top: `${max ? 100 - (value * 100) / max : 100}%` }]}></View>
              <View
                style={[styles.fill, styles.averageExpenses, { top: `${max ? 100 - (averageYearExpenses * 100) / max : 100}%` }]}
              ></View>
              <View style={[styles.fill, styles.incomesTrend, { top: `${max ? 100 - (incomesByMonth[i] * 100) / max : 100}%` }]}></View>
              <View style={[styles.fill, styles.averageIncomes, { top: `${max ? 100 - (averageYearIncomes * 100) / max : 100}%` }]}></View>
            </View>
            <Text style={styles.month} numberOfLines={1} ellipsizeMode="tail">
              {Months[i]}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <Form
          fieldsConfig={[
            {
              type: 'text',
              id: 'filterYear',
              label: 'Year',
              attrs: { autoCapitalize: 'none', keyboardType: 'numeric' },
              defaultValue: year.toString(),
              value: year.toString()
            }
          ]}
          formConfig={{
            onChangeFields: yearHandler
          }}
        />
      </View>
      <View style={styles.btnsDate}>
        <BaseButton style={[styles.btnDate]} mode="smallBtn" onPress={() => setYear((prev) => prev - 1)}>
          Previous Year
        </BaseButton>
        <BaseButton style={[styles.btnDate]} mode="smallBtn" onPress={() => setYear((prev) => prev + 1)}>
          Next Year
        </BaseButton>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  btnsDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  btnDate: {
    width: '48%'
  },
  trendContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  column: {
    width: '16%',
    boxSizing: 'border-box',
    padding: 4,
    flexDirection: 'column',
    minWidth: 50,
    height: 170
  },
  value: {
    marginBottom: 0,
    fontSize: screenWidth * 0.03
  },
  expense: {
    color: 'red'
  },
  income: {
    color: 'blue'
  },
  columnTrend: {
    position: 'relative',
    borderWidth: 1,
    flexGrow: 1
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  expenseTrend: {
    backgroundColor: 'red',
    right: '50%'
  },
  incomesTrend: {
    backgroundColor: 'blue',
    left: '50%'
  },
  averageExpenses: {
    borderTopWidth: 1,
    right: '50%'
  },
  averageIncomes: {
    borderTopWidth: 1,
    left: '50%'
  },
  month: {
    marginTop: 4,
    fontSize: screenWidth * 0.023
  }
})

export default MonthsTrend
