import { FC } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native'
import { useAppSelector } from '../../../hooks/useReduxTS'
import CategoryItem from './CategoryItem'
import BaseCard from '../../ui/BaseCard'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const categories = useAppSelector((state) => state.categories.categories)

  return (
    <ScrollView>
      {categories.map((item) => {
        return <CategoryItem key={item.id} id={item.id} value={item.name} categoryType={item.categoryType} token={token} />
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})

export default CategoriesList
