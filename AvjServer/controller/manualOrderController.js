const ManualOrder = require('../modals/ManualOrder')
const Products = require('../modals/Product')
const statusCodes = require('../statusCodes')

const monthsLong = {
    January: '1', February: '2', March: '3', April: '4', May: '5', June: '6', July: '7', August: '8',
    September: '9', October: '10', November: '11', December: '12'
};


//Method used to create a new manual order on the table
const createManualOrder = async (req, res) => {

    const session = await mydb.startSession()

    const checkoutData = req.body.checkoutData;

    try {
        session.startTransaction();

        if (checkoutData.orderedProducts && checkoutData.orderedProducts.length) {

            checkoutData.orderedProducts.map(async (product) => {
                await Products.findById({ _id: product._id }).then(async (productResponse) => {
                    let currentProduct = productResponse
                    const currentStock = productResponse.stock;
                    currentProduct.stock = currentStock - product.quantity;
                    await Products.findByIdAndUpdate({ _id: product._id }, { $set: currentProduct })
                })
            })

            await ManualOrder.create([{
                orderedProducts: checkoutData.orderedProducts,
                checkoutSummary: checkoutData.checkoutSummary,
                isCancelled: checkoutData.isCancelled
            }], { session: session }).then((orderRes) => {
                console.log('orderRes', orderRes)
                res.status(statusCodes.success).json('Manual Order Created Successfully')
            })

            await session.commitTransaction();
        }
    }
    catch (error) {
        console.log('error', error)
        res.status(statusCodes.unprocessableEntity).json(error)
        await session.abortTransaction();
    }
    session.endSession();
}
module.exports.createManualOrder = createManualOrder

//Method used to current order by user query
const getCurrentOrdersByQuery = async (req, res) => {

    const search = req.body.search
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100

    let endDate = new Date();
    let startDate;
    if (req.query.currentDay) {
        startDate = new Date().setUTCHours(0, 0, 0, 0);
        endDate = new Date().setUTCHours(23, 59, 59, 999);
    }
    else if (req.query.currentWeek) {
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    }
    else if (req.query.currentMonth) {
        startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    else if (req.query.currentYear) {
        startDate = new Date(new Date().getFullYear(), 0, 1)
    }
    console.log(startDate, endDate)

    try {
        await ManualOrder.find(
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: startDate ? endDate : null },
                },
                ...{...search && {_id : search}},
                $expr: req.body.paymentStatus === "Paid" ? { $gte: ['$checkoutSummary.paidAmount', '$checkoutSummary.finalPrice'] } : { $gt: ['$checkoutSummary.finalPrice', '$checkoutSummary.paidAmount'] }
            },
        ).skip(offset).limit(limit).sort({ createdAt: -1 }).then(async (orderRes) => {
            await ManualOrder.count({
                $match: {
                    createdAt: { $gte: startDate, $lt: startDate ? endDate : null },
                },
                ...{...search && {_id : search}},
                $expr: req.body.paymentStatus === "Paid" ? { $gte: ['$checkoutSummary.paidAmount', '$checkoutSummary.finalPrice'] } : { $gt: ['$checkoutSummary.finalPrice', '$checkoutSummary.paidAmount'] }
            },).then((countRes) => {
                res.status(statusCodes.success).json({
                    listData: orderRes,
                    totalCount: countRes
                })
            })
        })
    }
    catch (err) {
        console.log('Order data fetch error', err);
        if(search)
        {
            res.status(statusCodes.unprocessableEntity).json('Invalid orderId')
        }
        else
        {
            res.status(statusCodes.unprocessableEntity).json(err)
        }
    }
}
module.exports.getCurrentOrdersByQuery = getCurrentOrdersByQuery


//Method used to edit particular order query
const updateManualOrder = async (req, res) => {
    // console.log('single order data req', req.body.data.checkoutData);
    const session = await mydb.startSession();
    let previousData;

    const checkoutData = req.body.data.checkoutData;

    try {
        session.startTransaction();

        await ManualOrder.findById(req.query.orderId).then(async (singleOrderRes) => {

            if (checkoutData.orderedProducts && checkoutData.orderedProducts.length) {

                // Update deleted products stock
                singleOrderRes.orderedProducts.map(async (product) => {
                    const isProduct = checkoutData.orderedProducts.find((item) => item._id === product._id)
                    if (!isProduct) {
                        await updateProductQuantity({ productId: product._id, quantity: product.quantity, increment: true })
                    }
                })

                // Update existing product and newly added products stock
                checkoutData.orderedProducts.map(async (product) => {
                    const oldProduct = singleOrderRes.orderedProducts.find((item) => item._id === product._id);
                    if (oldProduct) {
                        const previousQuantity = oldProduct.quantity;
                        const currentQuantity = product.quantity;
                        let difference = Math.abs(currentQuantity - previousQuantity);
                        if (previousQuantity > currentQuantity) {
                            await updateProductQuantity({ productId: product._id, quantity: difference, increment: true })
                        }
                        else if (previousQuantity < currentQuantity) {
                            await updateProductQuantity({ productId: product._id, quantity: difference })
                        }
                    }
                    else {
                        await updateProductQuantity({ productId: product._id, quantity: product.quantity })
                    }
                })

                await ManualOrder.findByIdAndUpdate(
                    req.query.orderId,
                    {
                        $set: {
                            isCancelled: checkoutData.isCancelled,
                            checkoutSummary: checkoutData.checkoutSummary,
                            orderedProducts: checkoutData.orderedProducts,
                        }
                    }
                    , { session: session }).then((orderRes) => {
                        console.log('orderRes', orderRes)
                        res.status(statusCodes.success).json('Manual Order Updated Successfully')
                    })

                await session.commitTransaction();
            }
        })
    }
    catch (error) {
        console.log('error', error)
        res.status(statusCodes.unprocessableEntity).json(error)
        await session.abortTransaction();
    }
    session.endSession();
}
module.exports.updateManualOrder = updateManualOrder

//Function to get a particular order details
const getSingleOrderDetails = async (req, res) => {
    await ManualOrder.findById(req.body.orderId).then(async (orderDetails) => {
        try {
            await getOrderedProductDetails({ products: orderDetails.orderedProducts }).then((updatedSelecedProducts) => {
                // console.log('updatedSelecedProducts', updatedSelecedProducts)
                res.status(statusCodes.success).json({
                    orderDetails: orderDetails,
                    updatedSelecedProducts: updatedSelecedProducts
                });
            }).catch((error) => {
                console.log('error', error)
                res.status(statusCodes.unprocessableEntity).json(error)
            })
        }
        catch (err) {
            res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the order details! Try Again!')
        }
        // orderDetails.orderedProducts.map(async (product) => {
        //     console.log('products', product)
        //    const updateSelectedProducts =  await getCurrentProducts();
        // })
        // console.log('updated selected products', updatedSelecedProducts)
    }).catch((error) => {
        console.log("Get single order error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the order details! Try Again!')
    })
}
module.exports.getSingleOrderDetails = getSingleOrderDetails

//Function to get current product details
const getOrderedProductDetails = async ({ products = [] }) => {
    let updatedProducts = []
    try {
        return Promise.all(
            products.map((item) => {
                return getCurrentProductDetails({ productId: item._id, quantity: item.quantity })
            })
        )
    }
    catch (err) {
        console.log('getCurrentProduct details', err)
        Promise.reject(err)
    }
}

//Method use to get single updated product details
const getCurrentProductDetails = ({ productId, quantity }) => {
    return Products.findById(productId).then((productResponse) => {
        let currentProduct = productResponse.toJSON()
        currentProduct['quantity'] = quantity
        currentProduct['previousQuantity'] = quantity
        return Promise.resolve(currentProduct)
    }).catch((err) => {
        throw new Error(err)
    })
}

//Method used to update quanity
const updateProductQuantity = async ({ productId, quantity, increment = false }) => {
    try {
        await Products.findById({ _id: productId }).then(async (productResponse) => {
            let restoreProduct = productResponse
            if (increment) {
                restoreProduct.stock = productResponse.stock + quantity;
            }
            else {
                restoreProduct.stock = productResponse.stock - quantity;
            }
            await Products.findByIdAndUpdate({ _id: productId }, { $set: restoreProduct })
        })
    }
    catch (err) {
        throw new Error(err)
    }

}

module.exports.updateProductQuantity = updateProductQuantity

//Method used to cancel order
const cancelOrder = async (req, res) => {
    console.log('cancel order called')

    const session = await mydb.startSession();

    const orderId = req.body.orderId;

    try {
        session.startTransaction();

        await ManualOrder.findById(orderId).then(async (singleOrderRes) => {
            // Update deleted products stock
            singleOrderRes.orderedProducts.map(async (product) => {
                await updateProductQuantity({ productId: product._id, quantity: product.quantity, increment: true }, { session: session })
            })
        })

        await ManualOrder.findByIdAndUpdate(orderId, {
            $set: { isCancelled: true }
        })

        res.status(statusCodes.success).json('Order Cancelled Successfully')

        await session.commitTransaction();

    }
    catch (error) {
        console.log('cancel order error', error)
        res.status(statusCodes.unprocessableEntity).json(error)
        await session.abortTransaction();
    }
    session.endSession();
}

module.exports.cancelOrder = cancelOrder

