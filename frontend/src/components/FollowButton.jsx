import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import { axiosInstance } from '../config/apiConfig'
import { toggleFollow } from '../redux/userSlice'

const FollowButton = ({targetUserId,tailwind}) => {
  const {following} = useSelector(state=>state.user)
  const normalizedTargetUserId = String(targetUserId)
  const isFollowing = following.some((id) => String(id) === normalizedTargetUserId)
  const dispatch = useDispatch()
  const handleFollow= async()=>{
    try {
      await axiosInstance.get(`/api/user/follow/${normalizedTargetUserId}`,{withCredentials:true})
      dispatch(toggleFollow(normalizedTargetUserId))
    } catch (error) {
        console.log(`Handle Follow Error ${error} `)
    }
  }

  return (
    <button type='button' className={tailwind} onClick={handleFollow} >
      {isFollowing? "Following" : "Follow"}
    </button>
  )
}

export default FollowButton
