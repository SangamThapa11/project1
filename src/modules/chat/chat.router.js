const chatRouter = require("express").Router()  
const Joi = require("joi")
const auth = require("../../middleware/auth.middleware")
const bodyValidator = require("../../middleware/validator.middleware")
const chatCtrl = require("./chat.controller")


const NewChatDTO = Joi.object({
    receiver: Joi.string().required(),
    message: Joi.string().min(1).max(500). required()
})

chatRouter.post('/', auth(), bodyValidator(NewChatDTO), chatCtrl.createNewChat)
chatRouter.get('/:userId', auth(),chatCtrl.listAllChats)

module.exports = chatRouter 