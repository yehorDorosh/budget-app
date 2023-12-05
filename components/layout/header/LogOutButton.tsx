import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import IconButton from '../../ui/IconButton'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { userActions } from '../../../store/user/user-slice'
import { useNavigation } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../../../types/navigation'

interface Props {
  tintColor?: string
}

const LogOutButton: FC<Props> = ({ tintColor }) => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const user = useAppSelector((state) => state.user)

  const logOutHandler = () => {
    dispatch(userActions.logout())
    navigation.navigate('Home')
  }

  if (!user.token) return null

  return <IconButton style={styles.button} icon="log-out" color={tintColor ? tintColor : 'black'} size={28} onPress={logOutHandler} />
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16
  }
})

export default LogOutButton
