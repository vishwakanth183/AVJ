import { takeEvery, put, fork, take, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { ToastAndroid } from 'react-native'

// Action constants which will be used to track saga
import { LOGIN_USER, LOG_OUT, ON_LOGIN, ON_LOGTOUT } from '../actionConstants'
import axiosInstance from '../../shared/services/axiosInstance'
import { onLogin } from '../actions/authActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { environment } from '../../shared/env'
import { API } from '../../shared/apiroutes'
import { Toast } from 'react-native-toast-message/lib/src/Toast'


export interface userDetailsInterface {
    username: String,
    password: String
}

// Saga function to get user details from server
function* getUserDetails(authData: {
    type: any,
    payload: userDetailsInterface
}) {
    // console.log('payload', authData)
    if (authData.payload.username && authData.payload.password) {
        try {
            const { data } = yield axios.post(environment.API_URL + API.SIGN_IN, {
                name: authData.payload.username,
                password: authData.payload.password
            })
            AsyncStorage.setItem('authToken', JSON.stringify(data.accessToken))
            AsyncStorage.setItem('userDetails', JSON.stringify(data.userDetails))
            yield put({
                type: LOGIN_USER, payload: {
                    userDetails: data.userDetails
                }
            })
            Toast.show({
                type: 'success',
                autoHide: true,
                text1: 'Login Successfull',
            })
        }
        catch (err) {
            Toast.show({
                type: 'error',
                autoHide: true,
                text1: 'Invalid Login Credential',
            })
            console.log("auth error", err)
        }
    }
}

// Saga function to be called while logout button is clicked
function* logout() {
    AsyncStorage.removeItem('authToken')
    AsyncStorage.removeItem('userDetails')
    yield put({ type: LOG_OUT })
}


// List of overall authsaga functions to be called based on action types
export function* authSaga() {
    yield takeEvery(ON_LOGIN, getUserDetails)
    yield takeEvery(ON_LOGTOUT, logout)
}