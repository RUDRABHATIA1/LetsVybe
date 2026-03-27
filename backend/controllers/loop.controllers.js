import Loop from "../models/loop.model.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import Notification from "../models/notifications.model.js"
import { getSocketId, io } from "../socket.js"

export const uploadloop = async (req,res)=>{
    try {
        const {caption, mediaType} = req.body 
        let media 
        if(req.file){
            const cloudinaryResult = await uploadOnCloudinary(req.file.path)
            media = cloudinaryResult.secure_url
        }else{
            return res.status(400).json({message:"media is required"})
        }
        const loop = await Loop.create({caption,media,mediaType,author:req.userId})
        const user = await User.findById(req.userId)
        user.loops.push(loop._id)
        await user.save()
        const populatedLoop = await Loop.findById(loop._id).populate("author","name username profileImage")
        return res.status(201).json(populatedLoop)
    } catch (error) {
        console.log("Upload Loop Error:", error)
        return res.status(500).json({message:`uploadLoop error: ${error.message}`})
    }
}



export const like = async (req, res)=>{
    try {
        const loopId= req.params.loopId
        const loop = await Loop.findById(loopId)
        if(!loop){
            return res.status(400).json({message:`loop not found`})
        }
        const alreadyLiked = loop.likes.some(id=>id.toString()==req.userId.toString())
        if(alreadyLiked){
            loop.likes= loop.likes.filter(id=>id.toString()!==req.userId.toString())
        }else{
            loop.likes.push(req.userId)
            const authorId = loop.author?.toString ? loop.author.toString() : loop.author?._id?.toString()
            if(authorId && authorId !== req.userId.toString()){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:authorId,
                    type:"like",
                    post:loop._id,
                    message:"Liked your Loop"
                })
                const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver loop")
                const receiverSocketId=getSocketId(authorId)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }
        await loop.save()
        await loop.populate("author","name username profileImage")
        return res.status(200).json(loop)
    } catch (error) {
        return res.status(500).json({message:`like Loop Error ${error}`})
    }
}


export const comment = async(req,res)=>{
    try {
        const {message} = req.body 
        const loopId= req.params.loopId
        const loop = await Loop.findById(loopId)
        if(!loop){
            return res.status(400).json({message:"loop not found "})
        }
        loop.comments.push({
            author:req.userId,
            message
        })
            const authorId = loop.author?.toString ? loop.author.toString() : loop.author?._id?.toString()
            if(authorId && authorId !== req.userId.toString()){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:authorId,
                    type:"comment",
                    post:loop._id,
                    message:"Commented on the Loop"
                })
                const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver loop")
                const receiverSocketId=getSocketId(authorId)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        await loop.save()
        await loop.populate("author","name username profileImage")
        await loop.populate("comments.author")
        return res.status(200).json(loop)
    } catch (error) {
        return res.status(500).json({message:`comment Loop error ${error}`})
    }
}


export const getAllLoops = async (req, res)=>{
    try {
        let loops = await Loop.find({})
        .populate("author","name username profileImage")
        .populate("comments.author")

        // Default behavior: show newest loops first.
        const order = (req.query.order || "recent").toLowerCase()
        if (order === "random") {
            loops = loops.sort(() => Math.random() - 0.5)
        } else {
            loops = loops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return res.status(200).json(loops)
    } catch (error) {
        return res.status(500).json({message:`get all loops error ${error}`})
    }
}