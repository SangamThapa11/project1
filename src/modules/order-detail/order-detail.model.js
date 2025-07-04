const mongoose = require("mongoose")
const OrderModel = require("../order/order.model")
const { OrderStatus } = require("../../config/constants");

const OrderDetailSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Types.ObjectId,
            ref: "User", 
            required: true
        }, 
        order: {
            type: mongoose.Types.ObjectId,
            ref: "Order",
            default: null
        }, 
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product", 
            required: true
        }, 
        quantity:{
            type: Number, 
            min: 1,
            required: true
        }, 
        price: {
            type: Number,
            required: true,
        }, 
        subTotal: {
            type: Number,
            required: true,
        }, 
        deliveryCharge:{
            type: Number,
            required: true
        }, 
        total: {
            type: Number,
            required: true
        },
        seller: {
            type: mongoose.Types.ObjectId,
            ref: "User", 
            required: true
        }, 
        status: {
            type: String,
            enum: Object.values(OrderStatus), 
            default: OrderStatus.PENDING
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
        coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
      default: null
    },
    couponCode: {
      type: String,
      default: null
    },
    couponDiscount: {
      type: Number,
      default: 0
    }  
    },
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    }
);

const OrderDetailModel = mongoose.model("OrderDetail", OrderDetailSchema)
module.exports = OrderDetailModel; 