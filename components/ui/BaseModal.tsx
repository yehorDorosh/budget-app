import { FC } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import IconButton from './IconButton'
import BaseCard from './BaseCard'
import BaseButton from './BaseButton'

interface Props {
  children: React.ReactNode
  open: boolean
  onClose: () => void
  title: string
  footer?: {
    accept?: {
      text: string
      onClick: () => void
    }
    reject?: {
      text: string
      onClick: () => void
    }
  }
}

const BaseModal: FC<Props> = ({ children, open, onClose, title, footer }) => {
  return (
    <Modal visible={open} animationType="fade">
      <BaseCard style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <IconButton icon="close-circle" color="black" onPress={onClose} />
        </View>
        <View style={styles.container}>{children}</View>
        <View style={styles.footer}>
          {footer?.reject && <BaseButton onPress={footer.reject.onClick}>{footer.reject.text}</BaseButton>}
          {footer?.accept && (
            <BaseButton style={[{ marginLeft: 8 }]} onPress={footer.accept.onClick}>
              {footer.accept.text}
            </BaseButton>
          )}
        </View>
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

export default BaseModal
