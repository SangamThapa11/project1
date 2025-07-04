require("dotenv").config()

const CloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
};

const MongodbConfig = {
    url : process.env.MONGODB_URL,
    dbname: process.env.MONGODB_DBNAME
}

const PgConfig = {
   dialect: process.env.SQL_DIALECT, 
   host: process.env.SQL_HOST ,
   port: process.env. SQL_PORT ,
   user: process.env.SQL_USER ,
   password: process.env.SQL_PASSWORD,
   dbName : process.env.SQL_DBNAME
}

const SMTPConfig = {
    provider : process.env.SMTP_PROVIDER,
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    user : process.env.SMTP_USER,
    password : process.env.SMTP_PASSWORD,
    fromAddress : process.env.SMTP_FROM_ADDRESS
}

const AppConfig = {
    feUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET,

    khaltiSecretKey: process.env.KHALTI_SECRET_KEY,
    khaltiBaseUrl: process.env.KHALTI_BASE_URL
};
module.exports = {
    CloudinaryConfig,
    MongodbConfig,
    SMTPConfig,
    AppConfig,
    PgConfig
}