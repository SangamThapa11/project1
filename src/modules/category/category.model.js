// Database Structure for mongodb
const { required } = require("joi")
const mongoose = require("mongoose");
const { Status } = require("../../config/constants");
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 100,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parentId: {
        type: mongoose.Types.ObjectId, 
        ref: "Category",
        default: null
    },
    image: {
        publicId: String,
        imageUrl: String,
        thumbUrl: String
    },
    brands: [{
        type: mongoose.Types.ObjectId, 
        ref: "Brand", 
        default: null 
    }],
    inMenu:{
        type: Boolean,
        default: false
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

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel
