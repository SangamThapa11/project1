//model interaction with controller

const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const fileUploadSvc = require("../../services/file-upload.service");
const ProductModel = require("./product.model");
const { ResetPasswordDTO } = require("../auth/auth.validator");
const userSvc = require("../user/user.service");
const brandSvc = require("../brand/brand.service");
const { randomStringGenerator } = require("../../utilities/helpers");
const { UserRoles } = require("../../config/constants");
const categorySvc = require('../category/category.service');

class ProductService extends BaseService {
    async transformToProductData(req) {
        try {
            let payload = req.body;
           
            payload.slug = slugify(payload.name+"-"+randomStringGenerator(10), {
                lower: true,
                remove: /[*+~'"!:@]/g, 
            }); 
            payload.createdBy = req.loggedInUser._id; 
            // to recive foreign key
            if(!payload.category|| payload.category === null || payload.category === 'null') {
                payload.category = null 
            }
            if(!payload.brand || payload.brand === null || payload.brand ==='null'){
                payload.brand = null 
            }
            payload.price = payload.price * 100
            payload.afterDiscount = payload.price - payload.price * payload.discount/100
            
            payload.seller = (req.loggedInUser.role === UserRoles.ADMIN && payload.seller && payload.seller !== 'null')
                ? payload.seller
                : req.loggedInUser._id;

            payload.images = []; 

             if(req.file) {
                let imagesUploaded = req.files.map((image) => fileUploadSvc.fileUpload(image.path, 'product/'))
                // file upload vako navako check garne 
                let uploadStatus = await Promise.allSettled(imagesUploaded)
                uploadStatus.forEach((uploadFile) => {
                    if(uploadFile.status === 'fulfilled') {
                        payload.images.push(uploadFile.value)  
                    }
                }) 
            }
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async transformToProductUpdateData(req, oldProduct){
        try {
             let payload = req.body;
            // to recive foreign key
            if(!payload.category|| payload.category === null || payload.category === 'null') {
                payload.category = null 
            }
            if(!payload.brand || payload.brand === null || payload.brand ==='null'){
                payload.brand = null 
            }
            payload.price = payload.price * 100
            payload.afterDiscount = payload.price - payload.price * payload.discount/100
            
            payload.seller = (req.loggedInUser.role === UserRoles.ADMIN && payload.seller && payload.seller !== 'null')
                ? payload.seller
                : req.loggedInUser._id;

            payload.images = [...oldProduct.images]; 

             if(req.file) {
                let imagesUploaded = req.files.map((image) => fileUploadSvc.fileUpload(image.path, 'product/'))
                // file upload vako navako check garne 
                let uploadStatus = await Promise.allSettled(imagesUploaded)
                uploadStatus.forEach((uploadFile) => {
                    if(uploadFile.status === 'fulfilled') {
                        payload.images.push(uploadFile.value); 
                    }
                }); 
            }
            payload.updatedBy = req.loggedInUser._id; 
            
            return payload 
        }catch(exception) {
            throw exception
        }
    }
    async getSingleRowByFilter(filter) {
        try {
            const dataRow = await ProductModel.findOne(filter)
            .populate('category', ['_id', 'name', 'slug', 'image','inMenu','isFeatured', 'status', 'brands', 'parentId'])
            .populate("brand", ['_id', 'name', 'slug', 'logo', 'status', 'isFeatured'])
            .populate("seller", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("createdBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("updatedBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            let data = this.getPublicProductProfile(dataRow);
            return data; 
        }catch (exception) {
            throw exception; 
        }
    }
    async getAllRowsByFilter(filter={}, query={}) {
        try {
            const page = +query.page || 1
            const limit = +query.limit || 15
            const skip = (page-1)*limit 

            const data = await ProductModel.find(filter)
            .populate('category', ['_id', 'name', 'slug', 'image','inMenu','isFeatured', 'status', 'brands', 'parentId'])
            .populate("brand", ['_id', 'name', 'slug', 'logo', 'status', 'isFeatured'])
            .populate("seller", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("createdBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .populate("updatedBy", ['_id', 'name', 'email', 'role', 'image', 'status'])
            .sort({createdAt: "desc"})
            .skip(skip)
            .limit(limit) 
            const total = await ProductModel.countDocuments(filter)
            return {
                data: data.map((row) => this.getPublicProductProfile(row)),
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
    getPublicProductProfile(productData){
        return {
            _id: productData._id,
            name: productData.name,
            slug: productData.slug,
            category: productData.category && productData.category.length > 0 ? productData.category.map((cat) => categorySvc.getPublicCategoryProfile(cat)) : null,
            brand: productData.brand && brandSvc.getPublicBrandProfile(productData.brand),
            price: productData?.price, 
            discount: productData?.discount, 
            afterDiscount: productData?.afterDiscount,  
            description: productData?.description, 
            stock: productData?.stock, 
            sku: productData?.sku, 
            attributes: productData?.attributes, 
            images: productData?.images, 
            isFeatured: productData?.isFeatured,
            seller: productData?.seller ? userSvc.getUserPublicProfile(productData.seller) : null, 
            status: productData?.status,
            createdBy: productData.createdBy ? userSvc.getUserPublicProfile(productData?.createdBy) : null,
            updatedBy: productData.updatedBy ? userSvc.getUserPublicProfile(productData?.updatedBy) : null, 
            createdAt: productData.createdAt,
            updatedAt: productData.updatedAt,
        }
    }
}

const productSvc = new ProductService(ProductModel)
module.exports = productSvc