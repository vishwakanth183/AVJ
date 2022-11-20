const Borrowed = require('../modals/Borrowed')
const statusCodes = require('../statusCodes')

//Function used to create a Borrowed
const createBorrowed = async (req, res) => {

    console.log('BorrowedData', req.body)

    await Borrowed.create({
        borrowedFrom: req.body.borrowedFrom,
        borrowedAmount: req.body.borrowedAmount,
        interestPercentage: req.body.interestPercentage,
        interestPaid: req.body.interestPaid,
        paidAmount: req.body.paidAmount,
        description: req.body.description,
    }).then(() => {
        res.status(statusCodes.success).json('Borrowed Data created successfully')
    }).catch((error) => {
        console.log('error', error)
        if (error.code === 11000) {
            res.status(11000).json("Duplicate Borrowed ! Can't add a Borrowed with same name more than once")
        }
        else {
            res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating Borrowed! Try Again!')
        }
    })
}
module.exports.createBorrowed = createBorrowed

//Function to get a particular Borrowed details
const getSingleBorrowedDetails = async (req, res) => {
    await Borrowed.findById(req.body.borrowedId).then((borrowedDetails) => {
        res.status(statusCodes.success).json(borrowedDetails);
    }).catch((error) => {
        console.log("getSingleBorrowedDetails error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the Borrowed details! Try Again!')
    })
}

module.exports.getSingleBorrowedDetails = getSingleBorrowedDetails

//Function to get all Borrowed based on Borrowed month
const getAllBorrowed = async (req, res) => {

    console.log('Get All Borrowed' , req.body.paymentStatus)

    const search = new RegExp(req.body.search)
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100

    await Borrowed.find({
        borrowedFrom: { $regex: search, $options: 'i' },
        $expr: req.body.paymentStatus === "Pending" ? { $lt: [ '$paidAmount' , '$borrowedAmount'] } : { $gte: [ '$paidAmount' , '$borrowedAmount'] }
    }).skip(offset).limit(limit).then(async (response) => {
        await Borrowed.count({
            borrowedFrom: { $regex: search, $options: 'i' },
            $expr: req.body.paymentStatus === "Pending" ? { $lt: [ '$paidAmount' , '$borrowedAmount'] } : { $gte: [ '$paidAmount' , '$borrowedAmount'] }
        }).then((countRes) => {
            res.status(statusCodes.success).json({
                listData: response,
                totalCount: countRes
            });
        }).catch((err) => {
            res.status(statusCodes.notFound).json(err)
        })
    }).catch((error) => {
        console.log('catch error borrowed',error)
        res.status(statusCodes.notFound).json(error)
    })
}
module.exports.getAllBorrowed = getAllBorrowed

//Function to update a particular Borrowed
const updateBorrowed = async (req, res) => {
    console.log('req.query.borrowedId', req.query.borrowedId)
    await Borrowed.findByIdAndUpdate(req.query.borrowedId, {
        $set: req.body.data
    }, { new: true }).then((updatedBorrowed) => {
        res.status(statusCodes.success).json('Borrowed Updated Successfully');
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in updating the Borrowed! Try Again!')
    })
}
module.exports.updateBorrowed = updateBorrowed