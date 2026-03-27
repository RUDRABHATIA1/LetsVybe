import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/dp.png'
import { Image } from 'lucide-react';
import { SendHorizontal } from 'lucide-react';
import { useState } from 'react'
import { setMessages } from '../redux/messageSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'

const MessageArea = () => {
  const {selectedUser, messages} = useSelector(state=>state.message)
  const {userData} = useSelector(state=>state.user)
  const {socket} = useSelector(state=>state.socket)
  const dispatch = useDispatch()
  const [input, setInput] = useState("");
  const navigate = useNavigate()
  const imageInput = useRef()
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  

  const handleImage=(e)=>{
      const file =e.target.files[0]
      if(!file) return
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async(e)=>{
    e.preventDefault()  

    try {
        const formData = new FormData()
        formData.append("message",input)
        if(backendImage){
          formData.append("image",backendImage)
        }
        const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})  
        dispatch(setMessages([...messages,result.data]))
        setInput("")
        setBackendImage("")
        setFrontendImage("")
    } catch (error) {
      console.log(error)
    }
  }


  const getAllMessages= async()=>{
      try {
        const result = await axios.get(`${serverUrl}/api/message/getAll/${selectedUser._id}`,{withCredentials:true})
        dispatch(setMessages(result.data))
      } catch (error) {
          console.log(`Get All Messages Error`,error)
      }
  }

  useEffect(()=>{
    if(!selectedUser?._id) return
    getAllMessages()
  },[selectedUser?._id])


  useEffect(()=>{
    if(!socket) return
    socket.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket.off("newMessage")
  },[socket, messages, dispatch])

  if(!selectedUser){
    return <div className='w-full h-screen bg-[#090d12] text-white flex items-center justify-center'>Select a user to start chatting.</div>
  }


  return (
    <div className='w-full h-[100vh] bg-[#090d12] relative'>
      <div className='flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-[#0f1720] border-b border-gray-700 w-full '>
        <div className=' h-[80px] flex items-center gap-[20px] px-[20px] '>
            <MoveLeft onClick={()=>navigate(`/`)} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer' />
        </div>
        <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${selectedUser.username}`)}>
          <img src={selectedUser.profileImage ||  dp} alt="" className='' />
        </div>
        <div className='text-white text-[18px] font-semibold'>        
          <div>{selectedUser.username}</div>
          <div className='text-[14px] text-gray-400'>{selectedUser.name}</div>
        </div>
      </div>


      <div className='w-full h-[80%] pt-[100px] pb-[120px] lg:pb-[150px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-gradient-to-b from-[#0b1219] to-[#0a1016] border-y border-gray-800'>
        {messages && messages.map((mess,index)=>{
          const senderId = typeof mess?.sender === 'object' ? mess?.sender?._id : mess?.sender
          const isMyMessage = String(senderId) === String(userData?._id)
          return isMyMessage
            ? <SenderMessage key={mess._id || index} message={mess} />
            : <ReceiverMessage key={mess._id || index} message={mess}/>
        })}
      </div>


<div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-[#0f1720] border-t border-gray-700 z-[100]'>
    <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#17212b] border border-gray-600 flex items-center gap-[10px] px-[20px]' onSubmit={handleSendMessage}>
      {frontendImage && <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
        <img src={frontendImage} alt="" className='h-full object-cover ' />
      </div>}
      
      <input type="file" accept='image/*' hidden ref={imageInput} onChange={handleImage} />
      <input type="text" placeholder='Type a message' className='w-full h-full px-[20px] text-[18px] text-white outline-0 bg-transparent' onChange={(e)=>setInput(e.target.value)} value={input} />
      <div onClick={()=>imageInput.current.click()}><Image className='w-[28px] h-[28px] text-white' /></div>
      {(input || frontendImage) && <button className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center'><SendHorizontal className='w-[25px] h-[25px] text-white  cursor-pointer ' /></button>}
      
    </form>
</div>




    </div>
  )
}

export default MessageArea
