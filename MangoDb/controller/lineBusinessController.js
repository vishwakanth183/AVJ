const LineBusiness = require('../modals/LineBusiness')
const statusCodes = require('../statusCodes')

//Function used to create a LineBusiness
const createLineBusiness = async (req, res) => {

    console.log('LineBusinessData', req.body)

    await LineBusiness.create({
        buyedFrom: req.body.buyedFrom,
        soldTo: req.body.soldTo,
        purchaseValue: req.body.purchaseValue,
        soldValue: req.body.soldValue,
        paidAmount: req.body.paidAmount,
        travelExpense: req.body.travelExpense,
        profit: req.body.profit,
        description: req.body.description,
        orderedProducts: req.body.orderedProducts
    }).then(() => {
        res.status(statusCodes.success).json('LineBusiness created successfully')
    }).catch((error) => {
        console.log('error', error)
        if (error.code === 11000) {
            res.status(11000).json("Duplicate LineBusiness ! Can't add a LineBusiness with same name more than once")
        }
        else {
            res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating LineBusiness! Try Again!')
        }
    })
}
module.exports.createLineBusiness = createLineBusiness

//Function to get a particular LineBusiness details
const getSingleLineBusinessDetails = async (req, res) => {
    await LineBusiness.findById(req.body.linebusinessId).then((lineBusinessDetails) => {
        res.status(statusCodes.success).json(lineBusinessDetails);
    }).catch((error) => {
        console.log("getSingleLineBusinessDetails error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the LineBusiness details! Try Again!')
    })
}

module.exports.getSingleLineBusinessDetails = getSingleLineBusinessDetails

//Function to get all LineBusiness based on LineBusiness month
const getAllLineBusiness = async (req, res) => {

    let paymentStatusArray = [req.body.paymentStatus]

    if (req.body.paymentStatus === 'Pending') {
        paymentStatusArray.push('Cancelled')
    }

    const search = new RegExp(req.body.search)
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100

    await LineBusiness.find({
        buyedFrom: search,
        // soldTo: search,
        // $or : [{'buyedFrom' : search , 'soldTo' : search}],
        $expr: req.body.paymentStatus === "Pending" ? { $lt: ['$paidAmount', '$soldValue'] } : { $gte: ['$paidAmount', '$soldValue'] }
    }).skip(offset).limit(limit).then(async (response) => {
        await LineBusiness.count({
            buyedFrom: search,
            // soldTo: search,
            $expr: req.body.paymentStatus === "Pending" ? { $lt: ['$paidAmount', '$soldValue'] } : { $gte: ['$paidAmount', '$soldValue'] }
        }).then((countRes) => {
            // console.log('totalCount', countRes)
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
module.exports.getAllLineBusiness = getAllLineBusiness

//Function to update a particular LineBusiness
const updateLineBusiness = async (req, res) => {
    console.log('req.query.linebusinessId', req.query.linebusinessId)
    await LineBusiness.findByIdAndUpdate(req.query.linebusinessId, {
        $set: req.body.data
    }, { new: true }).then((updatedLineBusiness) => {
        res.status(statusCodes.success).json('LineBusiness Updated Successfully');
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in updating the LineBusiness! Try Again!')
    })
}
module.exports.updateLineBusiness = updateLineBusiness