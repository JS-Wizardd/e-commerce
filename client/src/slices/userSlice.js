import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isLoggedIn: false,
  tokenExpiration: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.isLoggedIn = true
      state.tokenExpiration = action.payload.exp
    },
    logoutUser: (state) => {
      state.user = null
      state.isLoggedIn = false
      state.tokenExpiration = null
    },
    checkTokenExpiration: (state) => {
      if (Date.now() >= state.tokenExpiration * 1000) {
        state.user = null
        state.isLoggedIn = false
        state.tokenExpiration = null
      }
    },
  },
})

export const { setUser, logoutUser, checkTokenExpiration } = userSlice.actions
export default userSlice.reducer
