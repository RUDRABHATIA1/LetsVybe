import React, { useEffect } from 'react'
import dp from '../assets/dp.png'
import VideoPlayer from './VideoPlayer'
import { Heart, MessageCircle, Bookmark, SendHorizontal } from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react';
import axios from 'axios'
import { apiConfig } from '../config/apiConfig'
import { axiosInstance } from '../config/apiConfig'
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';  
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';


const Post = ({ post }) => {
  const {userData} = useSelector(state=>state.user)
  const {postData} = useSelector(state=>state.post)
  const {socket} = useSelector(state=>state.socket)
  const [showComment, setShowComment] = useState(false);
  const dispatch = useDispatch()
  const [message, setMessage] = useState("");

  const navigate = useNavigate()
  const isLikedByMe = post?.likes?.some((id) => String(id) === String(userData?._id))

  // Guard against invalid post data
  if (!post || !post.author) {
    return null
  }

  useEffect(() => {
    console.log('Post component mounted with post:', post)
  }, [post])

  const handleLike = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    try {
      const result = await axiosInstance.post(`/api/post/like/${post._id}`, {}, {withCredentials:true})
      const updatedPost = result.data 
      // Update the postData array with the updated post
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
      console.log('Post liked successfully')
    } catch (error) {
      console.log('Error liking post:', error)
    }
    return false
  }


  const handleComment = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    if(!message.trim()){
      alert('Please write a comment')
      return
    }
    try {
      const result = await axiosInstance.post(`/api/post/comment/${post._id}`,{message},{withCredentials:true})
      const updatedPost = result.data 
      // Update the postData array with the updated post
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
      setMessage('')
      console.log('Comment posted successfully')
    } catch (error) {
      console.log('Error posting comment:', error)
    }
    return false
  }


  const handleSaved = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    try {
      const result = await axiosInstance.get(`/api/post/saved/${post._id}`,{withCredentials:true})
      // Toggle the saved status in userData
      const isSaved = userData?.saved?.some(p => p?._id === post._id || p === post._id)
      const updatedUserData = {
        ...userData,
        saved: isSaved 
          ? userData.saved.filter(p => p?._id !== post._id && p !== post._id)
          : [...userData.saved, post._id]
      }
      dispatch(setUserData(updatedUserData))
      console.log('Post saved/unsaved successfully')
    } catch (error) {
      console.log('Error saving post:', error)
    }
    return false
  }
  
  useEffect(()=>{
    socket?.on("likedPost",(updatedData)=>{
      const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,likes:updatedData.likes}:p)
      dispatch(setPostData(updatedPosts))
    })
    socket?.on("commentedPost",(updatedData)=>{
      const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,comments:updatedData.comments}:p)
      dispatch(setPostData(updatedPosts))
    })

    return ()=>{
      socket?.off("likedPost")
      socket?.off("commentedPost")
    }
  },[socket,postData,dispatch])

  return (
    <div className='w-[90%] max-w-[700px] flex flex-col gap-[10px] bg-[#161921] text-white border border-gray-800 items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden transition-all duration-300' onClick={e => e.stopPropagation()}>

      <div className='w-full h-[70px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex items-center gap-[15px] cursor-pointer hover:opacity-80 transition-opacity' onClick={()=>navigate(`/profile/${post.author?.username}`)}>
          <div className='w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden ring-2 ring-gray-700'>
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className='w-full h-full object-cover'
            />
          </div>
          <div className='max-w-[120px] font-bold text-[17px] tracking-wide truncate'>
            {post.author.username}
          </div>
        </div>
          {userData && userData._id !== post.author?._id && <FollowButton targetUserId={post.author._id} tailwind={'px-[18px] py-[6px] bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[14px] md:text-[15px] font-semibold cursor-pointer transition-colors shadow-lg'} />}  
      </div>

      {userData && post.caption && <div className='w-full px-[20px] pb-[10px] flex flex-col gap-[5px]'>
        <div className='text-[16px] break-words whitespace-normal text-gray-300 leading-relaxed'>{post.caption}</div>
      </div> }

      <div className='w-full max-h-[600px] flex items-center justify-center bg-black'>
        {post.mediaType === 'image' && (
          <img
            src={post.media}
            alt=""
            className='max-h-[500px] w-full object-cover'
          />
        )}
        {post.mediaType === 'video' && (
          <div className='w-full flex items-center justify-center'>
            <div className='w-full max-h-[600px] overflow-hidden bg-black'>
              <VideoPlayer media={post.media} />
            </div>
          </div>
        )}
      </div>


      <div className='w-full h-[60px] flex justify-between items-center px-[20px] py-[10px]'>
        <div className='flex justify-center items-center gap-[20px]'>
            <div className='flex justify-center items-center gap-[8px]'>
              {userData && !isLikedByMe && <button type="button" onClick={handleLike} className='bg-none border-none p-0 cursor-pointer hover:scale-110 transition-transform'><Heart className='w-[26px] h-[26px] text-white hover:text-red-400 transition-colors' /></button>}
              {userData && isLikedByMe && <button type="button" onClick={handleLike} className='bg-none border-none p-0 cursor-pointer hover:scale-110 transition-transform'><Heart fill='#ef4444' stroke='#ef4444' className='w-[26px] h-[26px]'/></button>}
              <span className='font-semibold text-[15px]'>{post.likes.length}</span>
            </div>
            <div className='flex justify-center items-center gap-[8px]'>
              <button type="button" className='bg-none border-none p-0 cursor-pointer hover:scale-110 transition-transform' onClick={()=>setShowComment(!showComment)}><MessageCircle className='w-[26px] h-[26px] text-white hover:text-blue-400 transition-colors' /></button>
              <span className='font-semibold text-[15px]'>{post.comments.length}</span>
            </div>
        </div>
        <button type="button" onClick={handleSaved} className='bg-none border-none p-0 cursor-pointer hover:scale-110 transition-transform'>
{userData && !userData?.saved?.some(p => p?._id === post?._id || p === post?._id) && <Bookmark className='w-[26px] h-[26px] text-white hover:text-yellow-400 transition-colors'  /> }
{userData && userData?.saved?.some(p => p?._id === post?._id || p === post?._id) && <Bookmark className='w-[26px] h-[26px] text-yellow-400' fill='#facc15' stroke='#facc15' /> }
        </button>
      </div>

{userData && showComment && <div className='w-full flex flex-col gap-[20px] pb-[20px] bg-[#0d0f14] rounded-b-[24px]'>
        <div className='w-full flex items-center justify-between px-[20px] py-[15px] border-b border-gray-800'>
          <div className='w-[40px] h-[40px] rounded-full overflow-hidden ring-1 ring-gray-700 shrink-0'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover'/>
          </div>
          <input type="text" className='flex-1 mx-[12px] px-[16px] py-[10px] rounded-full bg-[#1e222d] text-white text-[15px] outline-none transition-all focus:ring-2 focus:ring-blue-500' placeholder='Add a comment...' onChange={(e)=>setMessage(e.target.value)} value={message} />
          <button className='cursor-pointer text-blue-500 hover:text-blue-400 transition-colors shrink-0 p-2 rounded-full hover:bg-blue-500/10' onClick={handleComment} ><SendHorizontal className='w-[22px] h-[22px]' /></button>
        </div>

        <div className='w-full max-h-[300px] overflow-y-auto px-[5px] custom-scrollbar'>
          {post.comments?.map((com,index)=>(
            <div key={index} className='w-full px-[20px] py-[12px] flex items-start gap-[15px] hover:bg-white/5 transition-colors'>
              <div className='w-[35px] h-[35px] shrink-0 rounded-full overflow-hidden mt-1'>
                <img src={com.author.profileImage || dp} alt="" className='w-full h-full object-cover'/>
              </div>
              <div className='flex flex-col'>
                <span className='font-bold text-[14px] text-gray-300'>{com.author.username}</span>
                <span className='text-[15px] text-gray-100 leading-snug'>{com.message}</span>
              </div>
            </div>
          ))}
          {post.comments?.length === 0 && (
            <div className='text-center text-gray-500 text-[14px] py-4'>Be the first to comment!</div>
          )}
        </div>
  </div> 
  }

    </div>
  )
}

export default Post
