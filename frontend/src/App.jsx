import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import { apiConfig } from './config/apiConfig.js'
import Home from './pages/Home.jsx'
import { useDispatch, useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Upload from './pages/Upload.jsx'
import getAllPosts from './hooks/getAllPosts.jsx'
import Loops from './pages/Loops.jsx'
import getAllLoops from './hooks/getAllLoops.jsx'
import Story from './pages/Story.jsx'
import useGetAllStories from './hooks/useGetAllStories.jsx'
import Messages from './pages/Messages.jsx'
import MessageArea from './pages/MessageArea.jsx'
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice.js'
import getFollowingList from './hooks/getFollowingList.jsx'
import getPrevChatUsers from './hooks/getPrevChatUsers.jsx'
import Search from './pages/Search.jsx'
import getAllNotifications from './hooks/getAllNotifications.jsx'
import Notifications from './pages/Notifications.jsx'
import { setNotificationData } from './redux/userSlice.js'

const App = () => {
  getCurrentUser()
  getSuggestedUsers()
  getAllPosts()
  getAllLoops()
  useGetAllStories()
  getFollowingList()
  getPrevChatUsers()
  getAllNotifications()
  
  const {userData,notificationData} = useSelector(state=>state.user)
  const {socket} = useSelector(state=>state.socket)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(userData){
      const socketIo=io(apiConfig.API_URL,{
        query:{
          userId:userData._id
        },
        withCredentials: true
      })
      dispatch(setSocket(socketIo)) 

      socketIo.on('getOnlineUsers',(users)=>{
         dispatch(setOnlineUsers(users))
      })

      return ()=>{
        socketIo.close()
        dispatch(setSocket(null))
      }
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
  },[userData, dispatch])

  useEffect(()=>{
    if(!socket) return
    socket.on("newNotification",(noti)=>{
      dispatch(setNotificationData([...(notificationData || []), noti]))
    })

    return ()=>socket.off("newNotification")
  },[socket, dispatch, notificationData])

  return (
    <Routes>
      <Route path='/signup' element = {!userData ? <SignUp/> : <Navigate to={'/'}/>}/>
      <Route path='/signin' element = {!userData ? <SignIn/> : <Navigate to={'/'}/>}/>
      <Route path='/' element = {userData ? <Home/> : <Navigate to={'/signin'}/>}/>
      <Route path='/forgotpassword' element = {!userData ? <ForgotPassword/> : <Navigate to={'/'}/>}/>
      <Route path='/profile/:username' element = {userData ? <Profile/> : <Navigate to={'/'}/>}/>
      <Route path='/story/:username' element = {userData ? <Story/> : <Navigate to={'/'}/>}/>
      <Route path='/editprofile' element = {userData ? <EditProfile/> : <Navigate to={'/'}/>}/>
      <Route path='/messages' element = {userData ? <Messages/> : <Navigate to={'/'}/>}/>
      <Route path='/messageArea' element = {userData ? <MessageArea/> : <Navigate to={'/'}/>}/>
      <Route path='/loops' element = {userData ? <Loops/> : <Navigate to={'/'}/>}/>
      <Route path='/notifications' element = {userData ? <Notifications/> : <Navigate to={'/'}/>}/>
      <Route path='/upload' element = {userData ? <Upload/> : <Navigate to={'/'}/>}/>
      <Route path='/search' element = {userData ? <Search/> : <Navigate to={'/'}/>}/>
    </Routes>
  )
}

export default App