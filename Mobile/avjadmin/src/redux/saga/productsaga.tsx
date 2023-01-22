import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'

// Action constants which will be used to track saga
import { GET_ALL_PRODUCTS, SET_PRODUCTS } from '../actionConstants'
import axiosInstance from '../../shared/services/axiosInstance'

// Saga function to fetch products from server and update redux
function* getAllProducts() {

    try {
        const { data } = yield axiosInstance.get('http://localhost:3000/products')
        yield put({ type: SET_PRODUCTS, payload : data })
    }
    catch (error) {
        console.log('error', error)
    }
}


// List of overall productsaga functions to be called based on action types
export function* productSaga() {
    yield takeEvery(GET_ALL_PRODUCTS, getAllProducts)
}
