import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import FilterButton from './FilterButton'
import LogOutButton from './LogOutButton'

interface Props {
  tintColor?: string
  onFilterPress: () => void
}

const HeaderRight: FC<Props> = ({ onFilterPress, tintColor }) => {
  return (
    <View style={styles.container}>
      <FilterButton tintColor={tintColor} onPress={onFilterPress} />
      <LogOutButton tintColor={tintColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default HeaderRight
