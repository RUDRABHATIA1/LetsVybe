import React from 'react'
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'
import { useState } from 'react'
import { Eye, Flag } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import axios from 'axios'
import { apiConfig } from '../config/apiConfig';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const SignUp = () => {

  const [inputClicked, setInputClicked] = useState({
    name: false,
    email: false, 
    password: false,
    username: false
  })

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [err, setErr] = useState("");
  const dispatch = useDispatch();

  const handleSignUp = async () =>{
    setLoading(true);
    setErr("")
    try {
      console.log("Sign Up button clicked ")
      const result = await axios.post(`${apiConfig.API_URL}/api/auth/signup`,{
        name , email, password, username },{withCredentials:true})
        dispatch(setUserData(result.data))
        setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong")
      console.log("Error while signup",error.response ?.data || error)
      setLoading(false)
    }
  }



  return (
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]'>
            <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                <span>Sign Up to </span>
                <img src={logo} alt="" className='w-[70px]' />
            </div>

            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={()=>setInputClicked({...inputClicked,name:true})}>
                  <label htmlFor="name" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.name ? "top-[-15px]" : " "}`}>Enter Your Name </label>
                    <input type="text" id='name' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' value={name} onChange={(e)=>setName(e.target.value)} />
            </div>

            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black' onClick={()=>setInputClicked({...inputClicked,username:true})}>
                  <label htmlFor="username" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.username ? "top-[-15px]" : " "}`}>Enter Username </label>
                    <input type="text" id='username' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' value={username} onChange={(e)=>setUsername(e.target.value)} />
            </div>

            <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black' onClick={()=>setInputClicked({...inputClicked,email:true})}>
                  <label htmlFor="email" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px]" : " "}`}>Enter Email </label>
                    <input type="email" id='email' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' value={email} onChange={(e)=>setEmail(e.target.value)} />
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

                    {
                      err && <p className='text-red-500'>{err}</p>
                    }



            <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleSignUp} disabled={loading}>{
              loading ? <ClipLoader size={30} color='white' /> : `Sign Up`
              }</button>

            <p onClick={()=>navigate('/signin')} className='cursor-pointer text-gray-800'>Aleady have an account ? <span className='border-b-2 border-b-black pb-[3px] text-black'>Sign In</span></p>

        </div>



        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-   [10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>                
                <img src={logo2} alt="" className='w-[60%]' />
                <p className='text-white'>Not just a platform , its a VYBE</p>
        </div>  
      </div>
    </div>
  )
}

export default SignUp
