const cloudinary = require("cloudinary").v2
const { CloudinaryConfig } = require("../config/config");
const { fileDelete } = require("../utilities/helpers");


class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: CloudinaryConfig.cloudName,
            api_key: CloudinaryConfig.apiKey,
            api_secret: CloudinaryConfig.apiSecret
        })
    }
    fileUpload = async(filePath, dir="") => {
        try{
            const {public_id, secure_url} = await cloudinary.uploader.upload(filePath, {
                folder:"/project1/"+dir,
                unique_filename: true 
            })
            // image transformation 
            const url = cloudinary.url(public_id, {
                transformation: [
                    {aspect_ratio: "1.0", crop: "fill", width: 1024},
                    {fetch_format: "auto"},
                    {dpr: "auto", responsive: true}
                ]
            })
            fileDelete(filePath)
            return {
                publicId: public_id,
                imageUrl : secure_url,
                thumbUrl : url 
            }
        }catch(exception){
            throw exception
        }
    }
}

module.exports = CloudinaryService;  