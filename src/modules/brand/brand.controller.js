// to store data. logic creation
const { Status } = require("../../config/constants");
const brandSvc = require("./brand.service")
const productSvc = require("../products/product.service")
class BrandController {
    createBrand = async(req, res, next) => {
        try{
            const payload = await brandSvc.transformToBrandData(req);
            const brand = await brandSvc.createData(payload) 
            res.json({
                data: brand,
                message: "Brand created successfully",
                status: "BRAND_CREATED",
                options: null 
            })
        }catch(exception){
            next(exception)
        }
    };
    updateBrandById = async(req, res, next) => {
        try {
           const brandDetail = await brandSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!brandDetail){
            throw {
                code: 422,
                message: "Brand does not exists.",
                status: "BRAND_NOT_FOUND_ERR"
            };
        }
        const payload = await brandSvc.transformToBrandUpdateData(req, brandDetail)
        const brand = await brandSvc.updateSingleRowByFilter({_id: brandDetail._id}, payload)
        res.json({
                data: brand,
                message: "Brand Updated successfully",
                status: "BRAND_UPDATED",
                options: null 
            })
        }catch(exception) {
            next(exception) 
        }
    };
    listAllBrands = async(req, res, next) => {
        try {
            let filter = {}
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
            if(req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }
            const {data, pagination} = await brandSvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Brand List....",
                status: "BRAND_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
    frontListAllBrands = async(req, res, next) => {
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
           
            const {data, pagination} = await brandSvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Brand List....",
                status: "BRAND_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
    getBrandDetailById = async(req, res, next) => {
    try {
        const brandDetail = await brandSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!brandDetail){
            throw {
                code: 422,
                message: "Brand does not exists.",
                status: "BRAND_NOT_FOUND_ERR"
            }
        }
        res.json({
            data: brandDetail,
            message: "Brand Detail",
            status: "BRAND_DETAIL",
            options: null
         })
    }catch(exception){
        next(exception)
    }
};
deleteBrandById = async(req, res, next) => {
    try{
        const brandDetail = await brandSvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!brandDetail){
            throw {
                code: 422,
                message: "Brand does not exists.",
                status: "BRAND_NOT_FOUND_ERR"
            }
        }
        const del = await brandSvc.deleteRowsByFilter({
            _id: brandDetail._id
        })
         res.json({
            data: del,
            message: "Brand Deleted Successfully",
            status: "BRAND_DELETED",
            options: null
         })
    }catch(exception) {
        next(exception)
    }
}
frontBrandDetailBySlug = async(req, res, next) => {
    try {
        const brandDetail = await brandSvc.getSingleRowByFilter({
            slug: req.params.slug 
        });
        if(!brandDetail){
            throw {
                code: 422,
                message: "Brand does not exists.",
                status: "BRAND_NOT_FOUND_ERR"
            }
        }
        let filter = {
                status: Status.ACTIVE,
                brand: brandDetail._id, 
            }; 
            if(req.query.search) {
                filter = {
                    ...filter, 
                    $OR: [
                   { name: new RegExp(req.query.search, 'i') },
                   { description: new RegExp(req.query.search, 'i') },
                   { sku: new RegExp(req.query.search, 'i') },
                    ],
                };
            }
            if(req.query.isFeatured) {
                filter = {
                    ...filter,
                    isFeatured: true
                }
            }
              const {data, pagination} = await productSvc.getAllRowsByFilter(filter, req.query); 
        res.json({
            data: {
                brand: brandDetail,
                products: data
            },
            message: "Brand Detail with products",
            status: "BRAND_DETAIL_BY_SLUG",
            options: {pagination}
         })
    }catch(exception){
        next(exception)
    }
}
}
const brandCtrl = new BrandController()
module.exports = brandCtrl 