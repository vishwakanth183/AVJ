import { createAction, createReducer , PayloadAction } from "@reduxjs/toolkit"

// Custom imports
import { SET_SELECTED_MENU } from "../actionConstants"

export type menuInterface = {
    selectedMenu : {
        menuTitle : String,
        submenuTitle : String
    }
}

export interface commonReducerInterface  {
    isLoggedIn : boolean,
    userDetails : any,
    selectedMenu : {
        menuTitle : String,
        submenuTitle : String
    }
}

let initialState : commonReducerInterface = {
    isLoggedIn : false,
    userDetails : null,
    selectedMenu : {
        menuTitle: '',
        submenuTitle: ''
    }
}

// list of action which are used inside the reducers
const setSelectedMenu = createAction<commonReducerInterface>(SET_SELECTED_MENU)


export const commonReducer = createReducer(initialState , (builder) =>{

    // function to updated newly fetched products from server
    builder.addCase(setSelectedMenu, (state , action)=>{
        // console.log('setSelectedMenu action',action.payload)
        state.selectedMenu = {
            menuTitle : action.payload.selectedMenu.menuTitle,
            submenuTitle : action.payload.selectedMenu.submenuTitle
        };
    })

})