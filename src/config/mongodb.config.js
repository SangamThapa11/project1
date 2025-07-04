const mongoose = require("mongoose");
const { MongodbConfig } = require("./config");

(async()=>{
    try {
        await mongoose.connect(MongodbConfig.url, {
            dbName: MongodbConfig.dbname, 
            autoCreate: true,
            autoIndex: true,   
        })
        console.log("*********Mongodb Connected Successfully*********"); 
    }catch(exception){
        console.log("Error Connecting bd server", exception)
        process.exit(1)
    }
}) ()