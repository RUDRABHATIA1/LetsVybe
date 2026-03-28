import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance as axios } from '../config/apiConfig'
import { setStoryList } from '../redux/storySlice'

const useGetAllStories = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData)
    const userId = useSelector(state => state.user.userData?._id)

    useEffect(()=>{

        if (!userData) return 

        const fetchStories = async () => {
            try{
                const result = await axios.get(`/api/story/getAll`,{withCredentials:true})
                dispatch(setStoryList(result.data))
            } catch (error) {
                console.log(`This is the error in the getAllStories.jsx` ,error.message)
            }
        }

    fetchStories()
    },[dispatch, userData, userId])
}

export default useGetAllStories