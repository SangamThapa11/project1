const http = require("http")
const app = require("./src/config/express.config")

const httpServer = http.createServer(app)

const PORT = 9005;
const HOST = "127.0.0.1";

httpServer.listen(PORT, HOST, (err) => {
    if(!err) {
        console.log(`Server is working on port ${PORT}`), 
        console.log("Press CTRL+C to disconnect the server ........")
        console.log('Server URL: http://${HOST}:${PORT}')
    }
})