import { SET_SELECTED_MENU } from "../actionConstants"
import { menuInterface } from "../reducers/commonReducer"

export const setCurrentSelectedMenu = (data: menuInterface) =>{
    return {type : SET_SELECTED_MENU , payload : data}
}