const { randomStringGenerator } = require("../../utilities/helpers")
const { OrderStatus } = require('../../config/constants');
const OrderModel = require('./order.model');
const TransactionModel = require("./transaction.model");

class OrderService{
    transformToOrder(cartItems, buyer){
        let orderObj = {
            buyer: buyer._id,
            code: randomStringGenerator(15),
            items: cartItems.map((item) => item._id),
            grossTotal: 0,
            grossDelivaryTotal: 0,
            discount: 0,
            subTotal: 0,
            tax: 0, 
            total: 0,
            status: OrderStatus.PENDING,
            createdBy: buyer._id 
        };

        cartItems.map((item) => {
            orderObj.grossTotal += item.product.afterDiscount * +item.quantity 
            orderObj.grossDelivaryTotal += +item.deliveryCharge 
        })
        orderObj.subtotal = orderObj.grossTotal-orderObj.discount + orderObj.grossDelivaryTotal
        orderObj.tax = orderObj.subtotal * 0.13;
        orderObj.total = orderObj.subtotal + orderObj.tax; 

        return orderObj; 
    }
    transformToTransaction(order, trans){
        const transData = {
            buyer: order.buyer,
            order: order._id,
            transactionCode: trans.txnId,
            amount: trans.total_amount,
            data: JSON.stringify(trans) 
        };
        return transData
    }
    async createTransaction(data) {
        try {
            const transaction = new TransactionModel(data);
            return await transaction.save()
        }catch(exception) {
            throw exception
        }
    }
    async createOrder(data) {
        try {
            const order = new OrderModel(data);
            return await order.save()
        }catch(exception) {
            throw exception
        }
    }
    async getAllRowsByFilter(filter, {page=1, limit= 15}) {
        try{
            const skip = (page - 1) * limit;
            const data = await OrderModel.find(filter)
             .populate('buyer', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             .populate('items', ['_id', 'product', 'quatity', 'price', 'subTotal', 'deliveryCharge', 'total', 'seller', 'status'])
             .populate('createdBy', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             .populate('updatedBy', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             .sort({'createdAt': "desc"})
             .skip(skip)
             .limit(limit)
             const total = await OrderModel.countDocuments(filter);
             return {
                data: data,
                pagination: {
                    page: page,
                    limit: limit,
                    total : total
                }
             }
        }catch(exception) {
            throw exception
        }
    }
    async getSingleRowByFilter(filter) {
        try{
            const data = await OrderModel.findOne(filter)
             .populate('buyer', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             .populate('items', ['_id', 'product', 'quatity', 'price', 'subTotal', 'deliveryCharge', 'total', 'seller', 'status'])
             .populate('createdBy', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             .populate('updatedBy', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
             return data; 
        }catch(exception) {
            throw exception
        }
    }
   
}

const orderSvc = new OrderService()
module.exports = orderSvc 