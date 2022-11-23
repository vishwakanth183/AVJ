const mongoose = require('mongoose')

const ManualOrderSchema = new mongoose.Schema({
    isCancelled: { type: Boolean, default: false },
    orderedProducts: [{
        _id: { type: String, required: true },
        productName: { type: String, required: true },
        brandName: { type: String, required: true, default: 'No brand' },
        labelArray: { type: Array, default: [] },
        weightUnit: { type: String, required: true },
        productType: { type: String, required: true },
        minimumStock: { type: Number, default: 0 },
        image: { type: String, default: null },
        purchasePrice: { type: Number, default: 0 },
        salesPrice: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
    }],
    checkoutSummary: {
        subtotal: { type: Number, required: true },
        orderPurchasePrice: { type: Number, required: true },
        orderSalesPrice: { type: Number, required: true },
        sgst: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        paidAmount: { type: Number, required: true },
        profit: { type: Number, required: true },
        finalPrice : {type : Number , required : true , default : 0},
        description : {type : String , default : ''}
    },
}, { timestamps: true }
)

module.exports = mongoose.model('ManualOrder', ManualOrderSchema)