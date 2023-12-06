import { useEffect } from 'react'
import { useAppSelector } from './useReduxTS'
import { useNavigation } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../types/navigation'

const useRouteGuard = () => {
  const token = useAppSelector((state) => state.user.token)
  const navigation = useNavigation<HomeScreenNavigationProp>()

  useEffect(() => {
    if (!token) {
      navigation.navigate('Home')
    }
  }, [token])

  return token
}

export default useRouteGuard
