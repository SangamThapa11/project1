const multer = require("multer")
const fs = require('fs')


const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = './public/uploads/';
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true})
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const originalName = Date.now()+"-"+file.originalname
        cb(null, originalName)
    }
});

const uploader = (type="image") => {
    let allowExts = ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'webp', 'gif']
    let limit = 3*1024*1024; 


    if(type === 'doc') {
        allowExts = ['doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']
        limit = 5*1024*1024; 
    } else if(type === 'video') {
        allowExts = ['mp4']
        limit = 50*1024*1024;
    }

  
    const fileFilter = (req, file, cb) => {
        const exts = file.originalname.split(".").pop()
        if(allowExts.includes(exts.toLowerCase())) {
            cb(null, true)
        }else {
            cb({
                code: 422,
                message: "Invalid File Format",
                status : "FILE_FORMAT_NOT_SUPPORTED"
            })
        }
    }
    return multer({
        storage: myStorage,
        fileFilter: fileFilter, 
        limits: {
            fileSize: limit
        }
    }) 
}

module.exports = uploader