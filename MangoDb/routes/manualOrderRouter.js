const router = require('express').Router();
const manualOrderController = require('../controller/manualOrderController')
const {verifyTokenAndAdmin} = require('./verifyToken')

//ROUTER TO CREATE NEW ORDER
router.post('/createManualOrder',verifyTokenAndAdmin,manualOrderController.createManualOrder)

//ROUTER TO FETCH MANUAL ORDER LIST
router.post('/getAllManualOrder',verifyTokenAndAdmin,manualOrderController.getCurrentOrdersByQuery)

//ROUTER TO FETCH PREVIOUS ORDER DATA BASED ON QUERY
router.post('/getPreviousOrdersByQuery',verifyTokenAndAdmin,manualOrderController.getPreviousOrdersByQuery)

//ROUTER TO FETCH ORDER DATA BASED ON PARTICULAR TIME PERIOD
router.post('/particularOrdersByQuery',verifyTokenAndAdmin,manualOrderController.particularOrdersByQuery)

//Router to get a particular order details
router.post('/getSingleOrderDetails',verifyTokenAndAdmin,manualOrderController.getSingleOrderDetails)

//Router to update an order
router.put('/updateManualOrder',manualOrderController.updateManualOrder)


module.exports = router