import React from 'react'
import dp from '../assets/dp.png'
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConfig } from '../config/apiConfig';
import axios from 'axios';

const StoryDP = ({profileImage, username, story}) => {

  const navigate = useNavigate()
  const {userData} = useSelector(state=>state.user)



  const handleViewers = async()=>{
    const storyId = typeof story === 'string' ? story : story?._id
    if (!storyId) return
    try {
      await axiosInstance.get(`/api/story/view/${storyId}`,{withCredentials:true})
    } catch (error) {
        console.log("Error in Handle Viewers ",error.message)
    }
  }


  const handleClick=()=>{
    if(!story && username === "Your Story"){
      navigate('/upload')
    }else if(story && username === "Your Story"){
      handleViewers()
      navigate(`/story/${userData.username}`)
    } else{
      handleViewers()
      navigate(`/story/${username}`)
    }
  }

  return (
    <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] ${story ? "bg-gradient-to-b from-blue-500 to-blue-950" : null}  rounded-full flex justify-center items-center relative`} onClick={handleClick}>
          <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
              <img src={ profileImage || dp} alt="" className='' />             
          </div>
          {!story && <CirclePlus fill='white' stroke='black' className=' bottom-0 absolute right-0 cursor-pointer' onClick={()=>navigate('/upload')} />}
          
      </div>
      <div className='text-[14px] text-center truncate w-full text-white'>{username}</div>
    </div>
  )
}

export default StoryDP 
