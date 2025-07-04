
const BaseService = require("../../services/base.service")
const UserModel = require("./user.model")
const fileUploadSvc = require("../../services/file-upload.service")
class UserService extends BaseService {
    getUserPublicProfile (user) {
        return {
            _id: user._id, 
            name: user.name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            status: user.status,
            address: user.address,
            phone: user.phone,
            image: user?.image?.thumbUrl,  
        }
    }

    async getAllUsersByFilter(filter, {page=1, limit=15}) {
        try {
            const skip = (page - 1) * limit; 

            const data = await UserModel.find(filter)
            .sort({name: "asc"})
            .skip(skip)
            .limit(limit) 

            const count = await UserModel.countDocuments(filter);
            return{
                data: data.map(this.getUserPublicProfile),
                pagination: {
                    page: page,
                    limit: limit, 
                    total: count 
                }
            }
        }catch(exception) {
            throw exception
        }
    }
    async transformToUpdateUserData(req){
        try{
             const data = req.body;
        if(req.file) {
            data.image =await fileUploadSvc.fileUpload(req.file.path, 'user/')
        }
        return data; 
        }catch (exception){
            throw exception
        }
    }  
}

const userSvc = new UserService(UserModel)
module.exports = userSvc 

/*
const UserModel = require("./user.model")
class UserService {
    createUser = async (data) => {
        try {
            const user = new UserModel(data);
            return await user.save()

        }catch(exception){
            throw exeption
        }
    }
}
const userSvc = new UserService()
module.exports = userSvc 
*/
