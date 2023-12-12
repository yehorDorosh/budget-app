import React, { FC, Fragment, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'
import BaseModal from '../../ui/BaseModal'
import UpdateCategoryForm from '../UpdateCategoryFrom/UpdateCategoryFrom'
import { CategoryType } from '../../../types/enums'
import BaseCard from '../../ui/BaseCard'
import BaseButton from '../../ui/BaseButton'

interface Props {
  id: number
  value: string
  categoryType: CategoryType
  token: string
}

const ListItem: FC<Props> = ({ id, value, categoryType, token }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const deleteHandler = () => {
    dispatch(deleteCategory({ token, id }))
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  return (
    <Fragment>
      <BaseModal open={openForm} onClose={() => setOpenForm(false)} title="Edit">
        <UpdateCategoryForm
          id={id}
          token={token!}
          defaultName={value}
          defaultCategoryType={categoryType}
          onSave={() => setOpenForm(false)}
        />
      </BaseModal>
      <BaseModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={`Delete Category ${value}?`}
        // footer={{
        //   reject: { text: 'Cancel', onClick: () => setOpenDeleteModal(false) },
        //   accept: { text: 'Delete', onClick: deleteHandler }
        // }}
      >
        <p>Are you sure you want to delete this category?</p>
        <p>All budget items in this category also will be deleted!</p>
      </BaseModal>
      <BaseCard>
        <View>
          <Text>{value}</Text>
          <Text>{categoryType}</Text>
          <View>
            <BaseButton mode="smallBtn" onPress={editBtnHandler}>
              Edit
            </BaseButton>
            <BaseButton mode="smallBtn" onPress={() => setOpenDeleteModal(true)}>
              Delete
            </BaseButton>
          </View>
        </View>
      </BaseCard>
    </Fragment>
  )
}

const styles = StyleSheet.create({})

export default ListItem
