const productSvc = require("../products/product.service");
const OrderDetailModel = require("./order-detail.model");
const orderDetailSvc = require("./order-detail.service");

class OrderDetailController{
    async addToCart(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser;
            const {product, quantity} = req.body; 

            const productDetail = await productSvc.getSingleRowByFilter({
                _id: product
            })
            if(!productDetail) {
                throw {
                    code: 422,
                    message: "Prodduct not found",
                    status: "PRODUCT_NOT_FOUND"
                }
            }
            //cart store  cart khojne
            let existing = await orderDetailSvc.getSingleRowByFilter({
                order: {$eq: null}, 
                buyer: loggedInUser._id,
                product: productDetail._id
            })
            if(existing) {
                existing.price = productDetail.afterDiscount; 
                existing.quantity += +quantity
                existing.subTotal = existing.quantity * productDetail.afterDiscount 
                existing.total = existing.subTotal + existing.deliveryCharge
                await existing.save() 
            } else {
                const payload = orderDetailSvc.transformToOrderDetail({buyer: loggedInUser, product: productDetail, quantity})
                existing = await orderDetailSvc.createData(payload)
            }

            res.json ({
                data: existing,
                message: "Product added to cart successfully",
                status: "ADD_TO_CART_SUCCESS",
                options: null 
            })

        }catch(exception) {
            next(exception)
        }
    }
    async viewMyCart(req, res, next) {
        try{
            const loggedInUser = req.loggedInUser; 
            const {data, pagination} = await orderDetailSvc.getAllRowsByFilter({
                order: {$eq: null},
                buyer: loggedInUser._id 
            }, {page: +req.query.page || 1, limit: +req.query.limit || 10})

            res.json({
                data: data, 
                message: "Your cart items",
                status: "YOUR_CART_ITEMS",
                options: {pagination}
            })
        }catch(exception){
            next (exception)
        }
    }
    async updateFromCart(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser;
            const {product, quantity} = req.body; 

            const productDetail = await productSvc.getSingleRowByFilter({
                _id: product
            })
            if(!productDetail) {
                throw {
                    code: 422,
                    message: "Prodduct not found",
                    status: "PRODUCT_NOT_FOUND"
                }
            }
            //cart store  cart khojne
            let existing = await orderDetailSvc.getSingleRowByFilter({
                order: {$eq: null}, 
                buyer: loggedInUser._id,
                product: productDetail._id
            })
            if(!existing) {
                throw {
                    code: 422,
                    message: "Cart does not exist",
                    status: "CART_DOES_NOT_ECIST"
                }
            }
            if(existing.quantity === quantity || quantity === 0) {
                existing = await orderDetailSvc.deleteSingleRowsByFilter({
                    _id: existing._id
                })
                res.json({
                    data: null,
                    message: "Item removed from cart",
                    status: "CART_DELETED",
                    options: null
                })
            } else {
                existing.price = productDetail.afterDiscount;
                existing.quantity = existing.quantity - quantity;
                existing.subTotal = (existing.quantity * existing.price)
                existing.total = existing.subTotal + existing.deliveryCharge;

                await existing.save(); 
                res.json({
                    data: existing,
                    message: "Cart Updated Successfully",
                    status: "CART_UPDATED",
                    options: null
                })
            }
        }catch(exception) {
            next(exception)
        }
    }
    // coupon checkout 
async checkout(req, res, next) {
  try {
    const loggedInUser = req.loggedInUser;
    const { couponCode } = req.body;
    
    // Get cart items
    const cartItems = await orderDetailSvc.getAllRowsByFilter({
      order: { $eq: null },
      buyer: loggedInUser._id
    });
    
    let coupon = null;
    if (couponCode) {
      coupon = { code: couponCode };
    }
    
    // Calculate totals with coupon
    const totals = await orderSvc.calculateOrderTotals(cartItems.data, coupon);
    
    // Create order
    const orderPayload = {
      buyer: loggedInUser._id,
      items: cartItems.data.map(item => item._id),
      ...totals,
      status: "processing",
      createdBy: loggedInUser._id
    };
    
    const order = await orderSvc.createData(orderPayload);
    
    // Update order details with order reference
    await orderDetailSvc.model.updateMany(
      { _id: { $in: cartItems.data.map(item => item._id) } },
      { order: order._id }
    );
    
    // Increment coupon usage if applied
    if (couponCode && totals.coupon) {
      await couponSvc.incrementCouponUsage(totals.coupon);
    }
    
    res.json({
      data: order,
      message: "Order placed successfully",
      status: "ORDER_PLACED"
    });
  } catch (exception) {
    next(exception);
  }
}
}
const orderDetailCtrl = new OrderDetailController();
module.exports = orderDetailCtrl 