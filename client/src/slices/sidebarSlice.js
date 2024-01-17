import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarToggle: false,
  },
  reducers: {
    setSidebarToggle: (state) => {
      state.sidebarToggle = !state.sidebarToggle
    },
  },
})

export const { setSidebarToggle } = sidebarSlice.actions

export default sidebarSlice.reducer
