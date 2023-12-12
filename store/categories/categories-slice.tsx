import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CategoryType } from '../../types/enums'

export interface Category {
  id: number
  name: string
  categoryType: CategoryType
}

export interface CategoriesState {
  categories: Category[]
}

const initialState: CategoriesState = {
  categories: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload)
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    }
  }
})

export const categoriesActions = categoriesSlice.actions

export default categoriesSlice.reducer
