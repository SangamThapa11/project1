const {UserRoles} = require("../../config/constants")
const auth = require("../../middleware/auth.middleware")
const uploader = require("../../middleware/uploader.middleware")
const bodyValidator = require("../../middleware/validator.middleware")
const {RegisterDTO} = require("../auth/auth.validator")
const authCtrl = require("../auth/auth.controller")
const userCtrl = require("./user.controller")
const { UserUpdateDTO } = require("./user.validator")

const userRouter = require("express").Router()



userRouter.post('/', auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(RegisterDTO), authCtrl.register) 
userRouter.get('/', auth(), userCtrl.listAllUsers) 

userRouter.get('/:id', auth(), userCtrl.getUserDetail) 
userRouter.put('/:id', auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(UserUpdateDTO), userCtrl.updateUser) 
userRouter.delete('/:id', auth([UserRoles.ADMIN]), userCtrl.deleteUserById)
module.exports = userRouter  

