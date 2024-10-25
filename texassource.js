const http = require('http')
const app = require('./Route/app')
const server = http.createServer(app)
const dotenv = require('dotenv').config()

server.listen (process.env.PORT, ()=>{
    console.log(`server is running on: ${process.env.PORT}`);
})