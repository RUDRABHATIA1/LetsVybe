import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import postRouter from './routes/post.routes.js'
import loopRouter from './routes/loop.routes.js'
import storyRouter from './routes/story.routes.js'
import messageRouter from './routes/message.routs.js'
import { app, server } from './socket.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public')
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
}

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173", "https://lets-vybe.vercel.app"],
    credentials:true 
}))

// Expose local uploads when Cloudinary is not configured.
app.use('/public', express.static(publicDir))

app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/loop',loopRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',messageRouter )

server.listen(port,()=>{
    connectDB()
    console.log(`Server running at http://localhost:${port}`)
} )