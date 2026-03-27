import React, { useEffect } from 'react'
import dp from '../assets/dp.png'
import { useSelector } from 'react-redux'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import VideoPlayer from './VideoPlayer'
import { Eye } from 'lucide-react';


const StoryCard = ({ storyData }) => {

  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  // const {storyData} = useSelector(state=>state.story)
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    if (!storyData) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          navigate("/")
          return 100
        }
        return prev + 1
      })
    }, 150)
    return () => clearInterval(interval)
  }, [navigate, storyData])

  if (!storyData) return null;


  return (
    <div className=' w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center'>
            
      <MoveLeft onClick={() => navigate(`/profile/${storyData.author.username}`)} className='text-white absolute top-[25px]  w-[25px] h-[25px] cursor-pointer' />
      <div className='flex items-center gap-[10px] absolute top-[20px] left-[30px]'>
        <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
          <img src={storyData?.author?.profileImage || dp} alt="" className='w-full object-cover ' />
        </div>
        <div className='w-[120px] font-semibold truncate text-white'>
          {storyData?.author?.username}
        </div>
      </div>

      <div className='w-full h-[90%] max-h-[500px] flex items-center justify-center px-[15px] pb-[15px]'>
        {storyData.mediaType === 'image' && (
          <img
            src={storyData.media}
            alt=""
            className='max-h-[400px] w-auto rounded-2xl object-contain'
          />
        )}
        {storyData.mediaType === 'video' && (
          <div className='w-full flex items-center justify-center py-[10px]'>
            <div className='w-full max-w-[450px] max-h-[500px] rounded-2xl overflow-hidden bg-black'>
              <VideoPlayer media={storyData.media} />
            </div>
          </div>
        )}
      </div>

      <div className='absolute top-[10px] w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>
        </div>
      </div>

      {!showViewers && (
        <div>
          {storyData?.author?.username == userData?.username && (
            <div className='w-full h-[70px] text-white absolute bottom-0 p-2 left-0'>
              <div className='text-white flex items-center gap-[10px]'>
                <Eye />
                {storyData?.viewers?.length || 0}
              </div>
              <div>Viewers</div>
              <div className='relative w-[100px] h-[40px]'>
                {(storyData?.viewers?.slice(0, 3) || []).map((viewer, index) => (
                  <div
                    key={viewer._id || index}
                    onClick={() => navigate(`/profile/${viewer?.username}`)}
                    className={`w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute border-2 border-black ${index === 0 ? 'left-0' : index === 1 ? 'left-[25px]' : 'left-[50px]'}`}
                  >
                    <img src={viewer.profileImage || dp} alt="" className='rounded-full w-full h-full object-cover' />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

     
    </div>
  )
}

export default StoryCard
