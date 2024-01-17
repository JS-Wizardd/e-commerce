import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchResults: [],
    search: '',
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
    setSearch: (state, action) => {
      state.search = action.payload
    },
  },
})

export const { setSearchResults, setSearch } = searchSlice.actions

export default searchSlice.reducer
