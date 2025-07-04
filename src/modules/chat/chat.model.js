const { required } = require('joi')
const mongoose = require('mongoose')
const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String, 
        min: 1,
        max: 500,
        required: true
    }
}, {
    timestamps: true, 
    autoCreate: true, 
    autoIndex: true  
}); 

const ChatModel = mongoose.model("Chat", ChatSchema)
module.exports = ChatModel; 

