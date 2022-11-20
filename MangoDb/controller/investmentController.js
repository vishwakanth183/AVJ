const Investment = require('../modals/Investment')
const statusCodes = require('../statusCodes')

//Function used to create a investment
const createInvestment = async (req, res) => {

    console.log('investmentData', req.body)

    await Investment.create({
        buyedFrom: req.body.buyedFrom,
        purchaseValue: req.body.purchaseValue,
        discount: req.body.discount,
        finalPrice: req.body.finalPrice,
        travelExpense: req.body.travelExpense,
        paidAmount : req.body.paidAmount,
        description: req.body.description,
        orderedProducts: req.body.orderedProducts
    }).then(() => {
        res.status(statusCodes.success).json('Investment created successfully')
    }).catch((error) => {
        console.log('error', error)
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating investment! Try Again!')
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

    const search = new RegExp(req.body.search)
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100


    await Investment.find({
        buyedFrom: search,
        $expr: req.body.paymentStatus === "Pending" ? { $lt: [ '$paidAmount' , '$finalPrice'] } : { $gte: [ '$paidAmount' , '$finalPrice'] }
    }).skip(offset).limit(limit).then(async (response) => {
        await Investment.count({
            buyedFrom: search,
            $expr: req.body.paymentStatus === "Pending" ? { $lt: [ '$paidAmount' , '$finalPrice'] } : { $gte: [ '$paidAmount' , '$finalPrice'] }
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