// Database Structure for mongodb
const { required } = require("joi")
const mongoose = require("mongoose");
const { Status } = require("../../config/constants");
const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        publicId: String,
        imageUrl: String,
        thumbUrl: String
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, 
{
    timestamps: true, 
    autoCreate: true,
    autoIndex: true  
}
);

const BrandModel = mongoose.model("Brand", BrandSchema)
module.exports = BrandModel
