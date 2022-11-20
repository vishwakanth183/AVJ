
class commonService {

    // Price formatter
    priceFormatter = (price , round = false) => {
        const formattedPrice = new Intl.NumberFormat('en-In', { minimumFractionDigits: 2 }).format(price)
        if(!round)
        {
            return formattedPrice
        }
        else
        {
            return Math.round(formattedPrice)
        }
    }

    // Progress loader value
    progressLoader = ({ totalAmount = 0, amountPaid = 0 }) => {
        const percentage = (amountPaid / totalAmount) * 100
        return percentage.toFixed(0)
    }
}

const CommonService = new commonService()

export default CommonService