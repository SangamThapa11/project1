
class HomeController {
     healthCheck = (req, res, next) => {
    res.json({
        data: "any",
        message: "Server is working!",
        status: "SUCCESS_FAILED",
        options: null
    }) 
}
    aboutUsContent = (req, res, next) => {
    res.json({
        data: "ABOUT US",
        message: "Server is working!",
        status: "SUCCESS_FAILED",
        options: null
    })
}

}

const homeCtrl = new HomeController();
module.exports = homeCtrl