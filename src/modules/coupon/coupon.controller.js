const orderDetailSvc = require("../order-detail/order-detail.service");
const couponSvc = require("./coupon.service");

class CouponController {
  async validateCoupon(req, res, next) {
    try {
      const { code } = req.body;
      const loggedInUser = req.loggedInUser;
      
      // Get user's cart items
      const cartItems = await orderDetailSvc.getAllRowsByFilter({
        order: { $eq: null },
        buyer: loggedInUser._id
      });
      
      const coupon = await couponSvc.validateCoupon(code, loggedInUser._id, cartItems.data);
      const discount = await couponSvc.calculateDiscount(coupon, cartItems.data.reduce((sum, item) => sum + item.subTotal, 0));
      
      res.json({
        data: {
          coupon,
          discountAmount: discount
        },
        message: "Coupon applied successfully",
        status: "COUPON_APPLIED"
      });
    } catch (exception) {
      next(exception);
    }
  }
  
  async createCoupon(req, res, next) {
    try {
      const payload = req.body;
      const createdBy = req.loggedInUser._id;
      
      payload.createdBy = createdBy;
      payload.code = payload.code.toUpperCase();
      
      const coupon = await couponSvc.createData(payload);
      
      res.json({
        data: coupon,
        message: "Coupon created successfully",
        status: "COUPON_CREATED"
      });
    } catch (exception) {
      next(exception);
    }
  }
  
  // Add more methods as needed (list, update, delete, etc.)
}

const couponCtrl = new CouponController();
module.exports = couponCtrl;