import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config()

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to,otp)=>{
    transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"Vybe - Password Reset OTP",
        html:`<p>Your OTP for password reset is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    })
}

export default sendMail 