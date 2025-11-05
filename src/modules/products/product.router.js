const { UserRoles } = require("../../config/constants")
const auth = require("../../middleware/auth.middleware")
const uploader = require("../../middleware/uploader.middleware")
const bodyValidator = require("../../middleware/validator.middleware")
const productCtrl = require("./product.controller")
const { ProductDataDTO, RatingDTO } = require("./product.validator")
const productRouter = require("express").Router()

productRouter.get('/front', productCtrl.frontListAllProducts);
productRouter.get('/:slug/detail', productCtrl.frontProductDetailBySlug)

productRouter.post('/', auth([UserRoles.ADMIN, UserRoles.SELLER]), uploader().array('images'), bodyValidator(ProductDataDTO), productCtrl.createProduct)
//list all products 
productRouter.get('/', auth([UserRoles.ADMIN, UserRoles.SELLER]), productCtrl.listAllProducts) 

// view detail of a product
productRouter.get("/:id", auth([UserRoles.ADMIN, UserRoles.SELLER]), productCtrl.getProductDetailById) 
productRouter.put('/:id', auth([UserRoles.ADMIN, UserRoles.SELLER]), uploader().array('images'), bodyValidator(ProductDataDTO), productCtrl.updateProductById)
productRouter.delete('/:id', auth([UserRoles.ADMIN, UserRoles.SELLER]), productCtrl.deleteProductById)

productRouter.put('/rating', auth([UserRoles.ADMIN, UserRoles.SELLER, UserRoles.CUSTOMER]), bodyValidator(RatingDTO), productCtrl.rating)
productRouter.get('/:id/ratings', productCtrl.getProductRatings)

module.exports = productRouter 