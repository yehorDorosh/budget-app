import React, { FC, Fragment, useState } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType, ResCodes } from '../../../types/enums'
import BaseCard from '../../ui/BaseCard'
import BaseButton from '../../ui/BaseButton'

interface Props {
  token: string
  budgetItem: BudgetItem
  onChange: (budgetItem: BudgetItem) => void
  onDelete: (id: number) => void
}

const ListItem: FC<Props> = ({ budgetItem, token, onChange, onDelete }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)

  const deleteHandler = async () => {
    const res = await dispatch(deleteBudgetItem({ token, id: budgetItem.id }))

    if (res.data.code === ResCodes.DELETE_BUDGET_ITEM) {
      onDelete(budgetItem.id)
    }
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  const onEditHandler = (budgetItem: BudgetItem) => {
    setOpenForm(false)
    onChange(budgetItem)
  }

  return (
    <Fragment>
      <Modal visible={openForm} onRequestClose={() => setOpenForm(false)} presentationStyle="formSheet">
        <UpdateBudgetItemForm token={token} currentBudgetItem={budgetItem} onSave={onEditHandler} />
      </Modal>
      <BaseCard>
        <View>
          <Text>{budgetItem.name}</Text>
          <View>
            <Text>{budgetItem.value}</Text>
            <Text>{budgetItem.userDate}</Text>
            <Text>{budgetItem.category.name}</Text>
            <Text>{budgetItem.category.categoryType === CategoryType.EXPENSE ? 'E' : 'I'}</Text>
          </View>
          <View>
            <BaseButton onPress={editBtnHandler}>Edit</BaseButton>
            <BaseButton onPress={deleteHandler}>Delete</BaseButton>
          </View>
        </View>
      </BaseCard>
    </Fragment>
  )
}

export default ListItem
