const router = require('express').Router();
const manualOrderController = require('../controller/manualOrderController')
const {verifyTokenAndAdmin} = require('./verifyToken')

//ROUTER TO CREATE NEW ORDER
router.post('/createManualOrder',verifyTokenAndAdmin,manualOrderController.createManualOrder)

//ROUTER TO FETCH MANUAL ORDER LIST
router.post('/getAllManualOrder',verifyTokenAndAdmin,manualOrderController.getCurrentOrdersByQuery)

//Router to get a particular order details
router.post('/getSingleOrderDetails',verifyTokenAndAdmin,manualOrderController.getSingleOrderDetails)

//Router to update an order
router.put('/updateManualOrder',manualOrderController.updateManualOrder)

//Router to cancel order
router.post('/cancelOrder',verifyTokenAndAdmin,manualOrderController.cancelOrder)


module.exports = router