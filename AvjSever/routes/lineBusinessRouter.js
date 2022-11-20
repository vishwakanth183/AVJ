const router = require('express').Router();
const lineBusinessController = require('../controller/lineBusinessController')
const {verifyTokenAndAdmin , verificationToken} = require('./verifyToken')

//Router to create a LineBusiness
router.post('/createLineBusiness',verifyTokenAndAdmin,lineBusinessController.createLineBusiness)

//Router to get a particular LineBusiness
router.post('/getSingleLineBusinessDetails',verifyTokenAndAdmin,lineBusinessController.getSingleLineBusinessDetails)

//Router to update an LineBusiness
router.put('/updateLineBusiness',lineBusinessController.updateLineBusiness)

//Router to get a particular LineBusiness based on name
router.post('/getAllLineBusiness',verifyTokenAndAdmin,lineBusinessController.getAllLineBusiness)



module.exports = router