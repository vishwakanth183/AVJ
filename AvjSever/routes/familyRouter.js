const router = require('express').Router();
const familyController = require('../controller/familyController')
const {verifyTokenAndAdmin , verificationToken} = require('./verifyToken')

//Router to create a family expense
router.post('/createExpense',verifyTokenAndAdmin,familyController.createExpense)

//Router to get a particular family expense
router.post('/getSingleExpenseDetails',verifyTokenAndAdmin,familyController.getSingleExpenseDetails)

//Router to update an expense
router.put('/updateExpense',familyController.updateExpense)

//Router to get a particular expense based on name
router.post('/getAllExpenses',verificationToken,familyController.getAllExpense)



module.exports = router