const mongoose = require('mongoose')

const BorrowedSchema = new mongoose.Schema({
    borrowedFrom: { type: String, required: true },
    borrowedAmount: { type: Number, required: true, default: 0 },
    interestPercentage: { type: Number, required: true, default: 0 },
    interestPaid: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
}, { timestamps: true }
)

module.exports = mongoose.model('Borrowed', BorrowedSchema)