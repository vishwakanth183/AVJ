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
        dashboardDetails : null
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

        updateDashboardDetails : {
            reducer(state , action) {
                state.dashboardDetails = action.payload.dashboardDetails
            }
        }

    },
})

export const { openAuthenticationError, closeAuthenticationError, setLoaderActive, setLoaderInActive, createLogin , logOut , updateSelectedPage , updateTheme , updateDashboardDetails} = CommonSlice.actions

export default CommonSlice.reducer