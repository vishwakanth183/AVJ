const router = require('express').Router();
const investmentController = require('../controller/investmentController')
const {verifyTokenAndAdmin , verificationToken} = require('./verifyToken')

//Router to create a investment
router.post('/createInvestment',verifyTokenAndAdmin,investmentController.createInvestment)

//Router to get a particular investment
router.post('/getSingleInvestmentDetails',verifyTokenAndAdmin,investmentController.getSingleInvestmentDetails)

//Router to update an investment
router.put('/updateInvestment',investmentController.updateInvestment)

//Router to get a particular investment based on name
router.post('/getAllInvestment',verifyTokenAndAdmin,investmentController.getAllInvestment)



module.exports = router