import React, { Fragment } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { CategoryType, QueryFilter as Filter } from '../../../types/enums'
import Form from '../../Form/Form'
import useCategoryFilter from '../../../hooks/useCategoryFilter'
import { formatDateYearMonth } from '../../../utils/date'
import BaseButton from '../../ui/BaseButton'
import { FieldState } from '../../Form/Form'

const FilterBudgeForm = () => {
  const dispatch = useAppDispatch()
  const filterMonth = useAppSelector((state) => state.budgetItem.filters.month)!
  const filterYear = useAppSelector((state) => state.budgetItem.filters.year)!
  const filterType = useAppSelector((state) => state.budgetItem.filters.active)!
  const nameFilter = useAppSelector((state) => state.budgetItem.filters.name) || ''
  const categoryTypeFilter = useAppSelector((state) => state.budgetItem.filters.categoryType)!
  const categoryFilter = useAppSelector((state) => state.budgetItem.filters.category)!
  const ignoreFilter = useAppSelector((state) => state.budgetItem.filters.ignore)!
  const { categoryType, setCategoryType, filteredCategories } = useCategoryFilter(categoryTypeFilter)

  const setFilterHandler = (filter: Filter) => {
    dispatch(budgetItemActions.setActiveFilter(filter))
  }

  const filterChangeHandler = (fields: FieldState[]) => {
    const categoryType = fields[0].value
    const category = fields[1].value
    const name = fields[2].value
    const ignore = fields[3].value

    if (categoryType !== categoryTypeFilter) {
      dispatch(budgetItemActions.setFilterCategoryType(categoryType.toString()))
      dispatch(budgetItemActions.setFilterCategory(''))
      setCategoryType(categoryType as CategoryType)
    }

    if (+category !== categoryFilter) {
      dispatch(budgetItemActions.setFilterCategory(category.toString()))
    }

    if (name !== nameFilter) {
      dispatch(budgetItemActions.setFilterName(name.toString()))
    }

    if (ignore !== ignoreFilter) {
      dispatch(budgetItemActions.setFilterIgnore(!!ignore))
    }
  }

  const monthFilterHandler = (fields: FieldState[]) => {
    const date = fields[0].value
    const month = formatDateYearMonth(new Date(date.toString()))
    if (month !== filterMonth) {
      dispatch(budgetItemActions.setFilterMonth(month))
    }
  }

  const yearFilterHandler = (fields: FieldState[]) => {
    const year = fields[0].value
    if (year !== filterYear) {
      dispatch(budgetItemActions.setFilterYear(year.toString()))
    }
  }

  return (
    <ScrollView>
      <Form
        fieldsConfig={[
          {
            type: 'radio',
            id: 'categoryTypeExpenseFilter',
            label: 'Category Type',
            selectItems: [
              { label: 'All', value: '' },
              { label: 'Expense', value: CategoryType.EXPENSE },
              { label: 'Income', value: CategoryType.INCOME }
            ],
            defaultValue: categoryTypeFilter ? categoryTypeFilter : ''
          },
          {
            type: 'select',
            id: 'categoryFilter',
            label: 'Category',
            selectItems: filteredCategories,
            defaultValue: categoryFilter ? categoryFilter.toString() : '',
            notClearable: true
          },
          {
            type: 'text',
            id: 'name',
            label: 'Name',
            defaultValue: nameFilter
          },
          {
            type: 'checkbox',
            id: 'ignoreFilter',
            label: 'Ignore',
            defaultValue: ignoreFilter
          }
        ]}
        formConfig={{
          onChangeFields: filterChangeHandler
        }}
      />
      <Fragment>
        {filterType === Filter.MONTH && (
          <Fragment>
            <Form
              fieldsConfig={[
                {
                  type: 'text',
                  id: 'filterMonth',
                  label: 'Month',
                  attrs: { autoCapitalize: 'none', keyboardType: 'numeric', placeholder: 'YYYY-MM', editable: false },
                  defaultValue: filterMonth,
                  value: filterMonth
                }
              ]}
              formConfig={{
                onChangeFields: monthFilterHandler
              }}
            />
            <View style={styles.btnsDate}>
              <BaseButton mode="smallBtn" onPress={() => dispatch(budgetItemActions.decreaseMonth())}>
                Previous Month
              </BaseButton>
              <BaseButton mode="smallBtn" onPress={() => dispatch(budgetItemActions.increaseMonth())}>
                Next Month
              </BaseButton>
            </View>
          </Fragment>
        )}
        {filterType === Filter.YEAR && (
          <Fragment>
            <Form
              fieldsConfig={[
                {
                  type: 'text',
                  id: 'filterYear',
                  label: 'Year',
                  attrs: { autoCapitalize: 'none', keyboardType: 'numeric' },
                  defaultValue: filterYear,
                  value: filterYear
                }
              ]}
              formConfig={{
                onChangeFields: yearFilterHandler
              }}
            />
            <View style={styles.btnsDate}>
              <BaseButton style={[styles.btnDate]} mode="smallBtn" onPress={() => dispatch(budgetItemActions.decreaseYear())}>
                Previous Year
              </BaseButton>
              <BaseButton style={[styles.btnDate]} mode="smallBtn" onPress={() => dispatch(budgetItemActions.increaseYear())}>
                Next Year
              </BaseButton>
            </View>
          </Fragment>
        )}
      </Fragment>
      <View style={styles.btnsFilterType}>
        <BaseButton
          style={[styles.btnFilterType]}
          active={filterType === Filter.ALL}
          mode="smallBtn"
          onPress={() => dispatch(setFilterHandler.bind(null, Filter.ALL))}
        >
          Show all
        </BaseButton>
        <BaseButton
          style={[styles.btnFilterType]}
          active={filterType === Filter.YEAR}
          mode="smallBtn"
          onPress={() => dispatch(setFilterHandler.bind(null, Filter.YEAR))}
        >
          Show by year
        </BaseButton>
        <BaseButton
          style={[styles.btnFilterType]}
          active={filterType === Filter.MONTH}
          mode="smallBtn"
          onPress={() => dispatch(setFilterHandler.bind(null, Filter.MONTH))}
        >
          Show by month
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
  btnsFilterType: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnFilterType: {
    width: '30%'
  }
})

export default FilterBudgeForm
