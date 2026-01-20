// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit'
import professionalsReducer from './slices/professionalsSlice'
import authReducer from './slices/auth.slice'
import dashboardReducer from '../dashboard/features/dashboardSlice'
import galerieReducer from './slices/galerieSlice' // ✅ NEW - added galerie

export const store = configureStore({
  reducer: {
    professionals: professionalsReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    galerie: galerieReducer, // ✅ NEW - galerie slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch