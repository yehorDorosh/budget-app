import { View, Text, StyleSheet } from 'react-native'
import { FC } from 'react'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { isDateValid, formatDateYearMonthDay } from '../../../utils/date'
import { FieldState } from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { addBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType } from '../../../types/enums'

const AddBudgetItemForm = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)

  const categories = ['Food', 'Transportation', 'Entertainment', 'Other']

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
          defaultValue: CategoryType.EXPENSE
        },
        {
          id: 'name',
          label: 'Name',
          errMsg: 'Name should be valid',
          validator: notEmptyValidator
        },
        {
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
          selectItems: [
            { label: 'Food', value: '1' },
            { label: 'Transportation', value: '2' },
            { label: 'Entertainment', value: '3' },
            { label: 'Other', value: '4' }
          ]
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
        onSubmit: submitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default AddBudgetItemForm
