import React from 'react'
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'
import { useState } from 'react'
import { Eye, Flag } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import axios from 'axios'
import { apiConfig } from '../config/apiConfig';
import { axiosInstance } from '../config/apiConfig';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const SignIn = () => {

  const [inputClicked, setInputClicked] = useState({
    name: false,
    email: false, 
    password: false,
    username: false
  })

  const [showPassword, setShowPassword] = useState(false);


  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [err, setErr] = useState("");
  const dispatch = useDispatch()
  const handleSignIn = async () =>{
    setLoading(true);
    setErr("")
    try {
      console.log("Sign In button clicked ")
      const normalizedIdentifier = identifier.trim()
      if (!normalizedIdentifier || !password) {
        setErr("Username/email and password are required")
        setLoading(false)
        return
      }
      const payload = {
        password,
        username: normalizedIdentifier,
        email: normalizedIdentifier
      }
      const result = await axiosInstance.post(`/api/auth/signin`,{
        ...payload },{withCredentials:true})
      
      // Store token in localStorage for Authorization header
      if (result.data.token) {
        localStorage.setItem('auth_token', result.data.token)
      }
      
      dispatch(setUserData(result.data))  
      setLoading(false)
    } catch (error) {
      console.log("Error while signin",error.response ?.data || error)
      setLoading(false)
      setErr(error?.response?.data?.message || "Unable to sign in")  
    }
  }



  return (
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px] justify-center'>
            <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                <span>Sign In to </span>
                <img src={logo} alt="" className='w-[70px]' />
            </div>

            <div className='relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black' onClick={()=>setInputClicked({...inputClicked,username:true})}>
                  <label htmlFor="username" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.username ? "top-[-15px]" : " "}`}>Enter Username or Email </label>
                    <input type="text" id='username' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
            </div>

            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black' onClick={()=>setInputClicked({...inputClicked,password:true})}>
                  <label htmlFor="password" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? "top-[-15px]" : " "}`}>Enter Password </label>
                    <input type={showPassword ? "text": "password"} id='password' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' value={password} onChange={(e)=>setPassword(e.target.value)} />
                    {
                      showPassword ?  
                      <Eye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={()=>setShowPassword(false)} />
                      :
                      <EyeOff className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={()=>setShowPassword(true)} />
                    }                    
            </div>



            
            <div className='w-[90%] cursor-pointer' onClick={()=>navigate('/forgotpassword')} >Forgot Password</div> 

              {
                err && <p className='text-red-500'>{err}</p>
              }


            <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleSignIn} disabled={loading}>{
              loading ? <ClipLoader size={30} color='white' /> : `Login`
              }</button>

            <p onClick={()=>navigate('/signup')} className='cursor-pointer text-gray-800'>Don't have an Account ? <span className='border-b-2 border-b-black pb-[3px] text-black'>Sign Up</span></p>

        </div>

 

        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-   [10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>                
                <img src={logo2} alt="" className='w-[60%]' />
                <p className='text-white'>Not just a platform , its a VYBE</p>
        </div>  
      </div>
    </div>
  )
}

export default SignIn
