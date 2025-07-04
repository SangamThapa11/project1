const { AppConfig } = require("../config/config");
const authSvc = require("../modules/auth/auth.service");
const jwt = require("jsonwebtoken")
const userSvc = require("../modules/user/user.service");
const { UserRoles } = require("../config/constants");

const auth = (allowedRoles= null) => {
    return async(req, res, next) => {
        // this middleware controll login check and permission control
        try {
            let token = req.headers.authorization || null;
            if(!token) {
                throw {
                code: 401,
                message: "Token expected",
                status: "TOKEN_REQUIRED_ERR"
                }
            }
            token = token.replace("Bearer ", "")

            //db read
            let authData = await authSvc.getSingleRowByFilter({
                "accessToken.masked": `${token}`
            })
            if(!authData){
                throw {
                code: 401,
                message: "Invalid Auth Token",
                status: "TOKEN_INVALID_ERR"
                }
            }
            // validate token data
            const payload = jwt.verify(authData.accessToken.actual, AppConfig.jwtSecret)
            if(payload.typ !== 'Bearer'){
                throw {
                code: 401,
                message: "Invalid token, not an access token ....",
                status: "TOKEN_TYPE_ERR" 
                }
            }
            let userDetail = await userSvc.getSingleRowByFilter({_id: payload.sub})
            if(!userDetail) {
                throw {
                    code: 401,
                    message: "Unauthorized",
                    status: "UNAUTHORIZED_ERR"
                }
            }
            // allowedRoles => null => only check auth
            if(allowedRoles === null || userDetail.role === UserRoles.ADMIN || allowedRoles.includes(userDetail.role)){
               req.loggedInUser = userSvc.getUserPublicProfile(userDetail);
               req.sessionData = authData; 
                next()
            } else {
                next ({
                    code: 403,
                    message: "Access Denied",
                    status: "ACCESS_DENIED"
                })
            }
        }catch(exception){
            next(exception)
        }
    }
}

module.exports = auth 

