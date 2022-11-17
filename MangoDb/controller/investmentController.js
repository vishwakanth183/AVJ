const Investment = require('../modals/Investment')
const statusCodes = require('../statusCodes')

//Function used to create a investment
const createInvestment = async (req, res) => {

    console.log('investmentData', req.body)

    await Investment.create({
        sellerName: req.body.sellerName,
        buyerName: req.body.buyerName,
        paymentType: req.body.paymentType,
        onlinePaymentType: req.body.onlinePaymentType,
        actualPrice: req.body.actualPrice,
        discount: req.body.discount,
        finalPrice: req.body.finalPrice,
        description: req.body.description,
        orderedProducts: req.body.orderedProducts
    }).then(() => {
        res.status(statusCodes.success).json('Investment created successfully')
    }).catch((error) => {
        console.log('error', error)
        if (error.code === 11000) {
            res.status(11000).json("Duplicate Investment ! Can't add a Investment with same name more than once")
        }
        else {
            res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating investment! Try Again!')
        }
    })
}
module.exports.createInvestment = createInvestment

//Function to get a particular investment details
const getSingleInvestmentDetails = async (req, res) => {
    await Investment.findById(req.body.investmentId).then((investmentDetails) => {
        res.status(statusCodes.success).json(investmentDetails);
    }).catch((error) => {
        console.log("getSingleInvestmentDetails error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the investment details! Try Again!')
    })
}

module.exports.getSingleInvestmentDetails = getSingleInvestmentDetails

//Function to get all investment based on investment month
const getAllInvestment = async (req, res) => {

    const search = new RegExp('')
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100


    await Investment.find({
        buyerName: search,
        sellerName: search
    }).skip(offset).limit(limit).then(async (response) => {
        await Investment.count({
            buyerName: search,
            sellerName: search
        }).then((countRes) => {
            res.status(statusCodes.success).json({
                listData: response,
                totalCount: countRes
            });
        }).catch((err) => {
            res.status(statusCodes.notFound).json(err)
        })
    }).catch((error) => {
        res.status(statusCodes.notFound).json(error)
    })
}
module.exports.getAllInvestment = getAllInvestment

//Function to update a particular investment
const updateInvestment = async (req, res) => {
    console.log('req.query.investmentId', req.query.investmentId)
    await Investment.findByIdAndUpdate(req.query.investmentId, {
        $set: req.body.data
    }, { new: true }).then((updatedInvestment) => {
        res.status(statusCodes.success).json('Investment Updated Successfully');
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in updating the Investment! Try Again!')
    })
}
module.exports.updateInvestment = updateInvestment