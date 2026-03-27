import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async(file)=>{
    try {
        if(!file) {
            throw new Error("File path is required")
        }

        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret:process.env.CLOUDINARY_API_SECRET 
        });  

        if(!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary credentials not configured")
        }

        const result = await cloudinary.uploader.upload(file,{
            resource_type:'auto'
        })

        if(fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
        return result
    } catch(error){
        if(fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
        console.log("Cloudinary Error:", error.message)
        throw new Error(`Cloudinary upload failed: ${error.message}`)
    } 
}

export default uploadOnCloudinary

