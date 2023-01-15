import axios from "axios"

class productService {
   async getAllProducts()
    {
        axios.get('http://localhost:3000/products').then((res) => {
            console.log('res',res)
            return res
        }).catch((error) => {
            throw new Error(error)
        })  
    }
}

export const ProductService = new productService