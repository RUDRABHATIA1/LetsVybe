import React from 'react'
import logo2 from '../assets/logo2.png'
import { Heart } from 'lucide-react';
import dp from '../assets/dp.png'
import { useSelector } from 'react-redux';
import axios from 'axios'
import { setUserData } from '../redux/userSlice';
import { apiConfig } from '../config/apiConfig';
import { useDispatch } from 'react-redux';
import OtherUsers from './OtherUsers';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Notifications from '../pages/Notifications';

const LeftHome = () => {

    const {userData, suggestedUsers} = useSelector(state=>state.user)
    const [showNotifications, setShowNotifications] = useState(false);
    const dispatch = useDispatch()
    const {notificationData}=useSelector(state=>state.user)
    const navigate = useNavigate() 

    const handleLogOut = async()=>{
      try {
        const result = await axios.get(`${apiConfig.API_URL}/api/auth/signout`,{withCredentials:true})
        dispatch(setUserData(null))
      } catch (error) {
          console.log("Error in logout:",error.message)
      }
    }



  return (
    <div className={`w-[25%] hidden lg:block min-h-[100vh] bg-black border-r-2 border-gray-900 ${showNotifications ? "overflow-hidden" : "overflow-auto"} `}>
        <div className='w-full h-[100px] flex items-center justify-between p-[20px ]'>
          <img src={logo2} alt="" className='w-[80px]' />
          <div className='relative z-[100]' onClick={()=>setShowNotifications(prev=>!prev)}>
            <Heart className='text-white w-[25px] h-[25px]'/>
            {notificationData && notificationData.some((noti)=>noti.isRead==false) && <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px] '></div>}
          </div>
        </div>

        {!showNotifications && <>
        <div className='flex items-center w-full gap-[10px] justify-between px-[20px] border-b-2 border-b-gray-900 py-[10px]'>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={userData.profileImage ||  dp} alt="" className='' />
            </div>
            <div>
              <div className='text-[18px] text-white font-semibold '>{userData.username}</div>
              <div className='text-[13px] text-gray-300 font-semibold '>{userData.name}</div>
            </div>
          </div>
          <div className='text-blue-500 font-semibold cursor-pointer' onClick={handleLogOut}>LogOut</div>



        </div>

        <div className='w-full flex flex-col gap-[20px] p-[20px]'>
          <h1 className='text-white text-[19px]'>Suggested Users</h1>
          {
            suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
              <OtherUsers key={index} user={user} />
            ))
          }
        </div>
        </>}


        {showNotifications && <Notifications/>}




    </div>
  )
}

export default LeftHome
