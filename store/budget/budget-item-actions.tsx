import axios from 'axios'
import { AppDispatch, RootState } from '..'
import objectToQueryString from '../../utils/query'
import { actionErrorHandler } from '../../utils/errors'
import { ApiRes, BudgetItemsPayload } from '../../types/api'

const api = process.env.EXPO_PUBLIC_API_URL

export const getBudgetItems = ({ token }: { token: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const filters = getState().budgetItem.filters
    const query = filters ? '?' + objectToQueryString(filters) : ''
    try {
      const { data, status } = await axios.get<ApiRes<BudgetItemsPayload>>(`${api}/api/budget/get-budget-item${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}
