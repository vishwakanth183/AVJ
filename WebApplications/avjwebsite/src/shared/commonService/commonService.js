
class commonService{
    priceFormatter = (price) =>{
       return new Intl.NumberFormat('en-In', { minimumFractionDigits: 2 }).format(price)
    }
}

const CommonService = new commonService()

export default CommonService