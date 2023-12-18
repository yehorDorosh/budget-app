import { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import { NavigationProp } from '@react-navigation/native'
import HeaderRight from '../components/layout/header/HeaderRight'
import BaseModal from '../components/ui/BaseModal'
import FilterBudgeForm from '../components/budget/FilterBudgeForm/FilterBudgetListForm'
import BudgetResult from '../components/budget/BudgetResult/BudgetResult'

const BudgetScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const token = useRouteGuard()!
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)

  const onFilterPressHandler = () => {
    setIsOpenFilterModal(true)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: { tintColor: string }) => <HeaderRight tintColor={tintColor} onFilterPress={onFilterPressHandler} />
    })
  }, [navigation])

  return (
    <View style={ScreenStyles.screen}>
      <BaseModal open={isOpenFilterModal} onClose={() => setIsOpenFilterModal(false)} title="Filter">
        <FilterBudgeForm />
      </BaseModal>
      <BudgetResult />
    </View>
  )
}

const styles = StyleSheet.create({})

export default BudgetScreen
