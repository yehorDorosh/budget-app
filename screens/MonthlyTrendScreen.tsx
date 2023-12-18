import { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import useRouteGuard from '../hooks/useRouteGuard'
import ScreenStyles from '../styles/ScreenStyles'
import MonthsTrend from '../components/budget/MonthsTrend/MonthsTrend'

const MonthlyTrendScreen = () => {
  const token = useRouteGuard()!

  return (
    <View style={ScreenStyles.screen}>
      <MonthsTrend token={token} />
    </View>
  )
}

const styles = StyleSheet.create({})

export default MonthlyTrendScreen
