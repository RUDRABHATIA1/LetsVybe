import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import { axiosInstance } from '../config/apiConfig'
import { toggleFollow } from '../redux/userSlice'

const FollowButton = ({targetUserId,tailwind}) => {
  const {following} = useSelector(state=>state.user)
  const isFollowing = following.includes(targetUserId)
  const dispatch = useDispatch()
  const handleFollow= async()=>{
    try {
      const result = await axiosInstance.get(`/api/user/follow/${targetUserId}`,{withCredentials:true})
      dispatch(toggleFollow(targetUserId))
    } catch (error) {
        console.log(`Handle Follow Error ${error} `)
    }
  }

  return (
    <button className={tailwind} onClick={handleFollow} >
      {isFollowing? "Following" : "Follow"}
    </button>
  )
}

export default FollowButton
