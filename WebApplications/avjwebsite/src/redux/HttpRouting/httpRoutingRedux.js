import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./interceptor";
import { config } from '../../environment'
import { openAuthenticationError } from "../commonSlice";

const hostUrl = config.hosturl


//GET METHOD CONFIG
export const getMethod = createAsyncThunk('request/getMethod', async (dispatch, getState) => {
    console.log(dispatch)
    const url = hostUrl + dispatch.url

    try {
        const response = await axiosInstance.get(url,
            {
                params: dispatch?.queryParams
            }
        )
        if (response.status === 401 || response.status === 403) {
            getState.dispatch(openAuthenticationError())
        }
        return response.data
    }
    catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
            getState.dispatch(openAuthenticationError())
        }
        throw new Error(err.response.data)
    }
})


//POST METHOD CONFIG
export const postMethod = createAsyncThunk('request/postMethod', async (dispatch, getState) => {
    const url = hostUrl + dispatch.url
    console.log('dispatch',dispatch.data)
    try {
        const response = await axiosInstance.post(url, dispatch.data)
        if (response.status === 401) {
            getState.dispatch(openAuthenticationError())
        }
        return response.data
    }
    catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
            getState.dispatch(openAuthenticationError())
        }
        throw new Error(err.response.data)
    }
})

//PUT METHOD CONFIG
export const putMethod = createAsyncThunk('request/putMethod', async (dispatch, getState) => {
    const url = hostUrl + dispatch.url
    try {
        const response = await axiosInstance.put(url,
            {
                data: dispatch?.data,
            },
            {
                params : dispatch?.queryParams
            }
        )
        if (response.status === 401) {
            getState.dispatch(openAuthenticationError())
        }
        return response.data
    }
    catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
            getState.dispatch(openAuthenticationError())
        }
        throw new Error(err.response.data)
    }
})

//DELETE METHOD CONFIG
export const deleteMethod = createAsyncThunk('request/deleteMethod', async (dispatch, getState) => {
    const url = hostUrl + dispatch.url
    try {
        const response = await axiosInstance.delete(url,
            {
                data: dispatch?.data,
                params: dispatch?.queryParams
            }
        )
        if (response.status === 401) {
            getState.dispatch(openAuthenticationError())
        }
        return response.data
    }
    catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
            getState.dispatch(openAuthenticationError())
        }
        throw new Error(err.response.data)
    }
})

const HttpRouterSlice = createSlice({
    name: "HttpRouting",
    initialState: {
        apiStatus: 'loading'
    },
    extraReducers: {

        // Get request handler

        [getMethod.pending]: (state, action) => {
            state.apiStatus = 'loading'
        },
        [getMethod.fulfilled]: (state, action) => {
            state.apiStatus = 'Fullfilled';
        },
        [getMethod.rejected]: (state, action) => {
            state.apiStatus = 'Rejected'
        },

        // Post request handler

        [postMethod.pending]: (state, action) => {
            state.apiStatus = 'loading'
        },
        [postMethod.fulfilled]: (state, action) => {
            state.apiStatus = 'Fullfilled';
        },
        [postMethod.rejected]: (state, action) => {
            state.apiStatus = 'Rejected'
        },

        // Put request handler

        [putMethod.pending]: (state, action) => {
            state.apiStatus = 'loading'
        },
        [putMethod.fulfilled]: (state, action) => {
            state.apiStatus = 'Fullfilled';
        },
        [putMethod.rejected]: (state, action) => {
            state.apiStatus = 'Rejected'
        },

        //Delete request handler
        [deleteMethod.pending]: (state, action) => {
            state.apiStatus = 'loading'
        },
        [deleteMethod.fulfilled]: (state, action) => {
            state.apiStatus = 'Fullfilled';
        },
        [deleteMethod.rejected]: (state, action) => {
            state.apiStatus = 'Rejected'
        },
    }
})

export default HttpRouterSlice.reducer