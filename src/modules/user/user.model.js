const { required } = require("joi");
const mongoose = require("mongoose");
const { UserRoles, Gender, Status } = require("../../config/constants");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        enum: Object.values(UserRoles),
        default: UserRoles.CUSTOMER
    }, 
    gender:{
        type: String, 
        enum: Object.values(Gender),
        required: true 
    },
    status: {
        type: String,
        enum: Object.values(Status),
        required: true,
        default: Status.INACTIVE 
    },
    address: String,
    phone: {
        type: String,
        required: true
    },
    image: {
        publicId: String,
        imageUrl: String,
        thumbUrl: String
    },
    activationToken: String,
    forgetToken: String,
    expiryTime: Date,
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true 
});

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel