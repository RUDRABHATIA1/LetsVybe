import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { useRef } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import axios from 'axios'
import { apiConfig } from '../config/apiConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setCurrentUserStory, setStoryData } from '../redux/storySlice'
import { setLoopData } from '../redux/loopSlice'
import { ClipLoader } from 'react-spinners'
import { setUserData } from '../redux/userSlice'

const Upload = () => {

  const navigate = useNavigate()

  const [uploadType, setUploadType] = useState("post");

  const [frontendMedia, setFrontendMedia] = useState(null);

  const [backendMedia, setBackendMedia] = useState(null);

  const [mediaType, setMediaType] = useState("");

  const [caption, setCaption] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const mediaInput = useRef(null)

  const dispatch = useDispatch()

  const {loopData} = useSelector(state=>state.loop)
  const {storyData} = useSelector(state=>state.story)
  const {postData} = useSelector(state=>state.post)

  console.log("Story Data : ",storyData)

  const handleMedia = async (e)=>{
    const file = e.target.files[0]
    console.log(file)

    // File size validation - limit to 50MB for videos, 10MB for images
    const maxSizeVideo = 50 * 1024 * 1024; // 50MB
    const maxSizeImage = 10 * 1024 * 1024; // 10MB

    if(file.type.includes("image")){
      setMediaType("image")
      if(file.size > maxSizeImage) {
        setError("Image file is too large. Maximum size is 10MB")
        setFrontendMedia(null)
        setBackendMedia(null)
        return
      }
    }else if(file.type.includes("video")){
      setMediaType("video")
      if(file.size > maxSizeVideo) {
        setError("Video file is too large. Maximum size is 50MB")
        setFrontendMedia(null)
        setBackendMedia(null)
        return
      }
    }else{
      setError("Invalid file type. Please upload an image or video")
      return
    }

    setError("")
    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const uploadPost = async()=>{
    setLoading(true)
    try {
      if(!backendMedia) {
        setError("Please select an image or video")
        return
      }
      setLoading(true)
      setError("")
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia)
      const result = await axios.post(`${apiConfig.API_URL}/api/post/upload`, formData, {withCredentials: true})
      console.log("Post uploaded:", result)
      setFrontendMedia(null)
      setBackendMedia(null)
      setMediaType("")
      setCaption("")
      setLoading(false)
      navigate('/')

      dispatch(setPostData([...postData, result.data]))

    } catch (error) {
      console.log("Upload error:", error)
      setError(error.response?.data?.message || error.message || "Upload failed")
      setLoading(false)
    }
  }

    const uploadStory = async()=>{
      setLoading(true)
    try {
      if(!backendMedia) {
        setError("Please select an image or video")
        return
      }
      setLoading(true)
      setError("")
      const formData = new FormData()
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia)
      const result = await axios.post(`${apiConfig.API_URL}/api/story/upload`, formData, {withCredentials: true})
      console.log("Story uploaded:", result)
      setFrontendMedia(null)
      setBackendMedia(null)
      setMediaType("")
      setLoading(false)
      navigate('/')
      dispatch(setCurrentUserStory(result.data))

    } catch (error) {
      console.log("Upload error:", error)
      setError(error.response?.data?.message || error.message || "Upload failed")
      setLoading(false)
    }
  }

    const uploadLoop = async()=>{
    try {
      if(!backendMedia) {
        setError("Please select a video")
        return
      }
      setLoading(true)
      setError("")
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia)
      const result = await axios.post(`${apiConfig.API_URL}/api/loop/upload`, formData, {withCredentials: true})
      console.log("Loop uploaded:", result)
      setFrontendMedia(null)
      setBackendMedia(null)
      setMediaType("")
      setCaption("")
      setLoading(false)
      navigate('/')
      dispatch(setLoopData([...loopData, result.data]))
    } catch (error) {
      console.log("Upload error:", error)
      setError(error.response?.data?.message || error.message || "Upload failed")
      setLoading(false)
    }
  }

  const handleUpload=()=>{
    if(uploadType=="post"){
      uploadPost()
    }else if(uploadType=="story"){
      uploadStory()
    }else{
      uploadLoop()
    }
  }


  return (
    <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>
            <MoveLeft onClick={()=>navigate( `/` )} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer' />
            <h1 className='font-semibold text-[20px] text-white'>Upload Media</h1>
        </div>


        <div className='w-[80%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]' >
          
          

          <div className= {`${uploadType=="post" ? " bg-black text-white shadow-2xl shadow-black " : " " }  w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black` }    onClick={()=>setUploadType("post")}>Post</div>

          <div className= {`${uploadType=="story" ? " bg-black text-white shadow-2xl shadow-black " : " " }  w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black` } onClick={()=>setUploadType("story")}>Story</div>

          <div className= {`${uploadType=="loop" ? " bg-black text-white shadow-2xl shadow-black " : " " }  w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black` } onClick={()=>setUploadType("loop")}>Loop</div>

        </div>


        { !frontendMedia && <div className='w-[80%] max-w-[500px] text-white h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]' onClick={()=>mediaInput.current.click()}   >
            <input type="file" accept={uploadType == "loop" ? "video/*" : "image/*,video/*"} hidden ref={mediaInput} onChange={handleMedia} />
            <CirclePlus />
            Upload {uploadType} 
            <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/upload')}></div>
          </div> }

        {frontendMedia && 
        <div className='w-[90%] max-w-[900px] flex flex-col items-center justify-center my-[30px] gap-[20px]'>
            {mediaType=="image" && 
              <div className='w-full flex flex-col items-center justify-center gap-[20px]'>
                <img src={frontendMedia} alt="" className='max-h-[60vh] max-w-full rounded-2xl object-contain' />
                {uploadType!="story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white bg-transparent' placeholder='Write the Captions' 
                onChange={(e)=>setCaption(e.target.value)} value={caption} />}
              </div>}

            
            {mediaType=="video" && 
              <div className='w-full flex flex-col items-center justify-center gap-[20px]'>
                <div className='w-full aspect-video rounded-2xl overflow-hidden'>
                  <VideoPlayer media={frontendMedia}/>
                </div>
                {uploadType!="story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]  bg-transparent' placeholder='Write the Captions ' onChange={(e)=>setCaption(e.target.value)} value={caption} />}  
              </div>}
        </div> }

        {error && <div className='w-[80%] max-w-[900px] px-[20px] py-[15px] bg-red-900 text-red-100 rounded-lg border border-red-700 mb-[20px]'>
          {error}
        </div>}

            {frontendMedia && <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white text-black mb-[30px] cursor-pointer rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed' onClick={handleUpload} disabled={loading}>
              {loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType}` }
            </button>}
          


    </div>
  )
}

export default Upload
