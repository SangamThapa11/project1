const fs = require('fs');

const fileDelete = (filePath) => {
    if (fs.existsSync(filePath)) {
       return fs.unlinkSync(filePath)
    }
    return false; 
}
const randomStringGenerator = (len=100) => {
    const chars = "0123456789abcdefghijklmnopqwrtuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ" 
    const length = chars.length
    let randomStr = '';
    for (let i =1; i<=len; i++) {
        let posn = Math.ceil(Math.random()*(length-1));
        randomStr += chars[posn]
    }
    return randomStr
}
module.exports = {
    fileDelete,
    randomStringGenerator
}


