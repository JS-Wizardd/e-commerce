import axios from 'axios'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { motion } from 'framer-motion'
import { COLORS } from '../../styles/color'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

const UserPage = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [isUpdating, setIsUpdating] = useState({})
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    setIsLoading(true)
    axios
      .get('admin/view-all-users')
      .then(({ data }) => {
        setTotalPages(data.totalPages)
        setUsers(data.users)
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
        // console.log(page, data.totalPages)
      })
      .catch((err) => {
        console.log('error : ' + err)
        setIsLoading(false)
        setUsers((prev) => {
          return [...prev]
        })
      })
  }, [page, isUpdating, search])

  useEffect(() => {
    setHasSearched(false)
  }, [search])

  const columns = [
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      type: 'email',
      width: 180,
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      type: 'phone',
      width: 120,
    },
    {
      field: 'isBlocked',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        return params.value ? (
          <div style={{ color: 'red' }}>Blocked</div>
        ) : (
          <div>Active</div>
        )
      },
    },

    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const handleClick = async (event) => {
          // Toggle the isBlocked status
          // event.stopPropagation()

          setIsUpdating((prev) => ({ ...prev, [params.row.id]: true }))

          const newIsBlockedStatus = !params.row.isBlocked

          // Make an API request to update the user's isBlocked status
          try {
            const { data } = await axios.patch(
              `admin/update-user-status/${params.row.id}`,
              {
                isBlocked: newIsBlockedStatus,
              }
            )
            // If the request is successful, update the local state
            if (data.success) {
              setIsUpdating((prev) => ({ ...prev, [params.row.id]: false }))
            } else {
              console.error('Failed to update user:', data.message)
            }
          } catch (error) {
            console.error('Failed to update user:', error)
          }
        }

        // Change the button appearance based on the isBlocked status
        return params.row.isBlocked ? (
          <button
            onClick={handleClick}
            style={{
              backgroundColor: isUpdating[params.row.id] ? 'grey' : 'green',
              color: 'white',
              width: '80px',
              height: '30px',
              borderRadius: '20px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={isUpdating[params.row.id]}
          >
            {isUpdating[params.row.id] ? 'Updating...' : 'Unblock'}
          </button>
        ) : (
          <button
            onClick={handleClick}
            style={{
              backgroundColor: isUpdating[params.row.id] ? 'grey' : 'red',
              color: 'white',
              width: '80px',
              height: '30px',
              borderRadius: '20px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={isUpdating[params.row.id]}
          >
            {isUpdating[params.row.id] ? 'Updating...' : 'Block'}
          </button>
        )
      },
    },
  ]

  const rows = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    isBlocked: user.isBlocked,
  }))

  const handleSearch = async () => {
    setHasSearched(true)
    setIsLoading(true)
    try {
      const { data } = await axios.get(`/admin/search-user?query=${search}`)
      if (data.success) {
        setUsers(data.users)
        setIsLoading(false)
      } else {
        setSearchResult((prev) => {
          return [...prev]
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to search users:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center w-full ">
      <div
        className="flex flex-col   justify-center
         w-full p-3 items-center"
      >
        <div className=" w-4/5 sm:w-3/5 lg:w-2/5 ">
          <div className="flex w-full mt-3 mb-3">
            <Autocomplete
              freeSolo
              id="user search"
              disableClearable
              sx={{
                width: '100%',
                height: '20px',
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'purple',
                  },
                  '&:hover fieldset': {
                    borderColor: 'purple',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'purple',
                  },
                },
              }}
              options={allUsers.map((option) => option.name)}
              onInputChange={(event, newValue) => {
                setSearch(newValue)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Name, Email or mobile"
                  value={search}
                  sx={{ width: '100%' }}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />

            {/* end iof mui search */}
            <div className="h-12 py-8 flex w-16 justify-center items-center mt-[1px] -ml-1 z-[1] bg-slate-500 rounded-tr-lg rounded-br-lg cursor-pointer">
              <button disabled={search === ''} onClick={handleSearch}>
                <motion.img
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  src="../../assets/icons/search.png"
                  alt="search"
                  className="w-7 "
                />
              </button>
            </div>
          </div>
        </div>

        {/* {hasSearched && users.length === 0 && <div>No results found</div>} */}

        <div className="w-full mt-10 flex flex-col  min-h-[200px] h-fit max-h-[500px] max-w-fit lg:w-3/5">
          <DataGrid
            sx={{
              '& .MuiDataGrid-root': {
                borderColor: 'purple',
              },

              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
            rows={rows}
            columns={columns}
            loading={isLoading}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
            initialState={{
              pagination: {
                paginationModel: { page: page, pageSize: 4 },
              },
            }}
            pageSizeOptions={[2, 4, 8, 10, 20, 50, 100]}
            localeText={{ noRowsLabel: `no results found for "${search}"` }}
          />
        </div>
      </div>
    </div>
  )
}
export default UserPage
