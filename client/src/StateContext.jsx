import { createContext, useState } from 'react'

export const StateContext = createContext({})

const StateContextProvider = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState('')

  return (
    <StateContext.Provider
      value={{
        sidebarToggle,
        setSidebarToggle,
        searchResults,
        setSearchResults,
        search,
        setSearch,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export default StateContextProvider
