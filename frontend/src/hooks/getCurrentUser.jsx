import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { setCurrentUserStory } from '../redux/storySlice'

const getCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
const fetchUser = async () => {
    try{
        const result = await axios.get(`${apiConfig.API_URL}/api/user/current`,{withCredentials:true})
        dispatch(setUserData(result.data))
        dispatch(setCurrentUserStory(result.data.story))
    } catch (error) {
        // No active session on signin/signup pages is an expected case.
    }
    }

    fetchUser()
    },[dispatch])
}

export default getCurrentUser

