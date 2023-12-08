import { FC } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import IconButton from './IconButton'
import BaseCard from './BaseCard'

interface Props {
  children: React.ReactNode
  open: boolean
  onClose: () => void
  title: string
}

const BaseModal: FC<Props> = ({ children, open, onClose, title }) => {
  return (
    <Modal visible={open} animationType="fade">
      <BaseCard style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <IconButton icon="close-circle" color="black" onPress={onClose} />
        </View>
        <View style={styles.container}>{children}</View>
      </BaseCard>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    margin: 16,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default BaseModal
