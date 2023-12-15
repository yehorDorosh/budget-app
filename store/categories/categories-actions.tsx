import axios from 'axios'
import { AppDispatch, RootState } from '..'
import { actionErrorHandler } from '../../utils/errors'
import { ApiRes, CategoriesPayload } from '../../types/api'
import { categoriesActions } from './categories-slice'
import { CategoryType } from '../../types/enums'

const api = process.env.EXPO_PUBLIC_API_URL

export const getCategories = ({ token }: { token: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.get<ApiRes<CategoriesPayload>>(`${api}/api/categories/get-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const addCategory = ({ token, name, categoryType }: { token: string; name: string; categoryType: CategoryType }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.post<ApiRes<CategoriesPayload>>(
        `${api}/api/categories/add-category`,
        { name, categoryType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const deleteCategory = ({ token, id }: { token: string; id: number }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.delete<ApiRes<CategoriesPayload>>(`${api}/api/categories/delete-category?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const updateCategory = ({
  token,
  id,
  name,
  categoryType
}: {
  token: string
  id: number
  name: string
  categoryType: CategoryType
}) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.put<ApiRes<CategoriesPayload>>(
        `${api}/api/categories/update-category`,
        { id, name, categoryType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}
