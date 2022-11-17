import { createSlice, current } from "@reduxjs/toolkit";

const LineBusinessSlice = createSlice({
    name: "lineBusiness",
    initialState: {
        data: [],
        totalCount : 0,
        status: 'loading',
    },
    reducers: {

        updateLineBusinessList: {
            reducer(state, action) {
                state.data = [...state.data, ...action.payload.listData]
                state.totalCount = action.payload.totalCount
                state.status = 'Fullfilled'
            }
        },

        updateLineBusinessLoader: {
            reducer(state, action) {
                state.status = 'loading'
            }
        },

        resetLineBusinessList: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        }
    },
})

export const {
     updateLineBusinessList , updateLineBusinessLoader , resetLineBusinessList
     } = LineBusinessSlice.actions

export default LineBusinessSlice.reducer