import { createSlice, current } from "@reduxjs/toolkit";

const FamilyExpenseSlice = createSlice({
    name: "familyExpense",
    initialState: {
        data: [],
        totalCount : 0,
        status: 'loading',
    },
    reducers: {

        updateExpenseList: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetExpenseList: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        }
    },
})

export const {
     updateExpenseList , updateLoader , resetExpenseList
     } = FamilyExpenseSlice.actions

export default FamilyExpenseSlice.reducer