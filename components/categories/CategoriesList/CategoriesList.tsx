import { FC } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useAppSelector } from '../../../hooks/useReduxTS'
import CategoryItem from './CategoryItem'
import BaseCard from '../../ui/BaseCard'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const categories = useAppSelector((state) => state.categories.categories)

  return (
    <BaseCard>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CategoryItem id={item.id} value={item.name} categoryType={item.categoryType} token={token} />}
      />
    </BaseCard>
  )
}

const styles = StyleSheet.create({})

export default CategoriesList
