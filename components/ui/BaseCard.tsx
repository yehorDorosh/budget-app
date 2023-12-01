import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import ShadowStyles from '../../styles/ShadowStyles'

interface Props {
  children: React.ReactNode
}

const BaseCard: FC<Props> = ({ children }) => {
  return <View style={[styles.card]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8
  }
})

export default BaseCard
