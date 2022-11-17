const mongoose = require('mongoose')

const ManualOrderSchema = new mongoose.Schema({
    customerName: { type: String, default: 'Unknown' },
    sellerName: { type: String, required: true },
    paymentType: { type: String, required: true },
    onlinePaymentType: { type: String, default: null },
    paymentStatus: { type: String, required: true },
    orderedProducts: [{
        _id: { type: String, required: true },
        image: { type: String, default: null },
        productName: { type: String, required: true },
        productType: { type: String, required: true },
        productTax: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        purchasePrice: { type: Number, required: true },
        salesPrice: { type: Number, required: true },
        weightUnit: { type: String, required: true },
        stock: { type: Number, required: true },
    }],
    checkoutSummary: {
        subtotal: { type: Number, required: true },
        orderPurchasePrice: { type: Number, required: true },
        orderSalesPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 }
    },
}, { timestamps: true }
)

module.exports = mongoose.model('ManualOrder', ManualOrderSchema)