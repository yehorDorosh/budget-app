import { View, Text, StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enums'
import { addCategory } from '../../../store/categories/categories-actions'

const AddCategoryFrom = () => {
  const dispatch = useAppDispatch()
  const defaultCategoryType = CategoryType.EXPENSE
  const user = useAppSelector((state) => state.user)

  const submitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(
      addCategory({ token: user.token!, name: fields[1].value.toString(), categoryType: fields[0].value as CategoryType })
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
          defaultValue: defaultCategoryType
        },
        {
          type: 'text',
          id: 'categoryName',
          label: 'New Category Name',
          errMsg: 'Category name should not be empty',
          validator: notEmptyValidator,
          attrs: { autoCapitalize: 'none' }
        }
      ]}
      formConfig={{
        submitText: 'Add Category',
        onSubmit: submitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default AddCategoryFrom
