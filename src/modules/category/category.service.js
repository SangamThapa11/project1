//model interaction with controller

const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const fileUploadSvc = require("../../services/file-upload.service");
const CategoryModel = require("./category.model");
const { ResetPasswordDTO } = require("../auth/auth.validator");
const userSvc = require("../user/user.service");
const brandSvc = require("../brand/brand.service");

class CategoryService extends BaseService {
    async transformToCategoryData(req) {
        try {
            let payload = req.body;
            if(req.file) {
                payload.image = await fileUploadSvc.fileUpload(req.file.path, 'category/') 
            }
            payload.slug = slugify(payload.name, {
                lower: true,
                remove: /[*+~'"!:@]/g, 
            }); 
            payload.createdBy = req.loggedInUser._id; 
            // to recive foreign key
            if(!payload.parentId || payload.parentId === null || payload.parentId === 'null') {
                payload.parentId = null 
            }
            if(!payload.brands || payload.brands === null || payload.brands ==='null'){
                payload.brands = null 
            }
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async transformToCategoryUpdateData(req, oldCategory){
        try {
            let payload = req.body;
            if(req.file) {
                payload.image = await fileUploadSvc.fileUpload(req.file.path, 'category/') 
            }else {
                payload.image = oldCategory.logo 
            }
            payload.updatedBy = req.loggedInUser._id; 
            if(!payload.parentId || payload.parentId === null || payload.parentId === 'null') {
                payload.parentId = null 
            }
            if(!payload.brands || payload.brands === null || payload.brands ==='null'){
                payload.brands = null 
            }
            payload.updatedBy = req.loggedInUser._id;
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async getSingleRowByFilter(filter) {
        try {
            const dataRow = await CategoryModel.findOne(filter)
            .populate('parentId', ['_id', 'name', 'slug', 'image','inMenu','isFeatured', 'status', 'brands', 'parentId'])
            .populate("brands", ['_id', 'name', 'slug', 'logo', 'status', 'isFeatured'])
            .populate("createdBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("updatedBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            return dataRow; 
        }catch (exception) {
            throw exception; 
        }
    }
    async getAllRowsByFilter(filter={}, query={}) {
        try {
            const page = +query.page || 1
            const limit = +query.limit || 15
            const skip = (page-1)*limit 

            const data = await CategoryModel.find(filter)
            .populate('parentId', ['_id', 'name', 'slug', 'image','inMenu','isFeatured', 'status', 'brands', 'parentId'])
            .populate("brands", ['_id', 'name', 'slug', 'logo', 'status', 'isFeatured'])
            .populate("createdBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("updatedBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .sort({createdAt: "desc"})
            .skip(skip)
            .limit(limit) 
            const total = await CategoryModel.countDocuments(filter)
            return {
                data: data.map((row) => this.getPublicCategoryProfile(row)),
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
    getPublicCategoryProfile(catData){
        return {
           image: catData?.image?.thumbUrl,
            _id: catData._id,
            name: catData.name,
            slug: catData.slug,
            parentId: {
                image: catData?.parentId?.image?.thumbUrl,
                _id: catData?.parentId?._id,
                name: catData?.parentId?.name,
                slug: catData?.parentId?.slug,
                parentId: catData?.parentId?._id,
                brands: catData?.parentId?.brands, 
                inMenu: catData?.parentId?.inMenu,
                isFeatured: catData?.parentId?.isFeatured,
                status: catData?.parentId?.status
            },
            brands: catData.brands && catData.brands.map((brand)=> brandSvc.getPublicBrandProfile(brand)),
            inMenu: catData?.inMenu,
            isFeatured: catData?.isFeatured,
            status: catData?.status,
            createdBy: catData.createdBy ? userSvc.getUserPublicProfile(catData?.createdBy) : null,
            updatedBy: catData.updatedBy ? userSvc.getUserPublicProfile(catData?.updatedBy) : null, 
            createdAt: catData.createdAt,
            updatedAt: catData.updatedAt,
        }
    }
}

const categorySvc = new CategoryService(CategoryModel)
module.exports = categorySvc