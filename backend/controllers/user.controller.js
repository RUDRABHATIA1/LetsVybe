import uploadOnCloudinary from '../config/cloudinary.js'
import Notification from '../models/notifications.model.js'
import User from '../models/user.model.js'

export const getCurrentUser = async (req, res) => {
try {
    const userId = req.userId
    const user = await User.findById(userId)
    .populate("posts loops followers following saved")
    .populate({
        path:"story",
        populate:[
            {path:"author", select:"name username profileImage"},
            {path:"viewers", select:"name username profileImage"}
        ]
    })
    if(!user){
        return res.status(400).json({message:"User Not Found"})
    }
    return res.status(200).json(user)
} catch (error) {
    return res.status(500).json({message:`Get Current User Error: ${error.message}`})   
}
}

export const suggestedUsers = async(req,res)=>{
    try {
        const users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password") 
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(`message:get suggested users error : ${error}`)
    }
}

export const editProfile= async(req,res)=>{
    try {
        const {name,username,bio,profession,gender}=req.body
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const trimmedUsername = (username || "").trim()
        const trimmedName = (name || "").trim()
        const normalizedGender = (gender || "").trim().toLowerCase()

        if(!trimmedUsername){
            return res.status(400).json({message:"username is required"})
        }

        if(!trimmedName){
            return res.status(400).json({message:"name is required"})
        }

        if(normalizedGender && !["male", "female"].includes(normalizedGender)){
            return res.status(400).json({message:"Gender must be male or female"})
        }

        const sameUserWithUsername = await User.findOne({username: trimmedUsername}).select("-password")

        if(sameUserWithUsername && sameUserWithUsername._id.toString() !=req.userId){
            return res.status(400).json({message:"userName already exist"})
        }

        if(req.file){
            try {
                console.log("File received:", req.file.path)
                const hasCloudinary = Boolean(
                    process.env.CLOUDINARY_CLOUD_NAME &&
                    process.env.CLOUDINARY_API_KEY &&
                    process.env.CLOUDINARY_API_SECRET
                )

                if (hasCloudinary) {
                    const uploaded = await uploadOnCloudinary(req.file.path)
                    console.log("Upload successful:", uploaded)
                    user.profileImage = uploaded.secure_url
                } else {
                    user.profileImage = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`
                }
            } catch(error) {
                console.error("Image upload error:", error)
                return res.status(500).json({message:`Image upload failed: ${error.message}`})
            }
        }

        user.name = trimmedName
        user.username = trimmedUsername
        user.bio = typeof bio === "string" ? bio.trim() : ""
        user.profession = typeof profession === "string" ? profession.trim() : ""
        user.gender = normalizedGender || undefined

        await user.save()

        return res.status(200).json(user)

    } catch (error) {
        console.error("Edit profile error:", error)
        return res.status(500).json({message:`edit profile error: ${error.message}`})
    }
}


export const getProfile= async(req,res)=>{
    try {
        const username = req.params.username
        const user = await User.findOne({username}).select("-password").populate("followers following posts saved")
        if(!user){
            return res.status(400).json({message:"User Not Found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Error in getting the result ${error.message}`})
    }
}



export const follow = async(req,res)=>{
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.targetUserId
            if(currentUserId._id!=targetUserId._id){
                const notification = await Notification.create({
                    sender:currentUserId._id,
                    receiver:targetUserId._id,
                    type:"follow",
                    message:"Started Following You"
                })
                const populatedNotification = await Notification.findById(notification._id).
                populate("sender receiver loop")
                const receiverSocketId=getSocketId(targetUserId._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }

        if(!targetUserId){
            return res.status(400).json({message:`target user is not found`})
        }

        if(currentUserId==targetUserId){
            return res.status(400).json({message:`You can't follow yourself`})
        }

        const currentUser = await User.findById(currentUserId)
        const targetUser = await User.findById(targetUserId)

        const isFollowing= currentUser.following.includes(targetUserId)

        if(isFollowing){
            currentUser.following= currentUser.following.filter(id=>id.toString()!=targetUserId)
            targetUser.followers= targetUser.followers.filter(id=>id.toString()!=currentUserId)

            await currentUser.save()
            await targetUser.save()

            return res.status(200).json({
                following:false,
                message:"unfollow successfully "
            })
        }else{
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId )
            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following:true,
                message:"follow successfully "
            })
        }

    } catch (error) {
        return res.status(500).json({message:`Error in Follow/Unfollow ${error.message}`})
    }
}


export const followingList = async(req,res)=>{
    try {
        const result = await User.findById(req.userId)
        return res.status(200).json(result?.following)
    } catch (error) {
        return res.status(500).json({message:`Following List error ${error}`})
    }
}


export const search =async(req,res)=>{
    try {
        const keyWord = req.query.keyword
        if(!keyWord){
            return res.status(400).json({message:"keyword is required"})
        }
        const users = await User.find({
            $or:[
                {username:{$regex:keyWord}},
                {name:{$regex:keyWord,$options:"i"}}
            ]
        }).select("-password")

        return res.status(200).json(users)

    } catch (error) {
            return res.status(500).json({message:`Search error ${error}`})
    }
}


export const getAllNotifications=async(req,res)=>{
    try {
        const notifications = await Notification.find({
            receiver:req.userId
        }).populate("sender receiver post loop ")
        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({message:`Search error ${error}`})   
    }
}


export const markAsRead = async(req,res)=>{
    try {
        const {notificationId} = req.body
        const notification=await Notification.findById(notificationId)
        .populate("sender receiver post loop ")
        return res.status(200).json({message:"Marked as read"})
    } catch (error) {
        return res.status(500).json({message:`Read Notification Error ${error}`}) 
    }
}