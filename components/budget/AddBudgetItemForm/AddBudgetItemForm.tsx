import { View, Text, StyleSheet } from 'react-native'
import { FC, useEffect, useState, useCallback } from 'react'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { isDateValid, formatDateYearMonthDay } from '../../../utils/date'
import { FieldState } from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { addBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType } from '../../../types/enums'
import { getCategories } from '../../../store/categories/categories-actions'
import { Category } from '../../../store/categories/categories-slice'

const AddBudgetItemForm = () => {
  const dispatch = useAppDispatch()
  const defaultCategoryType = CategoryType.EXPENSE
  const filterCategories = (categories: Category[], categoryType: CategoryType) => {
    return [
      { label: 'Select or create category', value: '' },
      ...categories
        .filter((category) => category.categoryType === categoryType)
        .map((category) => ({ label: category.name, value: category.id.toString() }))
    ]
  }

  const user = useAppSelector((state) => state.user)
  const categories = useAppSelector((state) => state.categories.categories)
  const [selectList, setSelectList] = useState<{ label: string; value: string }[]>(filterCategories(categories, defaultCategoryType))
  const [categoryType, setCategoryType] = useState<CategoryType>(defaultCategoryType)

  const submitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(
      addBudgetItem({
        token: user.token!,
        categoryId: +fields[2].value,
        name: fields[0].value,
        value: +fields[1].value,
        userDate: fields[3].value
      })
    )

    return res
  }

  const formChangeHandler = (fields: FieldState[]) => {
    const value = fields[0].value
    if (value !== categoryType) {
      setCategoryType(value as CategoryType)
    }
  }

  useEffect(() => {
    const prepare = async () => {
      if (user.token) {
        await dispatch(getCategories({ token: user.token }))
      }
    }

    prepare()
  }, [user.token])

  useEffect(() => {
    setSelectList(filterCategories(categories, categoryType))
  }, [categories, categoryType])

  return (
    <Form
      fieldsConfig={[
        {
          type: 'radio',
          id: 'categoryType',
          label: 'Category Type',
          selectItems: [
            { label: 'Expense', value: CategoryType.EXPENSE },
            { label: 'Income', value: CategoryType.INCOME }
          ],
          defaultValue: defaultCategoryType
        },
        {
          type: 'text',
          id: 'name',
          label: 'Name',
          errMsg: 'Name should be valid',
          validator: notEmptyValidator
        },
        {
          type: 'text',
          id: 'amount',
          label: 'Amount',
          errMsg: 'Amount should be valid',
          validator: notEmptyValidator,
          attrs: { autoCapitalize: 'none', keyboardType: 'numeric' }
        },
        {
          type: 'select',
          id: 'category',
          label: 'Category',
          errMsg: 'Category should be valid',
          validator: notEmptyValidator,
          selectItems: selectList,
          defaultValue: ''
        },
        {
          type: 'date',
          id: 'date',
          label: 'Date',
          errMsg: 'Date should be valid',
          validator: isDateValid,
          defaultValue: formatDateYearMonthDay(new Date()),
          attrs: { autoCapitalize: 'none' }
        }
      ]}
      formConfig={{
        submitText: 'Add',
        onSubmit: submitHandler,
        onChangeFields: formChangeHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default AddBudgetItemForm
