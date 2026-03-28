import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/Mail.js"

export const signUp = async (req, res) => {
    // Sign up logic here
    try {
        const {name,email,password,username} = req.body

        const findByEmail = await User.findOne({email: new RegExp(`^${email}$`, 'i')})
        if(findByEmail){
            return res.status(400).json({message:"Email already registered"})
        }

        const findByUsername = await User.findOne({username: new RegExp(`^${username}$`, 'i')})
        if(findByUsername){
            return res.status(400).json({message:"Username already exists"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        } 

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email,
            username,
            password:hashedPassword
        })

        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000, // 10 years 
            secure:true,
            sameSite:"None"
        })

        const userData = user.toObject()
        userData.token = token
        return res.status(201).json(userData)


    } catch (error) {
        return res.status(500).json({message:`Sign Up Error: ${error.message}`})
    }
}

export const signIn = async (req, res) => {
    // Sign in logic here
    try {
        const {password, username, email} = req.body

        if (!password || (!username && !email)) {
            return res.status(400).json({message:"Username/email and password are required"})
        }

        // Build query with case-insensitive search
        const query = { $or: [] }
        if (username && username.trim()) {
            query.$or.push({ username: new RegExp(`^${username}$`, 'i') })
        }
        if (email && email.trim()) {
            query.$or.push({ email: new RegExp(`^${email}$`, 'i') })
        }

        // Check if query has any conditions
        if (query.$or.length === 0) {
            return res.status(400).json({message:"Username/email and password are required"})
        }

        const user = await User.findOne(query)
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"})
        }

        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000, // 10 years 
            secure:true,
            sameSite:"None"
        })

        const userData = user.toObject()
        userData.token = token
        return res.status(200).json(userData)


    } catch (error) {
        return res.status(500).json({message:`Sign In this is really giving the error Error: ${error.message}`})
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Signed Out Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Sign Out Error: ${error.message}`})   
    }
}



export const sendOtp = async(req,res)=>{
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User with this email does not exist"})
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp,
        user.otpExpires = Date.now() + 10*60*1000 // 10 minutes
        user.isOtpVerified=false

        await user.save()
        await sendMail(email,otp)
        return res.status(200).json({message:"OTP sent to email"})

    } catch (error) {
        return res.status(500).json({message:`Sending Otp Error :${error.message}`})
    }
}


export const verifyOtp = async(req,res)=>{
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})

        if(!user || user.resetOtp !==otp || user.otpExpires < Date.now() ){
            return res.status(400).json({message:"Invalid or expired OTP"})
        }

        user.isOtpVerified = true
        user.resetOtp = undefined 
        user.otpExpires = undefined

        await user.save()

        return res.status(200).json({message:"OTP verified successfully"})

    } catch (error) {
        return res.status(500).json({message:`Verifying OTP Error: ${error.message}`})
    }
}


export const resetPassword = async(req,res)=>{
    try {
        const {email,password} = req.body 

        const user = await User.findOne({email})

        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"OTP Verification Required"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        user.password = hashedPassword
        user.isOtpVerified = false

        await user.save()

        return res.status(200).json({message:"Password reset successfully"})

    } catch (error) {
        
    }

}