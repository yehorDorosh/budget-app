import axios from 'axios'
import { AppDispatch, RootState } from '..'
import objectToQueryString from '../../utils/query'
import { actionErrorHandler } from '../../utils/errors'
import { ApiRes, BudgetItemsPayload, BudgetItemPayload, CategoryRate, MonthlyTrendPayload } from '../../types/api'

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

export const deleteBudgetItem = ({ token, id }: { token: string; id: number }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.delete<ApiRes>(`${api}/api/budget/delete-budget-item?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const addBudgetItem = ({
  token,
  categoryId,
  name,
  value,
  userDate
}: {
  token: string
  categoryId: number
  name: string
  value: number
  userDate: string
}) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.post<ApiRes>(
        `${api}/api/budget/add-budget-item`,
        { categoryId, name, value, userDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const updateBudgetItem = ({
  token,
  id,
  categoryId,
  name,
  value,
  userDate,
  ignore
}: {
  id: number
  token: string
  categoryId: number
  name: string
  value: number
  userDate: string
  ignore: boolean
}) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.put<ApiRes<BudgetItemPayload>>(
        `${api}/api/budget/update-budget-item`,
        { id, categoryId, name, value, userDate, ignore },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const getStatistics = ({ token }: { token: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const filters = getState().budgetItem.filters
    const query = filters ? '?' + objectToQueryString(filters, ['page', 'perPage', 'ignore', 'categoryType', 'category']) : ''
    try {
      const { data, status } = await axios.get<ApiRes<CategoryRate>>(`${api}/api/budget/get-statistics${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const getMonthlyTrend = ({ token, year }: { year: string; token: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const query = year ? '?' + objectToQueryString({ year }) : ''
    try {
      const { data, status } = await axios.get<ApiRes<MonthlyTrendPayload>>(`${api}/api/budget/get-monthly-trend${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const searchNames = ({ token, name }: { token: string; name: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.get<ApiRes<string[]>>(`${api}/api/budget/search-names?name=${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}
