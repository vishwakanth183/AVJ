const mongoose = require('mongoose')

const InvestmentSchema = new mongoose.Schema({
    sellerName: { type: String, required: true },
    buyerName: { type: String, required: true },
    paymentType: { type: String, required: true },
    onlinePaymentType: { type: String, default: null },
    actualPrice: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
    orderedProducts: [
        {
            productName: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            quantity: { type: Number, required: true },
        }
    ]
}, { timestamps: true }
)

module.exports = mongoose.model('Investment', InvestmentSchema)