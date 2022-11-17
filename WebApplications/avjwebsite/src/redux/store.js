import { configureStore } from "@reduxjs/toolkit";

//Slice imports
import HttpRouterSlice from "./HttpRouting/httpRoutingRedux";
import CommonSlice from "./commonSlice";
import CheckoutSlice from "./checkoutSlice";
import familyExpenseSlice from "./familyExpenseSlice";
import ProductSlice from "./productSlice";
import InvestmentSlice from "./investmentSlice";
import BorrowedSlice from "./borrowedSlice";
import LineBusinessSlice from "./lineBusinessSlice";
import ManualOrderSlice from "./manualOrderSlice";
import RestoredProductSlice from "./restoredProductSlice";


const store = configureStore({
    reducer : {
        httpRouting : HttpRouterSlice,
        commonReducer : CommonSlice,
        checkout : CheckoutSlice,
        products : ProductSlice,
        familyExpense : familyExpenseSlice,
        investment : InvestmentSlice,
        borrowed : BorrowedSlice,
        lineBusiness : LineBusinessSlice,
        manualOrder : ManualOrderSlice,
        restoredProducts : RestoredProductSlice
    }
})

export default store