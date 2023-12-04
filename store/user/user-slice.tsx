import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  id: number | null
  email: string | null
  token: string | null
  autoLogoutTimer: NodeJS.Timeout | null
}

const initialState: UserState = {
  id: null,
  email: null,
  token: null,
  autoLogoutTimer: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<{ id: string; email: string; token: string }>) {
      state.id = +action.payload.id
      state.email = action.payload.email
      if (action.payload.token) state.token = action.payload.token
    },
    logout(state) {
      localStorage.removeItem('token')
      state.id = null
      state.email = null
      state.token = null
      if (state.autoLogoutTimer) {
        clearInterval(state.autoLogoutTimer)
        state.autoLogoutTimer = null
      }
    },
    setAutoLogoutTimer(state, action: PayloadAction<NodeJS.Timeout>) {
      state.autoLogoutTimer = action.payload
    }
  }
})

export const userActions = userSlice.actions

export default userSlice.reducer
