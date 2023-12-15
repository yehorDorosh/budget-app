import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { isDateValid } from '../../../utils/date'
import { CategoryType } from '../../../types/enums'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { FieldState } from '../../Form/Form'
import { updateBudgetItem } from '../../../store/budget/budget-item-actions'
import useCategoryFilter from '../../../hooks/useCategoryFilter'

interface Props {
  token: string
  currentBudgetItem: BudgetItem
  onSave: (budgetItem: BudgetItem) => void
}

const UpdateBudgetItemForm: FC<Props> = ({ token, currentBudgetItem, onSave }) => {
  const dispatch = useAppDispatch()
  const { categoryType, setCategoryType, defaultCategoryType, filteredCategories } = useCategoryFilter(
    currentBudgetItem.category.categoryType
  )

  const submitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(
      updateBudgetItem({
        id: currentBudgetItem.id,
        token: token,
        categoryId: +fields[3].value,
        name: fields[1].value,
        value: +fields[2].value,
        userDate: fields[4].value,
        ignore: currentBudgetItem.ignore
      })
    )

    onSave(res.data.payload.budgetItem)

    return res
  }

  const formChangeHandler = (fields: FieldState[]) => {
    const value = fields[0].value
    if (value !== categoryType) {
      setCategoryType(value as CategoryType)
    }
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
          defaultValue: defaultCategoryType ? defaultCategoryType : ''
        },
        {
          type: 'text',
          id: 'name',
          label: 'Name',
          errMsg: 'Name should be valid',
          validator: notEmptyValidator,
          defaultValue: currentBudgetItem.name
        },
        {
          type: 'text',
          id: 'amount',
          label: 'Amount',
          errMsg: 'Amount should be valid',
          validator: notEmptyValidator,
          attrs: { autoCapitalize: 'none', keyboardType: 'numeric' },
          defaultValue: currentBudgetItem.value.toString()
        },
        {
          type: 'select',
          id: 'category',
          label: 'Category',
          errMsg: 'Category should be valid',
          validator: notEmptyValidator,
          selectItems: filteredCategories,
          defaultValue: currentBudgetItem.category.id.toString(),
          notClearable: true
        },
        {
          type: 'date',
          id: 'date',
          label: 'Date',
          errMsg: 'Date should be valid',
          validator: isDateValid,
          defaultValue: currentBudgetItem.userDate,
          attrs: { autoCapitalize: 'none' },
          notClearable: true
        }
      ]}
      formConfig={{
        submitText: 'Update',
        onSubmit: submitHandler,
        onChangeFields: formChangeHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default UpdateBudgetItemForm
