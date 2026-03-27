import React from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'

const OtherUsers = ({user}) => {
    const navigate = useNavigate()
    const userData = useSelector(state=>state.user)
  return (
    <div className='w-full h-[50px]  flex items-center justify-between border-b-2 border-gray-800'>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${user.username}`)}>
                <img src={user.profileImage ||  dp} alt="" className='' />
            </div>
            <div>
              <div className='text-[18px] text-white font-semibold '>{user.username}</div>
              <div className='text-[13px] text-gray-300 font-semibold '>{user.name}</div>
            </div>
          </div>
          
          <FollowButton tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl cursor-pointer'} targetUserId={user._id} />
          
            Follow
          


    </div>
  )
}

export default OtherUsers