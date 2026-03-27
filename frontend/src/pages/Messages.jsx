import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import OnlineUser from '../components/OnlineUser'
import { setSelectedUser } from '../redux/messageSlice'
import dp from '../assets/dp.png'

const Messages = () => {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { onlineUsers } = useSelector(state => state.socket)
    const { prevChatUsers } = useSelector(state => state.message)
    const dispatch = useDispatch()

    return (
        <div className='w-full min-h-[100vh] flex flex-col bg-[#0f1720] gap-[20px] p-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>
                <MoveLeft onClick={() => navigate(`/`)} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] lg:hidden cursor-pointer' />
                <h1 className='font-semibold text-[20px] text-white'>Messages</h1>
            </div>


            <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-700 bg-[#121c27] rounded-xl '>
                {userData.following?.map((user, index) => (
                    onlineUsers?.includes(user._id) && <OnlineUser key={user._id || index} user={user} />
                ))}
            </div>

            <div className='w-full h-full overflow-auto flex flex-col gap-[20px] bg-[#121c27] rounded-xl p-[12px] border border-gray-700'>
                {(prevChatUsers || []).map((user, index) => (
                <div key={user._id || index} className='text-white cursor-pointer w-full flex items-center gap-[10px]' onClick={() => {
                    dispatch(setSelectedUser(user))
                    navigate("/messageArea")
                }}>

                    {onlineUsers?.includes(user._id) ? <OnlineUser user={user} /> : <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' >
                        <img src={user.profileImage || dp} alt="" className='' />
                    </div>
                     }<div className='flex flex-col'>
                        <div className='text-white text-[18px] font-semibold '>{user?.username}</div>
                        {onlineUsers?.includes(user._id) && <div className='text-blue-500 text-[15px] '>Active Now </div>}
                    </div>
                </div>
                    ))}
                {(prevChatUsers || []).length === 0 && (
                    <p className='text-gray-400'>No chats yet.</p>
                )}
                    
            </div>


        </div>
    )
}

export default Messages
