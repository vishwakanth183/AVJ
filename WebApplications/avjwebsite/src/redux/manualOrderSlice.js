import { createSlice, current } from "@reduxjs/toolkit";

const ManualOrderSlice = createSlice({
    name: "manualOrder",
    initialState: {
        data: [],
        totalCount : 0,
        status: 'loading',
    },
    reducers: {

        updateManualOrder: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateManualOrderLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetManualOrderList : {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        }
    },
})

export const {
     updateManualOrder , updateManualOrderLoader , resetManualOrderList 
     } = ManualOrderSlice.actions

export default ManualOrderSlice.reducer