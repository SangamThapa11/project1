// Database Structure for mongodb
const mongoose = require("mongoose");
const { Status } = require("../../config/constants");
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 200,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: [{
        type: mongoose.Types.ObjectId, 
        ref: "Category",
        default: null
    }],
    brand: {
        type: mongoose.Types.ObjectId, 
        ref: "Brand", 
        default: null 
    },
    price: {
        type: Number,
        required: true, 
        min: 1000
    },
    discount:{
        type: Number,
        min: 0,
        max: 90,
        default: 0
    },
    afterDiscount: {
        type: Number, 
        required: true
    },

    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number, 
        min : 0
    },
    sku: String,
    isFeatured: Boolean, 
    attributes: [{
        name: String,
        value: [String]
    }],
    images: [{
        publicId: String,
        imageUrl: String,
        thumbUrl: String
    }],
    isFeatured:{
        type: Boolean,
        default: false
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
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

const ProductModel = mongoose.model("Product", ProductSchema)
module.exports = ProductModel
