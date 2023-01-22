import { takeEvery, put, fork, take, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

// Action constants which will be used to track saga
import { LOGIN_USER, LOG_OUT, ON_LOGIN, ON_LOGTOUT } from '../actionConstants'
import axiosInstance from '../../shared/services/axiosInstance'
import { onLogin } from '../actions/authActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface userDetailsInterface {
    username: String,
    password: String
}

// Saga function to get user details from server
function* getUserDetails(data: {
    type: any,
    payload: userDetailsInterface
}) {
    // console.log('payload', data)
    if (data.payload.username && data.payload.password) {
        console.log('Ready for api', data.payload)
        AsyncStorage.setItem('authToken', 'checktoken')
        AsyncStorage.setItem('userDetails', JSON.stringify(data.payload))
        yield put({
            type: LOGIN_USER, payload: {
                userDetails: data.payload
            }
        })
    }
}

// Saga function to be called while logout button is clicked
function* logout(){
    AsyncStorage.removeItem('authToken')
    AsyncStorage.removeItem('userDetails')
    yield put({type : LOG_OUT})
}


// List of overall authsaga functions to be called based on action types
export function* authSaga() {
    yield takeEvery(ON_LOGIN, getUserDetails)
    yield takeEvery(ON_LOGTOUT , logout)
}