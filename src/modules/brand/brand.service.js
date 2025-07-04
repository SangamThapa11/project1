//model interaction with controller

const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const fileUploadSvc = require("../../services/file-upload.service");
const BrandModel = require("./brand.model");
const { ResetPasswordDTO } = require("../auth/auth.validator");

class BrandService extends BaseService {
    async transformToBrandData(req) {
        try {
            let payload = req.body;
            if(req.file) {
                payload.logo = await fileUploadSvc.fileUpload(req.file.path, 'brand/') 
            }
            payload.slug = slugify(payload.name, {
                lower: true,
                remove: /[*+~'"!:@]/g, 
            }); 
            payload.createdBy = req.loggedInUser._id; 
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async transformToBrandUpdateData(req, oldBrand){
        try {
            let payload = req.body;
            if(req.file) {
                payload.logo = await fileUploadSvc.fileUpload(req.file.path, 'brand/') 
            }else {
                payload.logo = oldBrand.logo 
            }
            payload.updatedBy = req.loggedInUser._id; 
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async getAllRowsByFilter(filter={}, query={}) {
        try {
            const page = +query.page || 1
            const limit = +query.limit || 15
            const skip = (page-1)*limit 

            const data = await BrandModel.find(filter)
            .sort({createdAt: "desc"})
            .skip(skip)
            .limit(limit) 
            const total = await BrandModel.countDocuments(filter)
            return {
                data: data.map((row) => this.getPublicBrandProfile(row)),
                pagination: {
                    page: page,
                    limit: limit,
                    total: total, 
                    noOfPages: Math.ceil(total/limit) 
                }
            };
        }catch (exception) {
            throw exception
        }
    }
    getPublicBrandProfile(brand) {
        return {
            _id: brand._id,
            name: brand.name,
            slug: brand.slug, 
            status: brand.status,
            isFeatured: brand.isFeatured,
            logo: brand?.logo?.thumbUrl
        }
    }
}

const brandSvc = new BrandService(BrandModel)
module.exports = brandSvc