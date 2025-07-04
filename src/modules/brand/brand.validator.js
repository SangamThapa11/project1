const Joi = require("joi");
const { Status } = require("../../config/constants");

const BrandDataDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE),
    isFeatured: Joi.boolean().default(false),
    logo: Joi.string().allow(null, '').optional().default(null) 
})

module.exports = {
    BrandDataDTO
}