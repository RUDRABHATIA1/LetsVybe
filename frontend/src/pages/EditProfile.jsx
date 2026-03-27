import React, { useRef } from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.png'
import { useState } from 'react'
import axios from 'axios'
import { apiConfig } from '../config/apiConfig'
import { setProfileData, setUserData } from '../redux/userSlice'
import { ClipLoader } from 'react-spinners'

const EditProfile = () => {

    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    
    // Redirect if user data is not loaded
    if(!userData) {
        navigate('/')
        return null
    }
    
    const imageInput = useRef()
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
    const [backendImage, setBackendImage] = useState(null);
    const [name, setName] = useState(userData.name || "");
    const [username, setUsername] = useState(userData.username || "");
    const [bio, setBio] = useState(userData.bio || "");
    const [profession, setProfession] = useState(userData.profession || "");
    const [gender, setGender] = useState(userData.gender || "");
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);


    const handleImage=(e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile=async()=>{
        setLoading(true)

        try {
            const formdata = new FormData()
            formdata.append("name",name)
            formdata.append("username",username)
            formdata.append("bio",bio)
            formdata.append("profession",profession)
            formdata.append("gender",gender)
            if(backendImage){
                formdata.append("profileImage",backendImage)
            }

            const result = await axios.put(`${apiConfig.API_URL}/api/user/editprofile`,formdata,{withCredentials:true})

            const updatedUser = result.data 
            
            dispatch(setProfileData(updatedUser))
            dispatch(setUserData(updatedUser))
            setLoading(false)
            setTimeout(() => {
                navigate(`/profile/${updatedUser.username}`)
            }, 100)

        } catch (error) {
            console.log(error)
            setLoading(false)
            alert("Error updating profile: " + (error.response?.data?.message || error.message))
        }
    }

  return (
    <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] '>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>
            <MoveLeft onClick={()=>navigate( `/profile/${userData.username}` )} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer' />
            <h1 className='font-semibold text-[20px] text-white'>Edit Profile</h1>
        </div>
        <div className='w-[70px] h-[70px] md:w-[140px] h-[140px] border-2 border-black overflow-hidden rounded-full cursor-pointer overflow-hidden' onClick={()=>imageInput.current.click()}>
            <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage}/>
            <img src={frontendImage} alt="" className='rounded-full' />
        </div>  

        <div className='text-blue-500 text-center text-[18px] cursor-pointer font-semibold'>Change Your Profile Picture</div>

        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold ' placeholder='Enter Your Name ' onChange={(e)=>setName(e.target.value)} value={name} />
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold ' value={username} placeholder='Enter Your Username ' onChange={(e)=>setUsername(e.target.value)} />
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold ' value={profession} placeholder='Enter Your Profession ' onChange={(e)=>setProfession(e.target.value)} />
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold ' value={bio} placeholder='Bio' onChange={(e)=>setBio(e.target.value)} />
                <select
                    className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold '
                    onChange={(e)=>setGender(e.target.value)}
                    value={gender}
                >
                    <option value="">Select Gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

        <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl ' onClick={handleEditProfile}>
            {loading ? <ClipLoader size={30} color='black' /> : "Save Profile"}
        </button>

    </div>
  )
}

export default EditProfile