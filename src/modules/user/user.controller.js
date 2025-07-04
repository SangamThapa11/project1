
const userSvc = require("./user.service");

class UserController {
    async listAllUsers (req, res, next) {
        try {
            let filter = {
                _id: {$ne: req.loggedInUser._id}
            }
            //user searching
            if(req.query.search) {
                filter = {
                    ...filter,
                    $or: [
                        {name: new RegExp(req.query.search, "i")}, 
                        {email: new RegExp(req.query.search, "i")}, 
                        {phone: new RegExp(req.query.search, "i")}, 
                        {address: new RegExp(req.query.search, "i")}, 
                    ],
                };
            }
            //filter 
            if(req.query.role) {
                filter = {
                    ...filter, 
                    role: req.query.role.toLowerCase()
                }
            }
            const {data, pagination} = await userSvc.getAllUsersByFilter(filter, req.query) 

            res.json({
                data: data,
                message: "User List",
                status: "USER_LIST_FETCHED",
                options: {
                    pagination
                }
            })
        }catch(exception) {
            next(exception)
        }
    }
    async getUserDetail(req, res, next) {
        try {
            const userDetail = await userSvc.getSingleRowByFilter({
                _id: req.params.id 
            })
            if(!userDetail) {
                throw {
                    code: 422,
                    message: "User not found",
                    status: "USER_NOT_FOUND"
                };
            }
            res.json({
                data: userSvc.getUserPublicProfile(userDetail),
                message: "User Profile",
                status: "USER_PROFILE",
                options: null 
            })
        }catch(exception) {
            next(exception) 
        }
    }
    async updateUser(req, res, next) {
        try {
            const userDetail = await userSvc.getSingleRowByFilter({
                _id: req.params.id 
            })
            if(!userDetail) {
                throw {
                    code: 422,
                    message: "User not found",
                    status: "USER_NOT_FOUND"
                };
            }
            const updateData = await userSvc.transformToUpdateUserData(req);
            const update = await userSvc.updateSingleRowByFilter({
                _id: userDetail._id
            }, updateData)
            res.json({
                data: userSvc.getUserPublicProfile(update),
                message: "Profile Updated",
                status: "USER_PROFILE_UPDATED",
                options: null
            })
        }catch(exception) {
            next(exception)
        }
    }
    async deleteUserById(req, res, next){
        try {
            const userDetail = await userSvc.getSingleRowByFilter({
                _id: req.params.id 
            })
            if(!userDetail) {
                throw {
                    code: 422,
                    message: "User not found",
                    status: "USER_NOT_FOUND"
                };
            }
            const del = await userSvc.deleteSingleByFilter({
                _id: userDetail._id 
            })
            res.json({
                data: userSvc.getUserPublicProfile(del),
                message: "Profile Deleted",
                status: "USER_PROFILE_DELETED",
                options: null
            })
    }catch(exception) {
            next(exception)
        }
    }
}
const userCtrl = new UserController()
module.exports = userCtrl; 