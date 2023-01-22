import { LOGIN_USER, ON_LOGIN, ON_LOGTOUT } from "../actionConstants"
import { loginInterface } from "../reducers/commonReducer"


export const setUserDetails = (data: loginInterface) => {
    return { type: LOGIN_USER, payload: data.userDetails }
}

export const onLogout = () => {
    return { type: ON_LOGTOUT }
}

export const onLogin = (data : loginInterface) =>{
    return {type : ON_LOGIN , payload : data.userDetails}
}