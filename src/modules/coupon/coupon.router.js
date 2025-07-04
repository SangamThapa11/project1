const couponRouter = require("express").Router();
const Joi = require("joi");
const { UserRoles } = require("../../config/constants");
const auth = require("../../middleware/auth.middleware");
const bodyValidator = require("../../middleware/validator.middleware");
const couponCtrl = require("./coupon.controller");

const ValidateCouponDTO = Joi.object({
  code: Joi.string().required().trim()
});

const CreateCouponDTO = Joi.object({
  code: Joi.string().required().trim(),
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().min(0).required(),
  minOrderAmount: Joi.number().min(0).default(0),
  maxDiscountAmount: Joi.number().min(0).allow(null),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref("startDate")),
  maxUses: Joi.number().min(1).allow(null),
  applicableCategories: Joi.array().items(Joi.string()),
  applicableProducts: Joi.array().items(Joi.string()),
  isActive: Joi.boolean().default(true)
});

couponRouter.post("/validate", auth([UserRoles.CUSTOMER, UserRoles.ADMIN]), bodyValidator(ValidateCouponDTO), couponCtrl.validateCoupon);
couponRouter.post("/", auth([UserRoles.ADMIN]), bodyValidator(CreateCouponDTO), couponCtrl.createCoupon);

module.exports = couponRouter;