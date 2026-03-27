import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveLeft } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import NotificaitonCard from '../components/NotificaitonCard'
import axios from 'axios'
import { serverUrl } from '../App'

const Notifications = () => {
    const navigate = useNavigate()
    const {notificationData} = useSelector(state=>state.user)
    const ids= notificationData.map((n)=>n._id)
    const dispatch = useDispatch()
    const markAsRead = async()=>{
        try {
            const result = await axios.post(`${serverUrl}/api/user/markAsRead`,{notificationId:ids},{withCredentials:true})
            await fetchNotifications()
        } catch (error) {
            console.log(`There is Error in the Mark As Read Function in the Notification.jsx `,error)
        }
    }
    const fetchNotifications = async () => {
        try{
            const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`,{withCredentials:true})
            dispatch(setNotificationData(result.data))

        } catch (error) {
            console.log(error)
        }
    }
    

    useEffect(()=>{
        markAsRead()
        fetchNotifications()
    },[])

  return (
    <div className='w-full h-[100vh] bg-black'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
            <MoveLeft onClick={()=>navigate(`/`)} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer' />
            <h1 className='font-semibold text-[20px] text-white'>Notifications</h1>
        </div>


        <div className='w-full flex flex-col gap-[20px] h-[100%] overflow-auto'>
            {notificationData?.map((noti,index)=>(
                <NotificaitonCard noti={noti} key={index} />
            ))}
        </div>

    </div>
  )
}

export default Notifications
