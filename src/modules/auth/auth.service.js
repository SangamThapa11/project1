const jwt = require("jsonwebtoken")
const fileUploadSvc = require("../../services/file-upload.service")
const bcrypt = require('bcryptjs')
const {randomStringGenerator} = require("../../utilities/helpers")
const {AppConfig} = require("../../config/config")
const BaseService = require("../../services/base.service")
const AuthModel = require("./auth.model")

class AuthService extends BaseService {
    transformRegistrationData = async(req) => {
        try {
            const data = req.body;
        if(req.file) {
            data.image =await fileUploadSvc.fileUpload(req.file.path, 'user/')
        }
        //password encrption
        data.password = bcrypt.hashSync(data.password, 12)

        //data mapping for data activation
        data.status = "inactive"
        data.activationToken = randomStringGenerator(100) 

        return data; 
        }catch (exception){
            throw exception
        }
    }
    transformSessionData = (userId, req) => { 
        const authData = {
            user: userId,
            accessToken: {
                actual: jwt.sign({sub: userId, typ: "Bearer"},AppConfig.jwtSecret, {expiresIn: "1h"}),
                masked: randomStringGenerator(150)
            },
            refreshToken: {
                actual: jwt.sign({sub: userId, typ: "Refresh"},AppConfig.jwtSecret, {expiresIn: "7d"}),
                masked: randomStringGenerator(150)
            },
            sessionData: JSON.stringify({
                ip: req.ip,
                source: req.useragent,
                device: 'web'
            })
        }
        return authData;       
    }
}

const authSvc = new AuthService(AuthModel)
module.exports = authSvc