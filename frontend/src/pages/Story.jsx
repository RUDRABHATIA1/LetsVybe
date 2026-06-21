import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiConfig } from '../config/apiConfig'
import { axiosInstance } from '../config/apiConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../redux/storySlice'
import StoryCard from '../components/StoryCard'
import LimitReachedUI from '../components/LimitReachedUI'

const Story = () => {
    const {username} = useParams()
    const dispatch = useDispatch()
    const {storyData} = useSelector(state=>state.story) 
    const {consumptionData} = useSelector(state=>state.user)
    const handleStory = async()=>{
      dispatch(setStoryData(null))
        try {
            const result = await axiosInstance.get(`/api/story/getByUsername/${username}`,{withCredentials:true})
            dispatch(setStoryData(result.data[0]))
        } catch (error) {
            console.log("Error in story",error)
        }
    }

    useEffect(()=>{
      if(username){
        handleStory()
      }
      
    },[username])
  
  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
        {consumptionData?.isLimitReached ? (
            <LimitReachedUI />
        ) : storyData ? (
          <StoryCard storyData={storyData} />
        ) : (
          <div className='text-white text-lg'>No story available</div>
        )}
        
    </div>
  )
} 

export default Story
