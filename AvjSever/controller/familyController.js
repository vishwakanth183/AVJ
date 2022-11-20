const Family = require('../modals/FamilyExpense')
const statusCodes = require('../statusCodes')

//Function used to create a product
const createExpense = async (req, res) => {

    console.log('expenseData', req.body)

    const expenseData = {
        'month': req.body.month,
        'year': req.body.year,
        'totalExpense': req.body.totalExpense
    }


    Family.findOne({
        month: req.body.month,
        year: req.body.year
    }).then(async(data) => {
        if (!data) {
            await Family.create({
                month: expenseData.month,
                year: expenseData.year,
                totalExpense: expenseData.totalExpense
            }).then(() => {
                res.status(statusCodes.success).json('Expense created successfully')
            }).catch((error) => {
                    res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating expense! Try Again!')
            })
        }
        else {
            res.status(statusCodes.unprocessableEntity).json("Duplicate expense ! Can't add an expense with same month and same year more than once")
        }
    })
}
module.exports.createExpense = createExpense

//Function to get a particular expense details
const getSingleExpenseDetails = async (req, res) => {
    await Family.findById(req.body.expenseId).then((expenseDetails) => {
        res.status(statusCodes.success).json(expenseDetails);
    }).catch((error) => {
        console.log("getSingleExpenseDetails error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the expense details! Try Again!')
    })
}

module.exports.getSingleExpenseDetails = getSingleExpenseDetails

//Function to get all Expense based on expense month
const getAllExpense = async (req, res) => {

    const search = new RegExp(req.body.search)
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100

    await Family.find({
        month: search,
    }).skip(offset).limit(limit).then(async (response) => {
        await Family.count({
            month: search
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
module.exports.getAllExpense = getAllExpense

//Function to update a particular expense
const updateExpense = async (req, res) => {
    console.log('req.query.expenseId', req.query.expenseId)
    await Family.findByIdAndUpdate(req.query.expenseId, {
        $set: req.body.data
    }, { new: true }).then((updatedExpense) => {
        res.status(statusCodes.success).json('Expense Updated Successfully');
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in updating the Expense! Try Again!')
    })
}
module.exports.updateExpense = updateExpense