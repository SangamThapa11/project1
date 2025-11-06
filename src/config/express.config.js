const express = require ("express")
const router = require("./router.config")
const { fileDelete } = require("../utilities/helpers")
const cors = require("cors")
const {rateLimit} = require("express-rate-limit")
const helmet = require("helmet")
require("./sql.config")
require("./mongodb.config")


const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://admin-erj3.onrender.com',
  // Add your production domains here
];
//cors 
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

//rate-limit
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8', 
    legacyHeaders: false,
}))

//helmet
app.use(helmet())

//body parser execute middleware loading
app.use(express.json({
    limit: "10mb"
}))   //parser only json content 

//url encoded parser setup
app.use(express.urlencoded({
    extended: true, 
    limit: "10mb"
}))

app.use('/api/v1', router)

// 404 not found error handling
app.use((req, res, next) => {
    next({
        code:404, 
        message: "Not Found!",
        status: "NOT_FOUND_ERR",
    })
})


// error handling middleware
app.use((error, req, res, next)=>{
    console.log(error)
    let code = error.code || 500
    let detail = error.detail || null;
    let msg = error.message || "Internal Server Error...."
    let status = error.status || "INTERNAL_SERVER_ERR"

if (req.file) {
    fileDelete(req.file.path)
}
if (error.name === "MongoServerError") {
    code = 400,
    detail = {};
    status = "VALIDATION_FAILED_ERR"
    const columns = Object.keys(error.keyPattern);
    msg = ''; 
    columns.map((field)=> {
        detail[field] = `${field} should be unique` 
        msg += `${field} should be unique. \n`; 
    })
}
    res.status(code).json({
        error: detail, 
        message: msg, 
        status: status,
        options: null
    }); 
})
module.exports = app
