import { combineReducers } from "@reduxjs/toolkit";

// List of reducers that will be used in the application is listed below
import { productReducer } from "./reducers/productReducer";
import { commonReducer } from "./reducers/commonReducer";

const rootReducer = combineReducers({
    productReducer,commonReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer