import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance as axios } from '../config/apiConfig'
import { setPostData } from '../redux/postSlice'

const getAllPosts = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    useEffect(()=>{
    if (!userId) return
const fetchPost = async () => {
    try{
        const result = await axios.get(`/api/post/getAll`,{withCredentials:true})
        dispatch(setPostData(result.data))
    } catch (error) {
        console.log(error)
    }
    }

    fetchPost()
    },[dispatch, userId])
}

export default getAllPosts  