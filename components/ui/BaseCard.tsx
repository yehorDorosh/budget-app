import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Colors from '../../styles/Colors'

interface Props {
  children: React.ReactNode
  style?: object
}

const BaseCard: FC<Props> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.card.bg,
    borderColor: Colors.card.border
  }
})

export default BaseCard
