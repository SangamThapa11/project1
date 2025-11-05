const { AppConfig } = require("../../config/config");
const { UserRoles, OrderStatus } = require("../../config/constants");
const orderDetailSvc = require("../order-detail/order-detail.service");
const orderSvc = require("./order.service");
class OrderController {
    async checkout(req, res, next) {
        try{
            const loggedInUser = req.loggedInUser;
            const {cartIds} = req.body;

            const {data} = await orderDetailSvc.getAllRowsByFilter({
                buyer: loggedInUser._id, 
                order: {$eq: null},
                _id: {$in: cartIds}, 
            }, {page: 1, limit: 20})

            if(data.length <= 0) {
                throw {
                    code: 422,
                    message: "Cart not found",
                    status: "CART_NOT_FOUND"
                }
            }
            const orderObj = orderSvc.transformToOrder(data, loggedInUser)
            const order = await orderSvc.createOrder(orderObj); 

            let updatedData = [];
            data.map((item) => {
                item.price = item.product.afterDiscount;
                item.subTotal = item.price * item.quantity;
                item.total = item.subTotal + item.deliveryCharge;
                item.order = order._id

                updatedData.push(item.save())
            })

            await Promise.allSettled(updatedData)

            res.json({
                data: order,
                message: "Your order has been placed",
                status: "ORDER_PLACED",
                options: null
            })
        }catch(exception){
            next(exception) 
        }
    }
    async getAllOrders(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser;

            let filter = {};

            //role filter
            if(loggedInUser.role === UserRoles.CUSTOMER) {
                filter = {
                    buyer: loggedInUser._id
                };
            }

            //status filter
            if(req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }
            //search filter
            if(req.query.search){
                filter = {
                    ...filter,
                    code: new RegExp(req.query.search, "i")
                }
            }

            const{data, pagination} = await orderSvc.getAllRowsByFilter(filter, req.query);

            res.json({
                data: data, 
                message: "Your Order",
                status: "YOUR_ORDER_LIST",
                options: {
                    pagination
                }
            })
        }catch(exception) {
            next(exception)
        }
    }
    async payWithKhalti(req, res, next) {
        try{
            const loggedInUser = req.loggedInUser;
            const order = await orderSvc.getSingleRowByFilter({
                buyer: loggedInUser._id,
                code: req.params.orderCode,
                status: OrderStatus.PENDING,
                isPaid: false
            });

            if(!order) {
                throw {
                    code: 422,
                    message: "Order code does not exists",
                    status: "ORDER_NOT_FOUND"
                }
            }
            let khaltiResponse = await fetch(`${AppConfig.khaltiBaseUrl+'epayment/initiate/'}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Key ${AppConfig.khaltiSecretKey}`
                },
                body: JSON.stringify({
                    return_url: `${AppConfig.feUrl1}/success`,
                    website_url: `${AppConfig.feUrl1}`,
                    amount: order.total,
                    purchase_order_id: order.code,
                    purchase_order_name: "E-Pasal Payment"
                })
            });
            khaltiResponse = await khaltiResponse.json()
            res.json({
                data: khaltiResponse,
                message: "Payment Initiated",
                status: "KHALTI_INITIATED",
                options: null
            })

        }catch(exception) {
            next(exception)
        }
    }
    async createTransaction(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser;
            const order = await orderSvc.getSingleRowByFilter({
                buyer: loggedInUser._id,
                code: req.params.orderCode,
                status: OrderStatus.PENDING
            });

            if(!order) {
                throw {
                    code: 422,
                    message: "Order code does not exists",
                    status: "ORDER_NOT_FOUND"
                }
            }
            const transactionData = orderSvc.transformToTransaction(order, req.body)
            const transaction = await orderSvc.createTransaction(transactionData)

            order.status = OrderStatus.VERIFIED; 
            order.isPaid = true;

            await order.save();

            res.json({
                data: transaction,
                message: "Your transaction has been saved",
                status: "TRANSACTION_SAVED",
                options: null 
            })
        }catch(exception) {
            next(exception)
        }
    }
}
const orderCtrl = new OrderController()
module.exports = orderCtrl 