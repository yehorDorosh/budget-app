import { useState, useEffect } from 'react'
import { CategoryType } from '../types/enums'
import { useAppSelector, useAppDispatch } from './useReduxTS'
import { Category } from '../store/categories/categories-slice'
import { getCategories } from '../store/categories/categories-actions'

const useCategoryFilter = (defaultCategoryType: CategoryType | null = CategoryType.EXPENSE) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  const filterCategories = (categories: Category[], categoryType: CategoryType | null) => {
    return [
      { label: 'Select or create category', value: '' },
      ...categories
        .filter((category) => category.categoryType === categoryType || !categoryType)
        .map((category) => ({ label: category.name, value: category.id.toString() }))
    ]
  }
  const categories = useAppSelector((state) => state.categories.categories)
  const [filteredCategories, setFilteredCategories] = useState<{ label: string; value: string }[]>(
    filterCategories(categories, defaultCategoryType)
  )
  const [categoryType, setCategoryType] = useState<CategoryType | null>(defaultCategoryType)

  useEffect(() => {
    const prepare = async () => {
      if (user.token) {
        await dispatch(getCategories({ token: user.token }))
      }
    }

    prepare()
  }, [user.token])

  useEffect(() => {
    setFilteredCategories(filterCategories(categories, categoryType))
  }, [categories, categoryType])

  return { filteredCategories, categoryType, setCategoryType, token: user.token!, defaultCategoryType }
}

export default useCategoryFilter
