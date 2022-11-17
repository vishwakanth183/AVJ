import { createSlice, current } from "@reduxjs/toolkit";

const RestoredProductSlice = createSlice({
    name: "restoredProducts",
    initialState: {
        data: [],
        totalCount: 0,
        status: 'loading',
    },
    reducers: {

        updateRestoredProductList: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateRestoredProductLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetRestoredProductList: {
            reducer(state, action) {
                state.status = 'loading'
                state.data = []
            }
        },
    },
})

export const {
    updateRestoredProductList, updateRestoredProductLoader, resetRestoredProductList
} = RestoredProductSlice.actions

export default RestoredProductSlice.reducer