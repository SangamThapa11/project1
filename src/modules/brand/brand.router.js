const { UserRoles } = require("../../config/constants")
const auth = require("../../middleware/auth.middleware")
const uploader = require("../../middleware/uploader.middleware")
const bodyValidator = require("../../middleware/validator.middleware")
const brandCtrl = require("./brand.controller")
const { BrandDataDTO } = require("./brand.validator")
const brandRouter = require("express").Router()

brandRouter.get('/front', brandCtrl.frontListAllBrands);
brandRouter.get('/:slug/detail', brandCtrl.frontBrandDetailBySlug)

brandRouter.post('/', auth([UserRoles.ADMIN]), uploader().single('logo'), bodyValidator(BrandDataDTO), brandCtrl.createBrand)
//list all brands 
brandRouter.get('/', auth([UserRoles.ADMIN,UserRoles.SELLER]), brandCtrl.listAllBrands) 

// view detail of a brand
brandRouter.get("/:id", auth([UserRoles.ADMIN]), brandCtrl.getBrandDetailById) 
brandRouter.put('/:id', auth([UserRoles.ADMIN]), uploader().single('logo'), bodyValidator(BrandDataDTO), brandCtrl.updateBrandById)
brandRouter.delete('/:id', auth([UserRoles.ADMIN]), brandCtrl.deleteBrandById)
module.exports = brandRouter 