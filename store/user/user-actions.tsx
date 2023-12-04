import axios from 'axios'
import { userActions } from './user-slice'
import { RootState, AppDispatch } from '..'
import { ApiRes, LoginPayload } from '../../types/api'
import { actionErrorHandler } from '../../utils/errors'

const api = process.env.EXPO_PUBLIC_API_URL

export const login = ({ email, password }: { email: string; password: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.post<ApiRes<LoginPayload>>(`${api}/api/user/login`, { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

