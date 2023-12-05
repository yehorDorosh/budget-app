import { useEffect, useState, useCallback } from 'react'
import { View, Text } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import { useAppSelector, useAppDispatch } from '../hooks/useReduxTS'
import AuthForms from '../components/auth/AuthForms/AuthForms'
import { autoLoginAutoLogout } from '../store/user/user-actions'
import * as SplashScreen from 'expo-splash-screen'
import LoaderOverlay from '../components/utils/LoaderOverlay'

// SplashScreen.preventAutoHideAsync()

const Home = () => {
  const dispatch = useAppDispatch()
  const [appIsReady, setAppIsReady] = useState(false)
  const user = useAppSelector((state) => state.user)

  useEffect(() => {
    const prepare = async () => {
      await dispatch(autoLoginAutoLogout())
      setAppIsReady(true)
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return <LoaderOverlay />
  }

  return (
    <View style={ScreenStyles.screen} onLayout={onLayoutRootView}>
      {user && <Text>{user.email}</Text>}
      {user && <Text>{user.token}</Text>}
      {!user.token && <AuthForms />}
    </View>
  )
}

export default Home
