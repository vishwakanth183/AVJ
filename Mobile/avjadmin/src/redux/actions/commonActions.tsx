import { CLOSE_COMMON_LOADER, LOGIN_USER, LOG_OUT, SET_SELECTED_MENU } from "../actionConstants"
import { loginInterface, menuInterface } from "../reducers/commonReducer"

export const setCurrentSelectedMenu = (data: menuInterface) =>{
    return {type : SET_SELECTED_MENU , payload : data}
}

export const closeCommonLoader = () =>{
    return {type : CLOSE_COMMON_LOADER }
}