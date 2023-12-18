import { FC } from 'react'
import { StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { FieldState } from '../../Form/Form'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enums'
import { updateCategory } from '../../../store/categories/categories-actions'

interface Props {
  id: number
  token: string
  defaultName: string
  defaultCategoryType: CategoryType
  onSave: () => void
}

const UpdateCategoryFrom: FC<Props> = ({ id, token, defaultName, defaultCategoryType, onSave }) => {
  const dispatch = useAppDispatch()

  const submitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(
      updateCategory({ token, id, name: fields[1].value.toString(), categoryType: fields[0].value as CategoryType })
    )
    onSave()
    return res
  }

  return (
    <Form
      fieldsConfig={[
        {
          type: 'radio',
          id: 'updCategoryType',
          label: 'Category Type',
          selectItems: [
            { label: 'Expense', value: CategoryType.EXPENSE },
            { label: 'Income', value: CategoryType.INCOME }
          ],
          defaultValue: defaultCategoryType
        },
        {
          type: 'text',
          id: 'updCategoryName',
          label: 'New Category Name',
          errMsg: 'Category name should not be empty',
          validator: notEmptyValidator,
          attrs: { autoCapitalize: 'none' },
          defaultValue: defaultName
        }
      ]}
      formConfig={{
        submitText: 'Save',
        onSubmit: submitHandler
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default UpdateCategoryFrom
