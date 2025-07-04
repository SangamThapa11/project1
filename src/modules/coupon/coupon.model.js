const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    maxDiscountAmount: {
      type: Number,
      default: null
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    maxUses: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicableCategories: [{
      type: mongoose.Types.ObjectId,
      ref: "Category"
    }],
    applicableProducts: [{
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
  }
);

const CouponModel = mongoose.model("Coupon", CouponSchema);
module.exports = CouponModel;