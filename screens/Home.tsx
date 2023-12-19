import { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import ScreenStyles from '../styles/ScreenStyles'
import { useAppSelector, useAppDispatch } from '../hooks/useReduxTS'
import AuthForms from '../components/auth/AuthForms/AuthForms'
import { autoLoginAutoLogout } from '../store/user/user-actions'
import * as SplashScreen from 'expo-splash-screen'
import LoaderOverlay from '../components/utils/LoaderOverlay'
import AddBudgetItemForm from '../components/budget/AddBudgetItemForm/AddBudgetItemForm'
import { NavigationProp } from '@react-navigation/native'
import { HomeScreenNavigationProp } from '../types/navigation'
import HeaderRight from '../components/layout/header/HeaderRight'

// SplashScreen.preventAutoHideAsync()

const Home = ({ navigation }: { navigation: NavigationProp<HomeScreenNavigationProp> }) => {
  const dispatch = useAppDispatch()
  const [appIsReady, setAppIsReady] = useState(false)
  const user = useAppSelector((state) => state.user)
  const [openCalc, setOpenCalc] = useState(false)

  useEffect(() => {
    const prepare = async () => {
      await dispatch(autoLoginAutoLogout())
      setAppIsReady(true)
    }

    prepare()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: { tintColor: string }) => <HeaderRight tintColor={tintColor} onCalcPress={() => setOpenCalc(true)} />
    })
  }, [navigation])

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
      {user.token && <AddBudgetItemForm openCalc={openCalc} closeCalc={() => setOpenCalc(false)} />}
      {!user.token && <AuthForms />}
    </View>
  )
}

export default Home
