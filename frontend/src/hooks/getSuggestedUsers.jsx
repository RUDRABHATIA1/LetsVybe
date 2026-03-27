import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import { setSuggestedUsers } from '../redux/userSlice'

const getSuggestedUsers = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    useEffect(()=>{
    if (!userId) return
const fetchUser = async () => {
    try{
        const result = await axios.get(`${serverUrl}/api/user/suggested`,{withCredentials:true})
        dispatch(setSuggestedUsers(result.data))
    } catch (error) {
        console.log(error)
    }
    }

    fetchUser()
    },[dispatch, userId])
}

export default getSuggestedUsers
