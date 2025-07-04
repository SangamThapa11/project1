const Joi = require("joi");
const { Status } = require("../../config/constants");

const CategoryDataDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    parentId: Joi.string().allow(null, '').optional().default(null), 
    brands: Joi.array().items(Joi.string().allow(null, '').optional().default(null)), 
    inMenu: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false),
    status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE),
    image: Joi.string().allow(null, '').optional().default(null) 
})

module.exports = {
    CategoryDataDTO
}