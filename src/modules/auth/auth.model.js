const { required } = require("joi")
const mongoose = require("mongoose")

const AuthSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    accessToken: {
        actual: String, 
        masked: String, 
    }, 
    refreshToken: {
        actual: String, 
        masked: String
    },
    sessionData: String
})

const AuthModel = mongoose.model("Auth", AuthSchema)
module.exports = AuthModel