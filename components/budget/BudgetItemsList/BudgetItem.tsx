import React, { FC, Fragment, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType, ResCodes } from '../../../types/enums'
import BaseCard from '../../ui/BaseCard'
import BaseButton from '../../ui/BaseButton'
import BaseModal from '../../ui/BaseModal'

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
      <BaseModal open={openForm} onClose={() => setOpenForm(false)} title="Edit">
        <UpdateBudgetItemForm token={token} currentBudgetItem={budgetItem} onSave={onEditHandler} />
      </BaseModal>
      <BaseCard style={styles.card}>
        <View style={styles.container}>
          <Text style={styles.title}>{budgetItem.name}</Text>
          <View style={styles.data}>
            <Text style={styles.value}>{budgetItem.value}</Text>
            <Text>{budgetItem.userDate}</Text>
            <Text>{budgetItem.category.name}</Text>
            <Text>{budgetItem.category.categoryType === CategoryType.EXPENSE ? 'E' : 'I'}</Text>
          </View>
          <View style={styles.btns}>
            <BaseButton mode="smallBtn" style={[styles.btn]} onPress={editBtnHandler}>
              Edit
            </BaseButton>
            <BaseButton mode="smallBtn" style={[styles.btn]} onPress={deleteHandler}>
              Delete
            </BaseButton>
          </View>
        </View>
      </BaseCard>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  data: {
    width: '50%'
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 4
  },
  btns: {
    width: '50%',
    alignItems: 'flex-end'
  },
  btn: {
    marginVertical: 4,
    minWidth: '50%'
  }
})

export default ListItem
