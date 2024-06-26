import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './rootReducer'
import CreateSagaMiddleware from 'redux-saga'
import { productSaga } from './saga/productsaga'
import { authSaga , userDetailsInterface } from './saga/authSaga'

const sagaMiddleware = CreateSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware : [sagaMiddleware]
})

sagaMiddleware.run(productSaga)
sagaMiddleware.run(authSaga)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export default store