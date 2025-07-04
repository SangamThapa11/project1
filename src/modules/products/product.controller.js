// to store data. logic creation
const { decodeBase64 } = require("bcryptjs");
const { Status } = require("../../config/constants");
const productSvc = require("./product.service")
class ProductController {
    createProduct  = async(req, res, next) => {
        try{
            const payload = await productSvc.transformToProductData(req);
            const product  = await productSvc.createData(payload) 
            res.json({
                data: product,
                message: "Product  created successfully",
                status: "PRODUCT_CREATED",
                options: null 
            })
        }catch(exception){
            next(exception)
        }
    };
    updateProductById = async(req, res, next) => {
        try {
           const productDetail = await productSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!productDetail){
            throw {
                code: 422,
                message: "Product  does not exists.",
                status: "PRODUCT_NOT_FOUND_ERR"
            };
        }
        const payload = await productSvc.transformToProductUpdateData(req, productDetail);
        const product  = await productSvc.updateSingleRowByFilter({_id: productDetail._id}, payload);
        res.json({
                data: product ,
                message: "Product  Updated successfully",
                status: "PRODUCT_UPDATED",
                options: null 
            })
        }catch(exception) {
            next(exception) 
        }
    };
    listAllProducts = async(req, res, next) => {
        try {
            let filter = {}
            if(req.query.search) {
                filter = {
                    $OR: [
                        {name: new RegExp(req.query.search, 'i')},
                        {description: new RegExp(req.query.search, 'i')},
                        {sku: new RegExp(req.query.search, 'i')},
                    ]
                }
            }
            if(req.query.isFeatured) {
                filter = {
                    ...filter,
                    isFeatured: true
                }
            }
             
            if(req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }
            const {data, pagination} = await productSvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Product  List....",
                status: "PRODUCT_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
    
    getProductDetailById = async(req, res, next) => {
    try {
        const productDetail = await productSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!productDetail){
            throw {
                code: 422,
                message: "Product  does not exists.",
                status: "PRODUCT_NOT_FOUND_ERR"
            }
        }
        res.json({
            data: productDetail,
            message: "Product  Detail",
            status: "PRODUCT_DETAIL",
            options: null
         })
    }catch(exception){
        next(exception)
    }
};
deleteProductById = async(req, res, next) => {
    try{
        const productDetail = await productSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!productDetail){
            throw {
                code: 422,
                message: "Product  does not exists.",
                status: "PRODUCT_NOT_FOUND_ERR"
            }
        }
        const del = await productSvc.deleteRowsByFilter({
            _id: productDetail._id
        })
         res.json({
            data: del,
            message: "Product  Deleted Successfully",
            status: "PRODUCT_DELETED",
            options: null
         })
    }catch(exception) {
        next(exception)
    }
}
frontListAllProducts = async(req, res, next) => {
        try {
            let filter = {
                status: Status.ACTIVE 
            }
            if(req.query.search) {
                filter = {
                    name: new RegExp(req.query.search, 'i')
                }
            }
            if(req.query.isFeatured) {
                filter = {
                    ...filter,
                    isFeatured: true
                }
            }
            if(req.query.inMenu) {
                filter = {
                    ...filter,
                    inMenu: true
                }
            }
           
            const {data, pagination} = await productSvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Product  List....",
                status: "PRODUCT_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
frontProductDetailBySlug = async(req, res, next) => {
    try {
        const productDetail = await productSvc.getSingleRowByFilter({
            slug: req.params.slug 
        });
        if(!productDetail){
            throw {
                code: 422,
                message: "Product  does not exists.",
                status: "PRODUCT_NOT_FOUND_ERR"
            }
        }
        let filter = {
                status: Status.ACTIVE,
                category: {$in: productDetail.category}, 
                _id: {$ne: productDetail._id}
            }; 
            if(req.query.search) {
                filter = {
                    name: new RegExp(req.query.search, 'i')
                }
            }
            if(req.query.isFeatured) {
                filter = {
                    ...filter,
                    isFeatured: true
                }
            }
            if(req.query.inMenu) {
                filter = {
                    ...filter,
                    inMenu: true
                }
            }
              const {data, pagination} = await productSvc.getAllRowsByFilter(filter, req.query); 

        res.json({
            data: {
                product : productSvc.getPublicProductProfile(productDetail),
                relatedProducts: data
            },
            message: "Product  Detail with products",
            status: "PRODUCT_DETAIL_BY_SLUG",
            options: {pagination}
         })
    }catch(exception){
        next(exception)
    }
}
}
const productCtrl = new ProductController()
module.exports = productCtrl 