import { createSlice, current } from "@reduxjs/toolkit";

const Checkout = createSlice({
    name: "checkout",
    initialState: {
        seller: {
            value: null,
            touched: false
        },
        paymentType: {
            value: null,
            touched: false
        },
        onlinePaymentType: {
            value: null,
            touched: false
        }
    },
    reducers: {

        updateSeller: {
            reducer(state, action) {
                // console.log("Seller action" , action)
                state.seller = { value: action.payload.value, touched: action.payload.touched }
            }
        },

        updatePaymentType: {
            reducer(state, action) {
                // console.log('paymentTypeaction',action)
                state.paymentType = { value: action.payload.value, touched: action.payload.touched }
            }
        },

        updateOnlinePaymentType: {
            reducer(state, action) {
                state.onlinePaymentType = { value: action.payload.value, touched: action.payload.touched }
            }
        },

        refreshCheckout: {
            reducer(state, action) {
                state.seller = { value: null, touched: false };
                state.paymentType = { value: null, touched: false };
                state.onlinePaymentType = { value: null, touched: false };
            }
        }
    }
})

export const {
    updateSeller,
    updatePaymentType,
    updateOnlinePaymentType,
    refreshCheckout
} = Checkout.actions

export default Checkout.reducer