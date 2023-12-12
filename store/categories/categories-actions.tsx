import axios from 'axios'
import { AppDispatch, RootState } from '..'
import { actionErrorHandler } from '../../utils/errors'
import { ApiRes, CategoriesPayload } from '../../types/api'
import { categoriesActions } from './categories-slice'

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
