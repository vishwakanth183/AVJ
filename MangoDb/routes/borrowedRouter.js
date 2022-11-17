const router = require('express').Router();
const borrowedController = require('../controller/borrowedController')
const {verifyTokenAndAdmin , verificationToken} = require('./verifyToken')

//Router to create a Borrowed
router.post('/createBorrowed',verifyTokenAndAdmin,borrowedController.createBorrowed)

//Router to get a particular Borrowed
router.post('/getSingleBorrowedDetails',verifyTokenAndAdmin,borrowedController.getSingleBorrowedDetails)

//Router to update an Borrowed
router.put('/updateBorrowed',borrowedController.updateBorrowed)

//Router to get a particular Borrowed based on name
router.post('/getAllBorrowed',verificationToken,borrowedController.getAllBorrowed)



module.exports = router