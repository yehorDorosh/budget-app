import { FC } from 'react'
import { StyleSheet } from 'react-native'
import IconButton from '../../ui/IconButton'
import Colors from '../../../styles/Colors'

interface Props {
  tintColor?: string
  onPress: () => void
}

const FilterButton: FC<Props> = ({ tintColor, onPress }) => {
  return <IconButton style={styles.button} icon="filter" color={tintColor ? tintColor : Colors.ico} size={28} onPress={onPress} />
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16
  }
})

export default FilterButton
