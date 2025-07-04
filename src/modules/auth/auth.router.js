
const authRouter = require("express").Router();
const authCtrl = require("./auth.controller");
const auth = require("../../middleware/auth.middleware"); 
const bodyValidator = require("../../middleware/validator.middleware");
const { LoginDTO, RegisterDTO, ForgetPasswordDTO, ResetPasswordDTO } = require("./auth.validator");
const uploader = require("../../middleware/uploader.middleware");



authRouter.post("/register",uploader().single('image'),bodyValidator(RegisterDTO), authCtrl.register);
authRouter.get("/activate/:token", authCtrl.activateUserAccount);
authRouter.post("/login",bodyValidator(LoginDTO), authCtrl.login);
authRouter.get("/refresh", authCtrl.refreshToken);
authRouter.post("/forget-password", bodyValidator(ForgetPasswordDTO), authCtrl.forgetPasswordRequest);
authRouter.get('/forget-password/:token/verify', authCtrl.verifyForgetToken)
authRouter.patch("/reset-password",bodyValidator(ResetPasswordDTO), authCtrl.resetPassword)

//private routes
authRouter.get("/me", auth(['seller']), authCtrl.getLoggedInUserProfile);
authRouter.post('/logout', auth(), authCtrl.logout)



module.exports = authRouter; 