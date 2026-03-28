import axios from 'axios'
import React, { useState } from 'react'
import { apiConfig } from '../config/apiConfig'
import { useNavigate, useParams } from 'react-router-dom'
import { setProfileData, setSuggestedUsers } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { MoveLeft } from 'lucide-react';
import { setUserData } from '../redux/userSlice'
import Nav from '../components/Nav'
import dp from '../assets/dp.png'
import OtherUsers from '../components/OtherUsers'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { setSelectedUser } from '../redux/messageSlice'

const Profile = () => {
    const navigate = useNavigate()
    const { username } = useParams()
    const [postType, setPostType] = useState("posts");
    const dispatch = useDispatch()
    const { profileData, userData, suggestedUsers } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const handleProfile = async () => {
        try {
            const result = await axiosInstance.get(`/api/user/getProfile/${username}`, { withCredentials: true })
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuggestedUsers = async () => {
        try {
            const result = await axiosInstance.get(`/api/user/suggested`, { withCredentials: true })
            dispatch(setSuggestedUsers(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogOut = async () => {
        try {
            const result = await axiosInstance.get(`/api/auth/signout`, { withCredentials: true })
            localStorage.removeItem('auth_token')
            dispatch(setUserData(null))
        } catch (error) {
            console.log("Error in logout:", error.message)
        }
    }

    useEffect(() => {
        handleProfile()
        handleSuggestedUsers()
    }, [username, dispatch])

    return (
        <div className='w-full min-h-screen bg-black'>
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white '>
                <div onClick={() => navigate('/')} className='text-white w-[25px] h-[25px] cursor-pointer'><MoveLeft /></div>
                <div className='font-semibold text-[20px]'>{profileData?.username}</div>
                <div className='font-semibold cursor-pointer text-[20px] text-blue-500' onClick={handleLogOut} >LogOut</div>
            </div>


            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

                <div className='w-[70px] h-[70px] md:w-[140px] h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt="" className='rounded-full' />
                </div>
                <div>
                    <div className='font-semibold text-[22px] text-white '>{profileData?.name}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
                </div>

            </div>

            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px]  px-[20%] pt-[30px] text-white'>

                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts?.length || 0}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='relative w-[100px] h-[40px]'>
                            {profileData?.followers && profileData?.followers?.length > 0 ? (
                                profileData?.followers?.slice(0, 3).map((user, index) => (
                                    <div key={index} onClick={() => navigate(`/profile/${user?.username}`)} className={`w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden absolute border-2 border-black ${index === 0 ? 'left-0' : index === 1 ? 'left-[25px]' : 'left-[50px]'}`}>
                                        <img src={user?.profileImage || dp} alt="" className='rounded-full w-full h-full object-cover' />
                                    </div>
                                ))
                            ) : (
                                <div className='w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden'>
                                    <img src={dp} alt="" className='rounded-full' />
                                </div>
                            )}
                        </div>
                        <div className='text-white text-[20px] font-semibold'>
                            {profileData?.followers?.length ?? 0}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>

                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='relative w-[100px] h-[40px]'>
                            {profileData?.following && profileData?.following?.length > 0 ? (
                                profileData?.following?.slice(0, 3).map((user, index) => (
                                    <div key={index} onClick={() => navigate(`/profile/${user?.username}`)} className={`w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden absolute border-2 border-black ${index === 0 ? 'left-0' : index === 1 ? 'left-[25px]' : 'left-[50px]'}`}>
                                        <img src={user?.profileImage || dp} alt="" className='rounded-full w-full h-full object-cover' />
                                    </div>
                                ))
                            ) : (
                                <div className='w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden'>
                                    <img src={dp} alt="" className='rounded-full' />
                                </div>
                            )}
                        </div>
                        <div className='text-white text-[20px] font-semibold'>
                            {profileData?.following?.length ?? 0}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followings</div>
                </div>

                <div className='w-full h-[80px] flex justify-center items-center gap-[20px]'>
                    {profileData?._id && userData?._id && profileData._id.toString() === userData._id.toString() && <button className='text-black px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl' onClick={() => navigate('/editprofile')}>Edit Profile</button>}

                    {profileData?._id && userData?._id && profileData._id.toString() !== userData._id.toString() &&

                        <div>
                            <FollowButton tailwind={'text-white px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500 cursor-pointer rounded-2xl'} targetUserId={profileData._id} />

                            <button className='text-white px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500 cursor-pointer rounded-2xl ml-[10px]' onClick={()=>{dispatch(setSelectedUser(profileData)); navigate("/messageArea")}} >Message</button>
                        </div>
                    }
                                                    
                </div>

            </div>

            <div className='w-full min-h-[100vh] flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[30px]'>
                    <div className='w-[80%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]' >



                        <div className={`${postType == "posts" ? " bg-black text-white shadow-2xl shadow-black " : " "}  w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("posts")}>Post</div>

                        <div className={`${postType == "saved" ? " bg-black text-white shadow-2xl shadow-black " : " "}  w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("saved")}>Saved</div>

                    </div>
                    <Nav />
                    {postType === "posts" ? (
                        profileData?.posts && profileData?.posts?.length > 0 ? (
                            profileData?.posts.map((post, index) => (
                                post && <Post key={index} post={post} />
                            ))
                        ) : (
                            <div className='text-gray-500 text-center py-[20px]'>No posts yet</div>
                        )
                    ) : (
                        userData?.saved && userData?.saved?.length > 0 ? (
                            userData?.saved.map((post, index) => (
                                post && <Post key={index} post={post} />
                            ))
                        ) : (
                            <div className='text-gray-500 text-center py-[20px]'>No saved posts</div>
                        )
                    )}
                </div>
            </div>

            <div className='w-full min-h-[100vh] flex justify-center bg-black pt-[50px]'>
                <div className='w-full max-w-[900px] flex flex-col items-center gap-[20px] pb-[30px]'>
                    <h1 className='text-white text-[24px] font-semibold w-full px-[20px]'>Suggested Users For You</h1>
                    <div className='w-full flex flex-col gap-[15px] px-[20px]'>
                        {suggestedUsers && suggestedUsers.length > 0 ? (
                            suggestedUsers.map((user, index) => (
                                <OtherUsers key={index} user={user} />
                            ))
                        ) : (
                            <div className='text-gray-400 text-center py-[20px]'>No suggested users available</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile