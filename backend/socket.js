import http from "http"
import express from 'express'
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173", "https://lets-vybe.vercel.app"],
        methods:["GET","POST"]
    }
})

const userSocketMap={}

export const getSocketId=(receiverId)=>{
    return userSocketMap[receiverId]
}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!=undefined){
        userSocketMap[userId]=socket.id
    }

    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        delete userSocketMap[userId]

    })

})


export {io,server,app}