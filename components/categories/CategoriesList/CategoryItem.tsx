import React, { FC, Fragment, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'
import BaseModal from '../../ui/BaseModal'
import UpdateCategoryForm from '../UpdateCategoryFrom/UpdateCategoryFrom'
import { CategoryType } from '../../../types/enums'
import BaseCard from '../../ui/BaseCard'
import BaseButton from '../../ui/BaseButton'
import LoaderOverlay from '../../utils/LoaderOverlay'

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
  const [loading, setLoading] = useState(false)

  const deleteHandler = async () => {
    setLoading(true)
    await dispatch(deleteCategory({ token, id }))
    setLoading(false)
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
        footer={
          loading
            ? undefined
            : {
                reject: { text: 'Cancel', onClick: () => setOpenDeleteModal(false) },
                accept: { text: 'Delete', onClick: deleteHandler }
              }
        }
      >
        {loading && <LoaderOverlay style={styles.overlay} />}
        <Text>Are you sure you want to delete this category?</Text>
        <Text>All budget items in this category also will be deleted!</Text>
      </BaseModal>
      <BaseCard style={styles.card}>
        <View style={styles.item}>
          <Text>{value}</Text>
          <Text>{categoryType}</Text>
          <View style={styles.btns}>
            <BaseButton style={[{ marginRight: 8 }]} mode="smallBtn" onPress={editBtnHandler}>
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

const styles = StyleSheet.create({
  card: {
    marginBottom: 8
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1
  }
})

export default ListItem
