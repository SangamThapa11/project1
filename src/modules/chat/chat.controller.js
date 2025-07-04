const ChatModel = require("./chat.model");

class ChatController {
    async createNewChat(req, res, next) {
        try{
            const payload = req.body; 
            payload.sender = req.loggedInUser._id

            const chat = new ChatModel(payload)
            await chat.save() 

            res.json({
                data: chat,
                message: "New Chat Sent",
                status: "CHAT_SENT",
                options: null
            })

        }catch(exception){
            next(exception)
        }
    }
    async listAllChats(req, res, next) {
        try {
            let filter = {
                $or: [
                    {sender: req.loggedInUser._id, receiver: req.params.userId},
                    {sender: req.params.userId, receiver: req.loggedInUser._id},
                ]
            }; 
            if(req.query.search) {
                filter = {
                    ...filter,
                    message: new RegExp(req.query.search, 'i')
                }
            }
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 20;

            const skip = (page-1) * limit 
            const list = await ChatModel.find(filter)
            .populate("sender", ['_id', 'name', 'email', 'image', 'role', 'status', 'gender'])
            .populate("receiver", ['_id', 'name', 'email', 'image', 'role', 'status', 'gender'])
            .sort({createdAt: "desc"})
            .skip(skip)
            .limit(limit)
            const count = await ChatModel.countDocuments(filter) 
            
            res.json({
                data: list,
                message: "Chat list",
                status: "YOUR_CHAT",
                options: {
                    pagination: {
                        page: page,
                        limit: limit,
                        total: count 
                    }
                }
            })
        }catch(exception) {
            next(exception)
        }
    }
}
const chatCtrl = new ChatController()
module.exports = chatCtrl
