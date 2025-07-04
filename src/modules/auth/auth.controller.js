const { options } = require("joi");
const { AppConfig } = require("../../config/config");
const { Status } = require("../../config/constants");
const { randomStringGenerator } = require("../../utilities/helpers");
const userSvc = require("../user/user.service");
const authMail = require("./auth.mail");
const authSvc = require("./auth.service");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


class AuthController {
login = async (req, res, next) => {
        try {
            const {email, password} = req.body; 
            const userDetail = await userSvc.getSingleRowByFilter({
                email: email 
            })
            if(!userDetail) {
                throw {
                    code: 422, 
                    message: "User not registered yet!!",
                    status: "USER_NOT_REGISTERED_ERR"
                }
            }
            if(userDetail.status !== Status.ACTIVE || userDetail.activationToken !== null) {
                throw {
                    code: 422,
                    message: "User not activated yet or is suspended.....",
                    status: "User_NOT_ACTIVATED_ERR"
                }
            }
            //password check
            if(!bcrypt.compareSync(password, userDetail.password)){
                throw{
                    code: 422,
                    message: "Credential does not match",
                    status: "CREDENTIALS_NOT_MATCHED_ERR"
                }
            }
            //system audit 
            let authData = authSvc.transformSessionData(userDetail._id, req)
            authData = await authSvc.createData(authData); 
            res.json({
                data: {
                    accessToken: authData.accessToken.masked,
                    refreshToken: authData.refreshToken.masked
                },
                message: "Welcome to"+userDetail.role+"Panel!!",
                status: "LOGIN_SUCCESS",
                options: null
            })

        }catch(exception){
            next(exception)
        }
     };

register =async (req, res, next) => {
        try {
            const data = await authSvc.transformRegistrationData(req) 
            const user = await userSvc.createData(data) 

            await authMail.sendRegisterSuccessMail(user)
            
    res.json({
        data: userSvc.getUserPublicProfile(user), 
        message: "THANK YOU FOR REGISTERING WITH US",
        status: "SUCCESS",
        options: null
    });
    } catch(exception) {
        next(exception)
    }
};
activateUserAccount = async(req, res, next) => {
    try {
        const token = req.params.token;
        const userDetail = await userSvc.getSingleRowByFilter({
            activationToken: token, 
        });
        if(!userDetail) {
            throw {
                code: 422,
                message: "Invalid token....",
                status: "INVALID_TOKEN_ERR"
            }
        }
        const updateData = {
            status: Status.ACTIVE, 
            activationToken: null 
        }
        const activatedUser = await userSvc.updateSingleRowByFilter({_id: userDetail._id}, updateData)
        await authMail.sendActivationSuccessNotification(activatedUser)
        res.json({
            data: userSvc.getUserPublicProfile(activatedUser), 
            message: "Your account has been activated", 
            status: "ACCOUNT_ACTIVATED", 
            options: null
        });
    }catch(exception){
        next(exception)
    }
}
  getLoggedInUserProfile = (req, res, next) => {
    let loggedInUser = req.loggedInUser;
    res.json({
        data: loggedInUser,
        message: "User Profile",
        status: "PROFILE_LOGGED_IN",
        options: null
    })
  };
refreshToken = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;
        if(!token){
            throw{
                code: 401,
                message: "Token expected",
                status: "TOKEN_NOT_PROVIDED_ERR"
            }
        }
        token = token.split(" ").pop();
        const sessionData = await authSvc.getSingleRowByFilter({
            "refreshToken.masked": token
        })
        if(!sessionData) {
            throw{
                code: 401,
                message: "Session not found",
                status: "SESSION_NOT_FOUND_ERR"
            }
        }
        const payload = jwt.verify(sessionData.refreshToken.actual, AppConfig.jwtSecret)

        if(payload.typ !== "Refresh") {
            throw {
                code: 401,
                message: "Token type does not match.",
                status: "INVALID_TOKEN_TYPE_ERR"
            }
        }
        const userDetail = await userSvc.getSingleRowByFilter({
            _id: payload.sub
        })
        if(!userDetail) {
            throw{
                code: 401,
                message: "User does not exists any more....!",
                status: "USER_NOT_FOUND_ERR"
            }
        }
        const newSessionData = authSvc.transformSessionData(userDetail, req)
        //const newToken = await authSvc.createData(newSessionData)
        const newToken = await authSvc.updateSingleRowByFilter({_id: sessionData._id}, newSessionData)

        res.json({
            data: {
                accessToken: newToken.accessToken.masked, 
                refreshToken: newToken.refreshToken.masked
            },
            message: "Access token refreshed",
            status: "TOKEN_REFRESHED",
            options: null
        })
    }catch(exception) {
        next(exception)
    }
}
logout = async(req, res, next) => {
    try{
        const loggedInUser = req.loggedInUser
        let filter = {
            user: loggedInUser._id
        }
        if(!req.query.allDevice) {
            filter = {
                ...filter, 
                _id: req.sessionData._id
            }
        }
        const removedSessions = await authSvc.deleteRowsByFilter(filter);
        res.json({
            data: null,
            message: "Logged out",
            status: "LOGGED_OUT", 
            options: null 
        })

    }catch(exception) {
        next(exception)
    }
}
forgetPasswordRequest = async(req, res, next) => {
    try {
        const {email} = req.body;
        const userDetail = await userSvc.getSingleRowByFilter({
            email: email 
        })
        if(!userDetail) {
            throw{
                code: 422,
                message: "User has not registered yet!",
                status: "USER_NOT_FOUND_ERR"
            }
        }
        const updatedUser = await userSvc.updateSingleRowByFilter({
            _id: userDetail._id
        }, {
            forgetToken: randomStringGenerator(150),
            expiryTime: new Date(Date.now()+3*3600000)
        })
        await authMail.resetPasswordRequestNotification(updatedUser)
        res.json({
            data: null,
            message: "Link has been forwarded to registered email",
            status: "RESET_PASSWORD_REQUEST_SENT", 
            options: null 
        })
    }catch(exception) {
        next(exception)
    }
}
verifyForgetToken = async(req, res, next) => {
    try{
        let token = req.params.token
        const userDetail = await userSvc.getSingleRowByFilter({
            forgetToken: token
        });
        if(!userDetail) {
            throw {
                code: 422,
                message: "Token not found",
                status: "TOKEN_NOT_FOUND_ERR"
            }
        }
        // expiry check
        const today = Date.now();
        const expiryTime = userDetail.expiryTime.getTime();
        if(today > expiryTime) {
            throw {
                code: 422,
                message: "Token expired",
                status: "TOKEN_EXPIRED_ERR"
            }
        }
        const userUpdate = await userSvc.updateSingleRowByFilter({
            _id: userDetail._id
        }, {
            forgetToken: randomStringGenerator(150)
        })
        res.json ({
            data: {
                verifyToken: userUpdate.forgetToken,
            },
            status: "TOKEN_VERIFIED_SUCCESS",
            message: "Token verified", 
            options: null
        })
    }catch(exception){
        next(exception)
    }
}
resetPassword = async(req, res, next) => {
    try {
        const {password, verifiedToken} = req.body; 
        let userDetail = await userSvc.getSingleRowByFilter({
            forgetToken: verifiedToken
        })
        if(!userDetail){
            throw{
                code: 422,
                message: "User has not registered yet",
                status: "USER_NOT_FOUND_ERR"
            }
        }
        const today = Date.now();
        const expiryTime = userDetail.expiryTime.getTime();
        if(today > expiryTime) {
            throw {
                code: 422,
                message: "Token expired",
                status: "TOKEN_EXPIRED_ERR"
            }
        }
        userDetail = await userSvc.updateSingleRowByFilter({
            _id: userDetail._id
        },{
            password: bcrypt.hashSync(password, 12),
            forgetToken: null,
            expiryTime: null
        })

    // logout from all
    await authSvc.deleteRowsByFilter({
        user: userDetail._id
    })
    await authMail.sendPasswordResetSuccessMail(userDetail)

    res.json({
        data: null,
        message: "Password reset successfully",
        status: "PASSWORD_RESET",
        options: null
    })
    }catch(exception){
        next(exception)
    }
}
}

const authCtrl = new AuthController();
module.exports = authCtrl; 
