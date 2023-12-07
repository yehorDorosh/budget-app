import axios from 'axios'
import { userActions } from './user-slice'
import { RootState, AppDispatch } from '..'
import { ApiRes, LoginPayload } from '../../types/api'
import { actionErrorHandler } from '../../utils/errors'
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = process.env.EXPO_PUBLIC_API_URL

export const login = ({ email, password }: { email: string; password: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.post<ApiRes<LoginPayload>>(`${api}/api/user/login`, { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
      }
      await dispatch(autoLoginAutoLogout())
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const signUp = ({ email, password }: { email: string; password: string }) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { data, status } = await axios.post<ApiRes<LoginPayload>>(`${api}/api/user/signup`, { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
      }
      await dispatch(autoLoginAutoLogout())
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const autoLoginAutoLogout = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const user = getState().user
    const autoLogoutTimer = user.autoLogoutTimer
    const tokenFromStore = user.token
    if (autoLogoutTimer) return

    const token = tokenFromStore ?? (await AsyncStorage.getItem('user-token'))
    if (!token) return dispatch(userActions.logout())

    const { exp: expiryDate } = jwtDecode(token)
    // const { exp: expiryDate } = { exp: Date.now() / 1000 + 40 }

    if (!autoLogoutTimer && expiryDate) {
      dispatch(
        userActions.setAutoLogoutTimer(
          setInterval(() => {
            // console.log(expiryDate! - Date.now() / 1000)
            if (Date.now() >= expiryDate * 1000) {
              dispatch(userActions.logout())
            }
          }, 1000)
        )
      )
    }

    if (!user.id || !user.email) {
      try {
        const { data, status } = await axios.get<ApiRes<LoginPayload>>(`${api}/api/user/get-user`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.payload && data.payload.user) {
          dispatch(userActions.setUserData({ ...data.payload.user, token }))
        }
        return { data, status }
      } catch (err) {
        return actionErrorHandler(err)
      }
    }
  }
}

export const updateUser = ({ token, payload }: { token: string; payload: { email?: string; password?: string } }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data, status } = await axios.put<ApiRes<LoginPayload>>(`${api}/api/user/update-user`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
      }
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const restorePassword = ({ token, password }: { token: string; password: string }) => {
  return async () => {
    try {
      const { data, status } = await axios.post<ApiRes>(`${api}/api/user/restore-password/${token}`, { password })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const deleteUser = ({ token, password }: { token: string; password: string }) => {
  return async () => {
    try {
      const { data, status } = await axios.patch<ApiRes>(
        `${api}/api/user/delete-user`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}

export const getRestoreEmail = ({ email }: { email: string }) => {
  return async () => {
    try {
      const { data, status } = await axios.post<ApiRes>(`${api}/api/user/restore-password`, { email })
      return { data, status }
    } catch (err) {
      return actionErrorHandler(err)
    }
  }
}
