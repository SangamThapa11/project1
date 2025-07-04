const Joi = require("joi"); 

const UserUpdateDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    role: Joi.string().regex(/^(admin|customer|seller)$/).default('customer'),
    address: Joi.string().required(),
    phone: Joi.string().min(10).max(15), 
    gender: Joi.string().regex(/^(male|female|others)$/), 
    dob: Joi.date().less('now'),
    image: Joi.string().allow(null, '').optional().default(null) 
});

module.exports = {
    UserUpdateDTO
}