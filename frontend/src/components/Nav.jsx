import React from 'react'
import dp from '../assets/dp.png'
import { House, Search, TvMinimalPlay,CirclePlus, MessageCircleMore  } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavItem = ({ icon: Icon, onClick, isActive }) => (
  <div 
    onClick={onClick} 
    className={`cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center p-3 rounded-full hover:bg-white/10 ${isActive ? 'text-blue-500 transform scale-110' : 'text-gray-400 hover:text-white hover:scale-105'}`}
  >
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
  </div>
);

const Nav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {userData, consumptionData} = useSelector(state=>state.user)
  
  const handleProfileClick = () => {
    if (consumptionData?.isLimitReached) return;
    navigate(`/profile/${userData?.username}`);
  };
  
  return (
    <div className='w-[90%] lg:w-[40%] h-[80px] flex justify-around items-center fixed bottom-[20px] rounded-full z-[100] border border-gray-800' style={{ background: 'rgba(15, 15, 20, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 10px 40px 0 rgba(0, 0, 0, 0.5)' }}>
      <NavItem icon={House} onClick={()=>navigate('/')} isActive={location.pathname === '/'} />
      <NavItem icon={Search} onClick={()=>navigate('/search')} isActive={location.pathname === '/search'} />
      <NavItem icon={CirclePlus} onClick={()=>navigate('/upload')} isActive={location.pathname === '/upload'} />
      <NavItem icon={MessageCircleMore} onClick={()=>navigate('/messages')} isActive={location.pathname.startsWith('/messages') || location.pathname.startsWith('/messageArea')} />
      <NavItem icon={TvMinimalPlay} onClick={()=>navigate('/loops')} isActive={location.pathname === '/loops'} />
      <div className='flex items-center gap-[10px]'>
        <div 
          className={`w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${location.pathname.startsWith('/profile') ? 'border-[3px] border-blue-500 scale-110' : 'border-2 border-transparent hover:border-gray-500 hover:scale-105'} ${consumptionData?.isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={handleProfileClick}  
        >
            <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
    </div>
    </div>
  )
}

export default Nav
