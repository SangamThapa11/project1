// to store data. logic creation
const { Status } = require("../../config/constants");
const categorySvc = require("./category.service")
const productSvc = require("../products/product.service")
class CategoryController {
    createCategory  = async(req, res, next) => {
        try{
            const payload = await categorySvc.transformToCategoryData(req);
            const category  = await categorySvc.createData(payload) 
            res.json({
                data: category ,
                message: "Category  created successfully",
                status: "CATEGORY_CREATED",
                options: null 
            })
        }catch(exception){
            next(exception)
        }
    };
    updateCategoryById = async(req, res, next) => {
        try {
           const categoryDetail = await categorySvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!categoryDetail){
            throw {
                code: 422,
                message: "Category  does not exists.",
                status: "CATEGORY_NOT_FOUND_ERR"
            };
        }
        const payload = await categorySvc.transformToCategoryUpdateData(req, categoryDetail);
        const category  = await categorySvc.updateSingleRowByFilter({_id: categoryDetail._id}, payload);
        res.json({
                data: category ,
                message: "Category  Updated successfully",
                status: "CATEGORY_UPDATED",
                options: null 
            })
        }catch(exception) {
            next(exception) 
        }
    };
    listAllCategories = async(req, res, next) => {
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
             if(req.query.inMenu) {
                filter = {
                    ...filter,
                    inMenu: true
                }
            }
            if(req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }
            const {data, pagination} = await categorySvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Category  List....",
                status: "CATEGORY_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
    
    getCategoryDetailById = async(req, res, next) => {
    try {
        const categoryDetail = await categorySvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!categoryDetail){
            throw {
                code: 422,
                message: "Category  does not exists.",
                status: "CATEGORY_NOT_FOUND_ERR"
            }
        }
        res.json({
            data: categoryDetail,
            message: "Category  Detail",
            status: "CATEGORY_DETAIL",
            options: null
         })
    }catch(exception){
        next(exception)
    }
};
deleteCategoryById = async(req, res, next) => {
    try{
        const categoryDetail = await categorySvc.getSingleRowByFilter({
            _id: req.params.id 
        })
        if(!categoryDetail){
            throw {
                code: 422,
                message: "Category  does not exists.",
                status: "CATEGORY_NOT_FOUND_ERR"
            }
        }
        const del = await categorySvc.deleteRowsByFilter({
            _id: categoryDetail._id
        })
         res.json({
            data: del,
            message: "Category  Deleted Successfully",
            status: "CATEGORY_DELETED",
            options: null
         })
    }catch(exception) {
        next(exception)
    }
}
frontListAllCategories = async(req, res, next) => {
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
           
            const {data, pagination} = await categorySvc.getAllRowsByFilter(filter, req.query); 

            res.json({
                data: data,
                message: "ALL Category  List....",
                status: "CATEGORY_DATA_FETCHED",
                options: {
                    pagination 
                }
            })
        }catch(exception) {
            next(exception) 
        }
    };
frontCategoryDetailBySlug = async(req, res, next) => {
    try {
        const categoryDetail = await categorySvc.getSingleRowByFilter({
            slug: req.params.slug 
        });
        if(!categoryDetail){
            throw {
                code: 422,
                message: "Category  does not exists.",
                status: "CATEGORY_NOT_FOUND_ERR"
            };
        }
        let filter = {
            status: Status.ACTIVE,
            category: {$in: [categoryDetail._id]}, 
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
                category : categoryDetail,
                products: data
            },
            message: "Category  Detail with products",
            status: "CATEGORY_DETAIL_BY_SLUG",
            options: {pagination}
         })
    }catch(exception){
        next(exception)
    }
}
}
const categoryCtrl = new CategoryController()
module.exports = categoryCtrl 