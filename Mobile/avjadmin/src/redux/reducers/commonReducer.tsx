import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit"

// Custom imports
import { CLOSE_COMMON_LOADER, LOGIN_USER, LOG_OUT, SET_SELECTED_MENU } from "../actionConstants"

export type menuInterface = {
    selectedMenu: {
        menuTitle: String,
        submenuTitle: String
    }
}

export type loginInterface = {
    userDetails : object
}

export interface commonReducerInterface {
    commonLoader: boolean,
    isLoggedIn: boolean,
    userDetails: object,
    selectedMenu: {
        menuTitle: String,
        submenuTitle: String
    }
}

let initialState: commonReducerInterface = {
    commonLoader: true,
    isLoggedIn: false,
    userDetails: {},
    selectedMenu: {
        menuTitle: '',
        submenuTitle: ''
    }
}

// list of action which are used inside the reducers
const setSelectedMenu = createAction<commonReducerInterface>(SET_SELECTED_MENU)
const closeCommonLoaderAction = createAction<commonReducerInterface>(CLOSE_COMMON_LOADER)
const loginUser = createAction<loginInterface>(LOGIN_USER)
const logout = createAction<commonReducerInterface>(LOG_OUT)


export const commonReducer = createReducer(initialState, (builder) => {

    // function to updated newly fetched products from server
    builder.addCase(setSelectedMenu, (state, action) => {
        // console.log('setSelectedMenu action',action.payload)
        state.selectedMenu = {
            menuTitle: action.payload.selectedMenu.menuTitle,
            submenuTitle: action.payload.selectedMenu.submenuTitle
        };
    })

    // function to update the commonloader to false state
    builder.addCase(closeCommonLoaderAction, (state, action) => {
        state.commonLoader = false
    })

    // function to update login user details
    builder.addCase(loginUser , (state , action) => {
        state.userDetails = action.payload.userDetails,
        state.isLoggedIn = true,
        state.commonLoader = false
    })

    // function to update while user logout
    builder.addCase(logout , (state , action) => {
        state.userDetails = {},
        state.isLoggedIn = false
    })

})