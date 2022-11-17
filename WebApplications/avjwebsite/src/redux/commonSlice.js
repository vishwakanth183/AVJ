import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
    name: "common",
    initialState: {
        authenticatedError: false,
        appLoader: true,
        userDetails: {},
        loggedIn: false,
        appTheme : 'light',
        selectedPage : {
            menuTitle: 'Dashboard',
            submenuTitle: ''
        },
        showSnackBar: {
            open: false,
            message: '',
            color: 'black'
        },
    },
    reducers: {

        setLoaderActive: {
            reducer(state, action) {
                state.appLoader = true
            }
        },

        setLoaderInActive: {
            reducer(state, action) {
                state.appLoader = false
            }
        },

        createLogin: {
            reducer(state, action) {
                state.appLoader = false;
                state.loggedIn = true;
                state.userDetails = action.payload.userDetails
            }
        },

        logOut: {
            reducer(state, action) {
                state.appLoader = false;
                state.loggedIn = false;
                state.userDetails = {}
            }
        },

        openAuthenticationError: {
            reducer(state, action) {
                state.loggedIn = false;
                state.userDetails = {};
                state.authenticatedError = true
            }
        },

        closeAuthenticationError: {
            reducer(state, action) {
                state.authenticatedError = false
            }
        },

        updateSelectedPage : {
            reducer(state , action) {
                state.selectedPage = action.payload;
            }
        },

        updateTheme : {
            reducer(state , action) {
                state.appTheme = action.payload
            }
        },

        showSnackBar: {
            reducer(state, action) {
                state.showSnackBar = action.payload
            }
        },

        closeSnackBar: {
            reducer(state, action) {
                state.showSnackBar = {
                    open: false,
                    message: '',
                    color: 'black'
                }
            }
        },

    },
})

export const { openAuthenticationError, closeAuthenticationError, showSnackBar, closeSnackBar, setLoaderActive, setLoaderInActive, createLogin , logOut , updateSelectedPage , updateTheme} = CommonSlice.actions

export default CommonSlice.reducer