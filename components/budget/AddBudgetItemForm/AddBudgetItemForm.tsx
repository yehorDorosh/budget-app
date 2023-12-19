import { FC, Fragment, useState } from 'react'
import { StyleSheet } from 'react-native'
import Form from '../../Form/Form'
import { notEmptyValidator } from '../../../utils/validators'
import { isDateValid, formatDateYearMonthDay } from '../../../utils/date'
import { FieldState } from '../../Form/Form'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { addBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType } from '../../../types/enums'
import useCategoryFilter from '../../../hooks/useCategoryFilter'
import BaseModal from '../../ui/BaseModal'
import PriceCalculator from '../../PriceCalculator/PriceCalculator'

interface Props {
  openCalc: boolean
  closeCalc: () => void
}

const AddBudgetItemForm: FC<Props> = ({ openCalc, closeCalc }) => {
  const dispatch = useAppDispatch()
  const { token, categoryType, setCategoryType, defaultCategoryType, filteredCategories } = useCategoryFilter()
  const [calcValue, setCalcValue] = useState<number | undefined>()

  const onPressEqualHandler = (result: number) => {
    setCalcValue(result)
    closeCalc()
  }

  const submitHandler = async (...fields: FieldState[]) => {
    const res = await dispatch(
      addBudgetItem({
        token: token,
        categoryId: +fields[3].value,
        name: fields[1].value.toString(),
        value: +fields[2].value,
        userDate: fields[4].value.toString()
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

  return (
    <Fragment>
      <BaseModal open={openCalc} title="Calculator" onClose={closeCalc}>
        <PriceCalculator onPressEqual={onPressEqualHandler} />
      </BaseModal>

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
            defaultValue: defaultCategoryType ? defaultCategoryType : CategoryType.EXPENSE
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
            attrs: { autoCapitalize: 'none', keyboardType: 'numeric' },
            value: calcValue ? calcValue.toString() : undefined
          },
          {
            type: 'select',
            id: 'category',
            label: 'Category',
            errMsg: 'Category should be valid',
            validator: notEmptyValidator,
            selectItems: filteredCategories,
            defaultValue: '',
            notClearable: true
          },
          {
            type: 'date',
            id: 'date',
            label: 'Date',
            errMsg: 'Date should be valid',
            validator: isDateValid,
            defaultValue: formatDateYearMonthDay(new Date()),
            attrs: { autoCapitalize: 'none' },
            notClearable: true
          }
        ]}
        formConfig={{
          submitText: 'Add',
          onSubmit: submitHandler,
          onChangeFields: formChangeHandler
        }}
      />
    </Fragment>
  )
}

const styles = StyleSheet.create({})

export default AddBudgetItemForm
