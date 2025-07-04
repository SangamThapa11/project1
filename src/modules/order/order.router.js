const Joi = require('joi');
const orderRouter = require("express").Router() 
const {UserRoles} = require("../../config/constants");
const auth = require("../../middleware/auth.middleware");
const bodyValidator = require("../../middleware/validator.middleware"); 
const orderCtrl = require("./order.controller");

const CheckoutDTO = Joi.object({
    cartIds: Joi.array().items(Joi.string()).required()
    //TODO: add voucher and coupons 
})
//checkout
orderRouter.post("/", auth([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(CheckoutDTO), orderCtrl.checkout)
//view order list
orderRouter.get("/", auth(), orderCtrl.getAllOrders) 
//payment 
orderRouter.get("/:orderCode", auth(), orderCtrl.payWithKhalti) 
orderRouter.post('/:orderCode', auth(), orderCtrl.createTransaction)
//update
//TODO: Update the status of an order 
module.exports = orderRouter; 