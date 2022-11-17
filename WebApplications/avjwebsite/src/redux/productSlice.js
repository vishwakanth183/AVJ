import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
    name: "products",
    initialState: {
        data: [],
        totalCount: 0,
        status: 'loading',
        selectedProducts: []
    },
    reducers: {

        updateProductList: {
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

        updateSelectedProduct: {
            reducer(state, action) {
                console.log(action)
                const isSelected = state.selectedProducts.find((item) => item?._id === action?.payload?._id)
                // console.log('isSelected', isSelected);
                if (isSelected) {
                    const newSelectedProducts = state.selectedProducts.filter((item) => item._id !== isSelected._id);
                    state.selectedProducts = newSelectedProducts
                }
                else {
                    state.selectedProducts = [...state.selectedProducts, ...[{ ...action.payload, quantity: 1 }]]
                }
            }
        },

        updateProductDescription: {
            reducer(state, action) {
                // console.log('action.payload', action.payload)
                let cartProducts = state.selectedProducts;
                cartProducts.map((item) => {
                    if (item._id === action.payload.id) {
                        // console.log('Yup found')
                        item.description = action.payload.description
                    }
                    return null
                })
                // console.log('cartProducts After opertaion', current(cartProducts))
                state.selectedProducts = cartProducts
            }
        },

        updateProductQuantity: {
            reducer(state, action) {
                let cartProducts = state.selectedProducts;
                // console.log('quanity action',action.payload)
                cartProducts.map((item) => {
                    if (item._id === action.payload.id) {
                        item.quantity = action.payload.quantity
                    }
                    return null
                })
                // console.log('cartProducts After opertaion', current(cartProducts))
                state.selectedProducts = cartProducts
            }
        },

        updateOrderSalesPrice: {
            reducer(state, action) {
                let cartProducts = state.selectedProducts;
                // console.log('updateOrderSalesPrice action',action.payload)
                cartProducts.map((item) => {
                    if (item._id === action.payload.id) {
                        item.salesPrice = action.payload.salesPrice
                    }
                    return null
                })
                state.selectedProducts = cartProducts
            }
        },

        updateOrderTaxPrice: {
            reducer(state, action) {
                let cartProducts = state.selectedProducts;
                // console.log('updateOrderTaxPrice action',action.payload)
                cartProducts.map((item) => {
                    if (item._id === action.payload.id) {
                        item.productTax = action.payload.productTax
                    }
                    return null
                })
                state.selectedProducts = cartProducts
            }
        },

        resetProductList: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
            }
        },

        resetManualOrder: {
            reducer(state, action) {
                state.data = []
                state.status = 'loading'
                state.selectedProducts = []
                state.totalCount = 0
            }
        },

        updateOrderedProducts : {
            reducer(state, action) {
                state.selectedProducts = action.payload;
            }
        }
    },
})

export const {
    updateProductList, updateLoader,
    resetProductList, updateSelectedProduct,
    updateProductDescription, updateProductQuantity,
    updateOrderSalesPrice, updateOrderTaxPrice,
    resetManualOrder , updateOrderedProducts
} = ProductSlice.actions

export default ProductSlice.reducer