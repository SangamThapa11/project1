const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true 
    },
    transactionCode: {
        type: String,
        required: true,
        unique: true 
    },
    amount: {
        type: Number,
        required: true,
    },
    data: String
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})
const TransactionModel = mongoose.model("Transaction", TransactionSchema)
module.exports = TransactionModel 