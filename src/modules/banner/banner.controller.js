const { Op } = require("sequelize");
const fileUploadSvc = require("../../services/file-upload.service");
const BannerModel = require("./banner.model");
const { Status } = require("../../config/constants");

class BannerController {
    addBanner = async (req, res, next) => {
        try {
            let payload = req.body;
            if (!req.file) {
                throw {
                    code: 400,
                    detail: {
                        image: "Image is required",
                    },
                    message: "Validation Failed",
                    status: "VALIDATION_FAILED",
                };
            } else {
                payload.image = await fileUploadSvc.fileUpload(
                    req.file.path,
                    "/banner/");
            }
            const banner = await BannerModel.create(payload);
            res.json({
                data: banner,
                message: "Banner Created Successfully",
                status: "BANNER_ADDED_SUCCESS",
                options: null,
            });
        } catch (exception) {
            next(exception);
        }
    };
    getAllList = async (req, res, next) => {
        try {
            let filter = {};
            if (req.query.status) {
                filter = {
                    status: req.query.status
                };
            }
            if (req.query.search) {
                filter = {
                    ...filter,
                    [Op.or]: [
                        { title: { [Op.iLike]: `${req.query.search}%` } },
                        { url: { [Op.iLike]: `${req.query.search}%` } },
                    ],
                };
            }
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 15;
            const skip = (page - 1) * limit;

            const { rows, count } = await BannerModel.findAndCountAll({
                where: filter,
                order: [["createdAt", "desc"]],
                offset: skip,
                limit: limit,
            });
            res.json({
                data: rows,
                message: "Banner List",
                status: "BANNER_LISTED",
                options: {
                    pagination: {
                        page: page,
                        limit: limit,
                        total: count
                    },
                },
            });

        } catch (exception) {
            next(exception)
        }
    };
    ListForHome = async (req, res, next) => {
        try {
            let filter = {
                status: Status.ACTIVE
            };
            if (req.query.search) {
                filter = {
                    ...filter,
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${req.query.search}%` } },
                        { url: { [Op.iLike]: `%${req.query.search}%` } },
                    ],
                };
            }
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 15;
            const skip = (page - 1) * limit;

            const { rows, count } = await BannerModel.findAndCountAll({
                where: filter,
                order: [["createdAt", "desc"]],
                offset: skip,
                limit: limit,
            })
            res.json({
                data: rows,
                message: "Banner List",
                status: "BANNER_LISTED",
                options: {
                    pagination: {
                        page: page,
                        limit: limit,
                        total: count
                    },
                },
            });

        } catch (exception) {
            next(exception);
        }
    }
    getDetailById = async (req, res, next) => {
        try {
            const bannerDetail = await BannerModel.findByPk(req.params.id);
            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner Not Found",
                    status: "BANNER_NOT_FOUND",
                };
            }
            res.json({
                data: bannerDetail,
                message: "Banner Detail",
                status: "BANNER_DETAIL",
                options: null,
            });
        } catch (exception) {
            next(exception)
        }
    };
    updatedBanner = async (req, res, next) => {
        try {
            const bannerDetail = await BannerModel.findByPk(req.params.id);
            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner Not Found",
                    status: "BANNER_NOT_FOUND",
                };
            }
            let payload = req.body;
            if (req.file) {
                payload.image = await fileUploadSvc.fileUpload(
                    req.file.path, "/banner/"
                );
            } else {
                payload.image = bannerDetail.image;
            }
            await bannerDetail.update(payload, {
                where: {
                    _id: bannerDetail._id,
                },
            });
            res.json({
                data: bannerDetail,
                message: "Banner Updated",
                status: "BANNER_UPDATED",
                options: null
            });

        } catch (exception) {
            next(exception)
        }
    };
    deleteBanner = async (req, res, next) => {
        try {
            const bannerDetail = await BannerModel.findByPk(req.params.id);
            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner Not Found",
                    status: "BANNER_NOT_FOUND",
                };
            }
            const del = await BannerModel.destroy({
                where: {
                    _id: bannerDetail._id,
                },
            });
            res.json({
                data: bannerDetail,
                message: "Banner Deleted",
                status: "BANNER_DELETED",
                options: null
            });
        } catch (exception) {
            next(exception)
        }
    };
}
const bannerCtrl = new BannerController()
module.exports = bannerCtrl
