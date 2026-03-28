import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { Volume2, Heart, MessageCircle, SendHorizontal } from 'lucide-react';
import { VolumeOff } from 'lucide-react';
import dp from '../assets/dp.png'
import FollowButton from './FollowButton';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig';
import { axiosInstance } from '../config/apiConfig';
import { useDispatch } from 'react-redux';
import { setLoopData } from '../redux/loopSlice';

const LoopCard = ({ loop }) => {

  if (!loop) return null

  const likes = Array.isArray(loop.likes) ? loop.likes : []
  const comments = Array.isArray(loop.comments) ? loop.comments : []
  const author = loop.author || null

  const [isPlaying, setIsPlaying] = useState(true);
  const [ismute, setIsmute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const { userData } = useSelector(state => state.user)
  const { loopData } = useSelector(state => state.loop)
  const {socket} = useSelector(state=>state.socket)
  const isLikedByMe = likes.some((id) => String(id) === String(userData?._id))

  let dispatch = useDispatch()
  const commentRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false)
      }
    }

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [showComment])

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 4000)
    if (!isLikedByMe) {
      handleLike()
    }
  }

  const handleLike = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    try {
      const result = await axiosInstance.post(`/api/loop/like/${loop._id}`, {}, { withCredentials: true })
      const updatedLoop = result.data
      // Update the postData array with the updated post
      const updatedLoops = loopData.map(p => p._id === loop._id ? updatedLoop : p)
      dispatch(setLoopData(updatedLoops))
      console.log('Loop liked successfully')
    } catch (error) {
      console.log('Error liking loop:', error)
    }
    return false
  }
  

  const handleComment = async (e) => {
    
    e.preventDefault()
    e.stopPropagation()
    try {
      const result = await axiosInstance.post(`/api/loop/comment/${loop._id}`, { message }, { withCredentials: true })
      const updatedLoop = result.data
      // Update the postData array with the updated post
      const updatedLoops = loopData.map(p => p._id === loop._id ? updatedLoop : p)
      dispatch(setLoopData(updatedLoops))
      console.log('Loop liked successfully')
      setMessage("")
    } catch (error) {
      console.log('Error liking loop:', error)
    }
    return false
  }



  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const videoRef = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (entry.isIntersecting) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }, { threshold: 0.6 })
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])


  useEffect(() => {
    socket?.on("likedLoop", (updatedData) => {
      const updatedLoops = loopData.map(p => p._id == updatedData.postId ? { ...p, likes: updatedData.likes } : p)
      dispatch(setLoopData(updatedLoops))
    })

    socket?.on("commentedLoop", (updatedData) => {
      const updatedLoops = loopData.map(p => p._id == updatedData.postId ? { ...p, comments: updatedData.comments } : p)
      dispatch(setLoopData(updatedLoops))
    })

    return () => {
      socket?.off("likedLoop")
      socket?.off("commentedLoop")
    }
  }, [socket, loopData, dispatch])


  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden '>

      {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
        <Heart fill='white' stroke='white' className='w-[100px] h-[100px] drop-shadow-2xl' />
      </div>}

      <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] transition-transform duration-500 rounded-t-4xl shadow-2xl shadow-black bg-[#0e1718] left-0 ${showComment ? "translate-y-0 pointer-events-auto" : "translate-y-[100%] pointer-events-none"}`}>
        <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

        <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

          {comments.length == 0 && <div className='text-center text-white text-[20px] font-semibold mt-[50px]'>No Comments Yet</div>}

          {comments.map((com, index) => (
            <div key={com?._id || index} className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-start pb-[10px]'>
              <div className='flex items-center gap-[15px]'>
                <div className='w-[45px] h-[45px] md:w-[45px] md:h-[45px] border-2 border-black rounded-full overflow-hidden'>
                  <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover'/>
                </div>
                <div className='max-w-[120px] font-bold truncate text-white'>
                  {com.author?.username || 'Unknown User'}
                </div>
              </div>
                <div className='text-white '>
                  {com.message}
                </div>
            </div>
          ))}
        </div>

        <div className='w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] '>
          <div className='w-[45px] h-[45px] md:w-[55px] md:h-[55px] border-2 border-black rounded-full overflow-hidden'>
            <img src={author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>
          <input type="text" className='px-[10px] ml-[10px] border-b-2 text-white placeholder:text-white border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Write Comment....' onChange={(e) => setMessage(e.target.value)} value={message} />
          {message && <button className='absolute right-[20px] cursor-pointer ' onClick={handleComment} ><SendHorizontal stroke='white' className='w-[25px] h-[25px]' /></button>}
          
        </div>

      </div>

      <video ref={videoRef} autoPlay loop muted src={loop?.media} className='w-full max-h-[100vh]' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick} />

      <div className='absolute top-[20px] right-[20px] z-[100]' onClick={() => setIsmute(!ismute)}>
        {!ismute ? <Volume2 className='w-[20px] h-[20px] text-white font-semibold' /> : <VolumeOff className='w-[20px] h-[20px] text-white font-semibold' />}
      </div>

      <div className='absolute top-[20px] left-[20px] right-[70px] z-[100] max-w-[300px]'>
        <div className='text-white text-[18px] break-words whitespace-normal font-semibold'>
          {loop.caption}
        </div>
      </div>

      <div className='absolute bottom-0  w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>
        </div>
      </div>

      <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col '>
        <div className='flex items-center gap-[15px]'>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full overflow-hidden'>
            <img
              src={author?.profileImage || dp}
              alt=""
              className='w-full h-full object-cover'
            />
          </div>
          <div className='max-w-[120px] font-semibold truncate text-white '>
            {author?.username || 'Unknown User'}
          </div>
          {author?._id && <FollowButton targetUserId={author._id} tailwind={"px-[10px] py-[5px] text-[14px] rounded-2xl text-white border-2 border-white "} />}
        </div>

        <div className='absolute right-5 z-[210] flex  flex-col gap-[30px] text-white bottom-[200px] justify-center px-[10px]'>
          <div className='flex flex-col items-center cursor-pointer  '>
            <div onClick={handleLike}>
              {!isLikedByMe && <button type="button" className='bg-none border-none p-0 cursor-pointer'><Heart className='w-[25px] h-[25px]' /></button>}
              {isLikedByMe && <button type="button" className='bg-none border-none p-0 cursor-pointer'><Heart fill='red' stroke='red' className='w-[25px] h-[25px]' /></button>}
            </div>
            <div>{likes.length}</div>
          </div>

          <div className='flex flex-col items-center cursor-pointer' onClick={() => setShowComment(true)}>
            <div >
              <MessageCircle className='w-[25px] cursor-pointer h-[25px]' />
            </div>
            <div>{comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default LoopCard
