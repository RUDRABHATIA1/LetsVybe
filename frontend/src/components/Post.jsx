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
    <div className='w-[90%] max-w-[700px] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl overflow-hidden' onClick={e => e.stopPropagation()}>

      <div className='w-full h-[70px] flex justify-between items-center px-[15px]'>
        <div className='flex items-center gap-[15px]' onClick={()=>navigate(`/profile/${post.author?.username}`)}>
          <div className='w-[45px] h-[45px] md:w-[55px] md:h-[55px] border-2 border-black rounded-full overflow-hidden'>
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className='w-full h-full object-cover'
            />
          </div>
          <div className='max-w-[120px] font-semibold truncate'>
            {post.author.username}
          </div>
        </div>
          {userData && userData._id !== post.author?._id && <FollowButton targetUserId={post.author._id} tailwind={'px-[14px] h-[34px] md:h-[38px] bg-blue-500 text-white rounded-full text-[14px] md:text-[15px] font-semibold cursor-pointer'} />}  
      </div>

      {userData && post.caption && <div className='w-full px-[20px] py-[10px] flex flex-col gap-[5px]'>
        <div className='text-[18px] break-words whitespace-normal text-gray-700'>{post.caption}</div>
      </div> }

      <div className='w-full max-h-[500px] flex items-center justify-center px-[15px] pb-[15px]'>
        {post.mediaType === 'image' && (
          <img
            src={post.media}
            alt=""
            className='max-h-[400px] w-auto rounded-2xl object-contain'
          />
        )}
        {post.mediaType === 'video' && (
          <div className='w-full flex items-center justify-center py-[10px]'>
            <div className='w-full max-w-[450px] max-h-[500px] rounded-2xl overflow-hidden bg-black'>
              <VideoPlayer media={post.media} />
            </div>
          </div>
        )}
      </div>


      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex justify-center items-center gap-[10px]'>
            <div className='flex justify-center items-center gap-[5px]'>
              {userData && !isLikedByMe && <button type="button" onClick={handleLike} className='bg-none border-none p-0 cursor-pointer'><Heart className='w-[25px] h-[25px]' /></button>}
              {userData && isLikedByMe && <button type="button" onClick={handleLike} className='bg-none border-none p-0 cursor-pointer'><Heart fill='red' stroke='red' className='w-[25px] h-[25px]'/></button>}
              <span>{post.likes.length}</span>
            </div>
            <div className='flex justify-center items-center gap-[5px]'>
              <MessageCircle className='w-[25px] cursor-pointer h-[25px]' onClick={()=>setShowComment(!showComment)} />
              <span>{post.comments.length}</span>
            </div>
        </div>
        <button type="button" onClick={handleSaved} className='bg-none border-none p-0 cursor-pointer'>
{userData && !userData?.saved?.some(p => p?._id === post?._id || p === post?._id) && <Bookmark className='w-[25px] h-[25px]'  /> }
{userData && userData?.saved?.some(p => p?._id === post?._id || p === post?._id) && <Bookmark className='w-[25px] h-[25px]' fill='black' /> }
        </button>
      </div>

{userData && showComment && <div className='w-full flex flex-col gap-[30px] pb-[20px]'>
        <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative '>
        <div className='w-[45px] h-[45px] md:w-[55px] md:h-[55px] border-2 border-black rounded-full overflow-hidden'>
          <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover'/>
        </div>
        <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]'placeholder='Write Comment....' onChange={(e)=>setMessage(e.target.value)} value={message} />
        <button className='absolute right-[20px] cursor-pointer ' onClick={handleComment} ><SendHorizontal className='w-[25px] h-[25px]' /></button>
        </div>

        <div className='w-full max-h-[300px] overflow-auto'>
          {post.comments?.map((com,index)=>(
            <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200 '>
              <div className='w-[45px] h-[45px] md:w-[55px] md:h-[55px] border-2 border-black rounded-full overflow-hidden'>
                <img src={com.author.profileImage || dp} alt="" className='w-full h-full object-cover'/>
              </div>
              <div>{com.message}</div>
            </div>
          ))}

        </div>
  </div> 
  }

    </div>
  )
}

export default Post
