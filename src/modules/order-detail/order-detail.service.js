const { OrderStatus } = require("../../config/constants");
const BaseService = require("../../services/base.service");
const OrderDetailModel = require("./order-detail.model");

class OrderDetailService extends BaseService{
    transformToOrderDetail = ({buyer, product, quantity}) => {
        try{
            return{
                buyer: buyer._id,
                order: null,
                product: product._id,
                quantity: quantity,
                price: product.afterDiscount,
                subTotal: quantity * product.afterDiscount,
                deliveryCharge: 10000,
                total: (quantity * product.afterDiscount) + 10000,
                seller: product?.seller?._id,
                status: OrderStatus.PENDING,
                createdBy: buyer._id, 
            };

        }catch(exception){
            throw exception 
        }
    }
    async getAllRowsByFilter(filter, {page=1, limit=10} ={}) {
        try {
            const skip = (page - 1) * limit; 
            const data = await OrderDetailModel.find(filter)
            .populate('buyer', ['_id', 'name', 'email', 'address', 'phone','gender', 'rolr', 'status', 'image'])
            .populate('order', ['_id', 'code', 'grossTotal', 'grossDeliveryTotal', 'discount', 'subTotal', 'tax', 'total', 'status'])
            .populate('product', ['_id', 'name', 'slug', 'afterDiscount', 'stock', 'image', 'status'])
            .populate('seller', ['_id', 'name', 'email', 'address', 'phone', 'gender', 'role', 'status', 'image'])
            .sort({'createdAt': 'desc'})
            .skip(skip)
            .limit(limit)
            const total = await OrderDetailModel.countDocuments(filter);
            return {
                data: data,
                pagination: {
                    page: page,
                    limit: limit,
                    totalCount: total 
                }
            }

        }catch(exception){
            throw exception 
        }
    }
     // Add this method to your OrderService class
async calculateOrderTotals(items, coupon = null) {
  try {
    const grossTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
    const grossDeliveryTotal = items.reduce((sum, item) => sum + item.deliveryCharge, 0);
    
    let discount = 0;
    let couponData = null;
    
    if (coupon) {
      couponData = await couponSvc.validateCoupon(coupon.code, null, items);
      discount = await couponSvc.calculateDiscount(couponData, grossTotal);
    }
    
    const subTotal = grossTotal - discount;
    const tax = subTotal * 0.1; // Assuming 10% tax, adjust as needed
    const total = subTotal + tax + grossDeliveryTotal;
    
    return {
      grossTotal,
      grossDeliveryTotal,
      discount,
      subTotal,
      tax,
      total,
      coupon: couponData ? couponData._id : null,
      couponCode: couponData ? couponData.code : null,
      couponDiscount: discount
    };
  } catch (exception) {
    throw exception;
  }
}
}

const orderDetailSvc = new OrderDetailService(OrderDetailModel)

module.exports = orderDetailSvc; 