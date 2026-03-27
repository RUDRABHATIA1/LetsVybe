import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import { setPostData } from '../redux/postSlice'
import axios from 'axios'
import { setLoopData } from '../redux/loopSlice'

const getAllLoops = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    useEffect(()=>{
    if (!userId) return
const fetchloops = async () => {
    try{
        const result = await axios.get(`${apiConfig.API_URL}/api/loop/getAll`,{withCredentials:true})
        dispatch(setLoopData(result.data))
    } catch (error) {
        console.log(error)
    }
    }

    fetchloops()
    },[dispatch, userId])
}

export default getAllLoops  