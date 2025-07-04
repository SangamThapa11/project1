const mongoose = require("mongoose")
const OrderDetailModel = require("../order-detail/order-detail.model");
const { required } = require("joi");
const { type } = require("express/lib/response");
const { OrderStatus } = require('../../config/constants');



const OrderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    code: {
        type: String,
        unique: true,
        required: true
    }, 
    items: [{
        type: mongoose.Types.ObjectId,
        ref: "OrderDetail",
        required: true
    }], 
    grossTotal: {
        type: Number,
        required: true,
    }, 
    grossDelivaryTotal: {
        type: Number,
        required: true,
    }, 
    discount: {
        type: Number,
        default: 0
    }, 
    subTotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true
    }, 
    total: {
        type: Number,
        required: true
    },  
    status: {
            type: String,
            enum: Object.values(OrderStatus), 
            default: OrderStatus.PENDING
        },
    isPaid: {
        type: Boolean,
        default: false
    },
    createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User", 
            default: null 
        },  
    updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User", 
            default: null 
        },
         
    },
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    }
);

const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel; 