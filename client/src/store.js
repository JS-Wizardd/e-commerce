import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import searchReducer from './slices/searchSlice'
import sidebarReducer from './slices/sidebarSlice'
import cartReducer from './slices/cartSlice'
import userReducer from './slices/userSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'isLoggedIn', 'tokenExpiration'],
}

const rootReducer = {
  search: searchReducer,
  sidebar: sidebarReducer,
  cart: cartReducer,
  user: persistReducer(persistConfig, userReducer),
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
})

export const persistor = persistStore(store)
