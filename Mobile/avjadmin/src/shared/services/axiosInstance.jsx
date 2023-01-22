import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { environment } from "../env";

// const CancelToken = axios.CancelToken;
// let cancel;

const axiosInstance = axios.create()

// interface configInterface{
//     headers : {
//         "Authorization" : String,
//         "Access-Control-Allow-Origin" : String,
//         "origin" : String
//     }
// }

axiosInstance.interceptors.request.use(async function (config) {

    // console.log('url',url)

    const token = await AsyncStorage.getItem('authToken')

    config.headers.Authorization = 'Bearer ' + token
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['origin'] = environment.API_URL

    // if (cancel) {
    //     cancel(); // cancel request
    // }

    // config.cancelToken = new CancelToken(function executor(cancelor) {
    //     cancel = cancelor;
    // });

    return config;
}, function (error) {
    console.log("axios request error")
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(async function (response) {
    return response
}, function (error) {
    console.log("axios response error")
    return Promise.reject(error)
})

export default axiosInstance