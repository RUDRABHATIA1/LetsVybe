import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import axios from 'axios'
import { setPrevChatUsers } from '../redux/messageSlice'

const getPrevChatUsers = () => {
    const dispatch = useDispatch()
    const {messages} = useSelector(state=>state.message)
    const userId = useSelector(state => state.user.userData?._id)
    useEffect(()=>{
    if (!userId) return
const fetchUser = async () => {
    try{
        const result = await axios.get(`${apiConfig.API_URL}/api/message/prevChats`,{withCredentials:true})
        dispatch(setPrevChatUsers(result.data))
        console.log(result.data)
    } catch (error) {
        console.log(error)
    }
    }

    fetchUser()
    },[dispatch, messages, userId])
}

export default getPrevChatUsers

