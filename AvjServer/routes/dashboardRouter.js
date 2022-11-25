const router = require('express').Router();
const dashboardController = require('../controller/dashboardController')
const {verifyTokenAndAdmin } = require('./verifyToken')

//Router to create a Borrowed
router.post('/dashboardDetails',verifyTokenAndAdmin,dashboardController.getDashBoardDetails)

module.exports = router