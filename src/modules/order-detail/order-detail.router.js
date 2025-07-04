const orderDetailRouter = require("express").Router();
const Joi = require("joi");
const { UserRoles } = require("../../config/constants");
const auth = require("../../middleware/auth.middleware"); 
const bodyValidator = require("../../middleware/validator.middleware");
const orderDetailCtrl = require("./order-detail.controller");

const AddToCartDTO = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().min(1).max(10).required()
})

const UpdateOrRemoveFromCartDTO = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().min(0).required()
})

orderDetailRouter.post('/', auth([UserRoles.CUSTOMER, UserRoles.ADMIN]), bodyValidator(AddToCartDTO), orderDetailCtrl.addToCart)
orderDetailRouter.get('/', auth([UserRoles.CUSTOMER, UserRoles.ADMIN]), orderDetailCtrl.viewMyCart)
orderDetailRouter.patch('/', auth([UserRoles.CUSTOMER, UserRoles.ADMIN]), bodyValidator(UpdateOrRemoveFromCartDTO), orderDetailCtrl.updateFromCart) 
module.exports = orderDetailRouter; 
