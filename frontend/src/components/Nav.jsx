import React from 'react'
import dp from '../assets/dp.png'
import { House, Search, TvMinimalPlay,CirclePlus, MessageCircleMore  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Nav = () => {
  const navigate = useNavigate()
  const {userData} = useSelector(state=>state.user)
  return (
    <div className='w-[90%] lg:w-[40%]  h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
      <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/')}><House /></div>
      <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/search')}><Search /></div>
      <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/upload')}><CirclePlus  /></div>
      <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/messages')}><MessageCircleMore /></div>
      <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/loops')}><TvMinimalPlay /></div>
      <div className='flex items-center gap-[10px]'>
        <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData?.username}`)}  >
            <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
    </div>
    </div>
  )
}

export default Nav
