const homeRouter = require('express').Router();
const homeCtrl = require("./home.controller")


homeRouter.get("/",homeCtrl.healthCheck)
homeRouter.get("/about-us", homeCtrl.aboutUsContent)

module.exports = homeRouter; 