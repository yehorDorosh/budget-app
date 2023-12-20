import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import FilterButton from './FilterButton'
import LogOutButton from './LogOutButton'
import CalcButton from './CalcButton'
import { useAppSelector } from '../../../hooks/useReduxTS'

interface Props {
  tintColor?: string
  onFilterPress?: () => void
  onCalcPress?: () => void
}

const HeaderRight: FC<Props> = ({ onCalcPress, onFilterPress, tintColor }) => {
  const isLogin = !!useAppSelector((state) => state.user.token)

  if (!isLogin) return null

  return (
    <View style={styles.container}>
      {onCalcPress && <CalcButton tintColor={tintColor} onPress={onCalcPress} />}
      {onFilterPress && <FilterButton tintColor={tintColor} onPress={onFilterPress} />}
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
