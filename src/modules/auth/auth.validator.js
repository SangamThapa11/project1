const Joi = require("joi"); 

const strongPasswordPattern =   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,25}$/
const LoginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(25).required()
})

//LoginDTO.validateAsync(DataTransfer, {abortEarly: false})

const RegisterDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),

    password: Joi.string().regex(strongPasswordPattern).required(),
    confirmPassword: Joi.ref("password"),

    role: Joi.string().regex(/^(admin|customer|seller)$/).default('customer'),
    address: Joi.string().required(),
    phone: Joi.string().min(10).max(15), 
    gender: Joi.string().regex(/^(male|female|others)$/), 
    dob: Joi.date().less('now'),
    image: Joi.string().allow(null, '').optional().default(null) 
});

const ForgetPasswordDTO = Joi.object({
    email: Joi.string().email().required()
})

const ResetPasswordDTO = Joi.object({
    verifiedToken: Joi.string().required(),
    password: Joi.string().regex(strongPasswordPattern).required(),
    confirmPassword: Joi.ref("password")
})

module.exports = {
    LoginDTO,
    RegisterDTO,
    ForgetPasswordDTO,
    ResetPasswordDTO
}