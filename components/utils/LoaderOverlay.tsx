import { FC } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

interface Props {
  style?: object
}

const LoaderOverlay: FC<Props> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color="black" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1
  }
})

export default LoaderOverlay
