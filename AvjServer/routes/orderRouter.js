const router = require('express').Router();
const orderController = require('../controller/orderController')
const {verifyTokenAndAdmin} = require('./verifyToken')

//ROUTER TO CREATE NEW ORDER
router.post('/createOrder',verifyTokenAndAdmin,orderController.createOrder)

//ROUTER TO FETCH ORDER DATA BASED ON YEAR
router.post('/getOrderByYear',verifyTokenAndAdmin,orderController.getOrderByYear)

//ROUTER TO FETCH ORDER DATA BASED ON MONTHS
router.post('/getOrderByMonth',verifyTokenAndAdmin,orderController.getOrderByMonth)

//ROUTER TO FETCH ORDER DATA BASED ON WEEKS
router.post('/getOrderByWeeks',verifyTokenAndAdmin,orderController.getOrderByWeeks)

//ROUTER TO FETCH ORDER DATA BASED ON DAYS
router.post('/getOrderByHours',verifyTokenAndAdmin,orderController.getOrderByHours)

//ROUTER TO FETCH ORDER DATA BASED ON MOMENT
router.post('/getOrderByMoment',verifyTokenAndAdmin,orderController.getOrderByMoment)


module.exports = router