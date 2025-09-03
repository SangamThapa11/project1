const { UserRoles } = require("../../config/constants")
const auth = require("../../middleware/auth.middleware")
const uploader = require("../../middleware/uploader.middleware")
const bodyValidator = require("../../middleware/validator.middleware")
const categoryCtrl = require("./category.controller")
const { CategoryDataDTO } = require("./category.validator")
const categoryRouter = require("express").Router()

categoryRouter.get('/front', categoryCtrl.frontListAllCategories);
categoryRouter.get('/:slug/detail', categoryCtrl.frontCategoryDetailBySlug)

categoryRouter.post('/', auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(CategoryDataDTO), categoryCtrl.createCategory)
//list all categorys 
categoryRouter.get('/', auth([UserRoles.ADMIN, UserRoles.SELLER]), categoryCtrl.listAllCategories) 

// view detail of a category
categoryRouter.get("/:id", auth([UserRoles.ADMIN]), categoryCtrl.getCategoryDetailById) 
categoryRouter.put('/:id', auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(CategoryDataDTO), categoryCtrl.updateCategoryById)
categoryRouter.delete('/:id', auth([UserRoles.ADMIN]), categoryCtrl.deleteCategoryById)
module.exports = categoryRouter 