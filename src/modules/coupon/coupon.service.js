const BaseService = require("../../services/base.service");
const CouponModel = require("./coupon.model");

class CouponService extends BaseService {
  async validateCoupon(code, userId, cartItems) {
    try {
      // Find coupon by code
      const coupon = await this.model.findOne({
        code: code.toUpperCase(),
        isActive: true
      });

      if (!coupon) {
        throw {
          code: 404,
          message: "Coupon not found or expired",
          status: "COUPON_NOT_FOUND"
        };
      }

      // Check validity dates
      const now = new Date();
      if (now < coupon.startDate || now > coupon.endDate) {
        throw {
          code: 400,
          message: "Coupon is expired",
          status: "COUPON_EXPIRED"
        };
      }

      // Check max uses
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw {
          code: 400,
          message: "Coupon usage limit reached",
          status: "COUPON_LIMIT_REACHED"
        };
      }

      // Calculate cart total
      const cartTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);

      // Check minimum order amount
      if (cartTotal < coupon.minOrderAmount) {
        throw {
          code: 400,
          message: `Minimum order amount of ${coupon.minOrderAmount} required for this coupon`,
          status: "MIN_ORDER_NOT_MET"
        };
      }

      // Check if coupon is applicable to any products in cart
      if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
        const applicableItems = cartItems.filter(item => {
          const isProductApplicable = coupon.applicableProducts.some(
            productId => productId.equals(item.product._id)
          );
          
          const isCategoryApplicable = coupon.applicableCategories.some(
           categoryId =>
           Array.isArray(item.product.category) &&
           item.product.category.some(cat => cat && categoryId.equals(cat._id))
);
          
          return isProductApplicable || isCategoryApplicable;
        });

        if (applicableItems.length === 0) {
          throw {
            code: 400,
            message: "Coupon not applicable to any items in your cart",
            status: "COUPON_NOT_APPLICABLE"
          };
        }
      }

      return coupon;
    } catch (exception) {
      throw exception;
    }
  }

  async calculateDiscount(coupon, cartTotal) {
    try {
      let discountAmount = 0;

      if (coupon.discountType === "percentage") {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        
        // Apply max discount if set
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, cartTotal);
      }

      return discountAmount;
    } catch (exception) {
      throw exception;
    }
  }

  async incrementCouponUsage(couponId) {
    try {
      await this.model.findByIdAndUpdate(couponId, {
        $inc: { usedCount: 1 }
      });
    } catch (exception) {
      throw exception;
    }
  }
}

const couponSvc = new CouponService(CouponModel);
module.exports = couponSvc;