import uploadOnCloudinary from "../config/cloudinary.js"
import Story from "../models/story.model.js"
import User from "../models/user.model.js"

export const uploadStory=async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        if(user.story){
            await Story.findByIdAndDelete(user.story)
            user.story=null
        }

        const {mediaType} = req.body

        let media;
        if(req.file){
            const cloudinaryResult = await uploadOnCloudinary(req.file.path)
            media = cloudinaryResult.secure_url
        }else{
            return res.status(400).json({message:`media is required`})
        }
        const story = await Story.create({
            author:req.userId,mediaType,media
        })
        user.story=story._id
        await user.save()
        const populatedStory= await Story.findById(story._id).populate("author","name username profileImage")
        .populate("viewers","name username profileImage")
        return res.status(200).json(populatedStory)
    } catch (error) {
        console.log("Upload Story Error:", error)
        return res.status(500).json({message:`story upload error: ${error.message}`})
    }
}

export const viewStory = async(req,res)=>{
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)

        if(!storyId){
            return res.status(400).json({message:"Story Not Found"})
        }

        const viewersIds = story.viewers.map(id=>id.toString())
        if(!viewersIds.includes(req.userId.toString())){
            story.viewers.push(req.userId)
            await story.save()
        }

        const populatedStory= await Story.findById(story._id).populate("author","name username profileImage")
        .populate("viewers","name username profileImage")

        return res.status(200).json(populatedStory)


    } catch (error) {
        return res.status(500).json({message:`story upload error ${error}`})
    }
}

export const getStoryByUsername = async (req,res)=>{
    try {
        const username = req.params.username 
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({message:`User Not Found`})
        }
        const story = await Story.find({
            author:user._id
        }).populate("viewers author")

        return res.status(200).json(story)

    } catch (error) {
        return res.status(500).json({message:`story fetch based on username, error ${error}`})
    }
}


export const getAllStories = async (req,res)=>{
    try {
        const currentUser = await User.findById(req.userId)
        console.log("CurrentUser",req.userId)
        const followingIds = [...new Set([...(currentUser.following || []).map(id => id.toString()), req.userId.toString()])]
        const stories = await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author ").sort({createdAt:-1})

        return res.status(200).json(stories)

    } catch (error) {
        return res.status(500).json({message:`Get all Stories , error ${error}`})
    }
}