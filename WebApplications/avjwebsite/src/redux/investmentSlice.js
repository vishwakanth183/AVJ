import { createSlice, current } from "@reduxjs/toolkit";

const InvestmentSlice = createSlice({
    name: "investment",
    initialState: {
        data: [],
        totalCount : 0,
        status: 'loading',
    },
    reducers: {

        updateInvestmentList: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateInvestmentLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetInvestmentList: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        }
    },
})

export const {
     updateInvestmentList , updateInvestmentLoader , resetInvestmentList
     } = InvestmentSlice.actions

export default InvestmentSlice.reducer