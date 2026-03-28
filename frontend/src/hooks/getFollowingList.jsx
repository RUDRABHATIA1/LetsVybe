import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance as axios } from '../config/apiConfig'
import { setFollowing } from '../redux/userSlice'

const getFollowingList = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    useEffect(()=>{
    if (!userId) return
const fetchUser = async () => {
    try{
        const result = await axios.get(`/api/user/followingList`,{withCredentials:true})
        dispatch(setFollowing(result.data))
    } catch (error) {
        console.log(error)
    }
    }

    fetchUser()
    },[dispatch, userId])
}

export default getFollowingList

