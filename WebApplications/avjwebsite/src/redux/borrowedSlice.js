import { createSlice, current } from "@reduxjs/toolkit";

const BorrowedSlice = createSlice({
    name: "borrowed",
    initialState: {
        data: [],
        totalCount : 0,
        status: 'loading',
    },
    reducers: {

        updateBorrowedList: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateBorrowedLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetBorrowedList: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        }
    },
})

export const {
     updateBorrowedList , updateBorrowedLoader , resetBorrowedList
     } = BorrowedSlice.actions

export default BorrowedSlice.reducer