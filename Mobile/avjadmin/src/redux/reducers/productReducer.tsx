import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit"

// Custom imports
import { SET_PRODUCTS } from "../actionConstants"


export interface productInterface  {
    loading : boolean,
    listData : any
}

let initialState : productInterface = {
    loading: false,
    listData: []
}

// list of action which are used inside the reducers
const setProductsAction = createAction(SET_PRODUCTS)


export const productReducer = createReducer(initialState , (builder) =>{

    // function to updated newly fetched products from server
    builder.addCase(setProductsAction, (state , action )=>{
        // console.log('ACTION',action.payload)
        state.listData = action.payload;
    })

})