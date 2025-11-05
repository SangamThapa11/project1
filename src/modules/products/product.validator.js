const Joi = require("joi");
const { Status } = require("../../config/constants");

const ProductDataDTO = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    category: Joi.array().items(Joi.string()).allow(null, "").optional().default(null), 
    brand: Joi.string().allow(null, "").optional().default(null), 
    price: Joi.number().min(10).required(), 
    discount: Joi.number().min(0).max(90).allow(null).optional().default(0), 
    description: Joi.string().required(),
    stock: Joi.number().min(1).required(),
    sku: Joi.string().required(), 
    attributes: Joi.array().items(Joi.object({
        name: Joi.string(),
        value: Joi.array().items(Joi.string()) 
    })).allow(null, '').optional().default(null), 
    isFeatured: Joi.boolean().default(false),
    seller: Joi.string().allow(null, '').default(null), 
    status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE),
    images: Joi.array().items(Joi.string()).allow(null).optional().default(null),
})

const RatingDTO = Joi.object({
    star: Joi.number().min(1).max(5).required(),
    productId: Joi.string().hex().length(24).required(), 
    comment: Joi.string().max(500).optional().allow('', null).default("")
});
module.exports = {
    ProductDataDTO,
    RatingDTO
}
