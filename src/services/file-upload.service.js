const CloudinaryService = require("./cloudinary.service");

class FileUploadService extends CloudinaryService {

}

const fileUploadSvc = new FileUploadService();
module.exports = fileUploadSvc;
