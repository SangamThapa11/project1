const http = require("http")
const app = require("./src/config/express.config")
//socket import
const {Server} = require("socket.io") 

const httpServer = http.createServer(app)

//socket server
const io = new Server(httpServer, {
    cors: "*"
})

// socket event listen and emit 
//event lsitener
io.on('connection', (socket) => {
    socket.on("newMessageSent", (data) => {
        socket.emit("selfMessageReceived", data)
        socket.emit("messageReceived", data)
    })
    socket.on("loggedIn", (user) => {
        socket.broadcast.emit("notifyLogin", user)
    })
}) 

const PORT = 9005;
//const HOST = "127.0.0.1";
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, (err) => {
    if(!err) {
        console.log(`Server is working on port ${PORT}`), 
        console.log("Press CTRL+C to disconnect the server ........")
        console.log('Server URL: http://${HOST}:${PORT}')
    }
})