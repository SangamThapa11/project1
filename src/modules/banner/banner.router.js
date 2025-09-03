const Joi = require("joi");
const {UserRoles} = require("../../config/constants");
const auth = require("../../middleware/auth.middleware");
const uploader = require("../../middleware/uploader.middleware");
const bodyValidator = require("../../middleware/validator.middleware");
const bannerCtrl = require("./banner.controller");

const bannerRouter = require("express").Router(); 

const bannerDTO = Joi.object({
    title: Joi.string().min(3).max(150), 
    url: Joi.string().uri().required(),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    image: Joi.string().allow(null, '').optional().default(null)
})

//public api 
bannerRouter.get("/for-home", bannerCtrl.ListForHome)

// create operate
bannerRouter.post("/", auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(bannerDTO), bannerCtrl.addBanner)
// list all 
bannerRouter.get("/", auth([UserRoles.ADMIN]), bannerCtrl.getAllList)
// view one
bannerRouter.get("/:id", auth([UserRoles.ADMIN]), bannerCtrl.getDetailById)
//update 
bannerRouter.put("/:id", auth([UserRoles.ADMIN]), uploader().single('image'), bodyValidator(bannerDTO), bannerCtrl.updatedBanner)
//delete
bannerRouter.delete("/:id", auth([UserRoles.ADMIN]), bannerCtrl.deleteBanner);

module.exports = bannerRouter;