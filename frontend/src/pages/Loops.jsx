import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoopCard from '../components/LoopCard'
import {useSelector} from 'react-redux'

const Loops = () => {

    const navigate = useNavigate()
    const {loopData} = useSelector(state=>state.loop)
  const safeLoops = Array.isArray(loopData) ? loopData.filter((loop) => loop && loop.media) : []

  return (
    <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
        <div className='w-full h-[80px] flex items-center z-[100] gap-[20px] px-[20px] fixed top-[10px] left-[10px]'>
            <MoveLeft onClick={()=>navigate( `/` )} className='text-white left-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer' />
            <h1 className='font-semibold text-[20px] text-white'>Loops</h1>
        </div>
        <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide '>
          {safeLoops.map((loop)=> (
            <div key={loop._id || loop.media} className='h-screen snap-start'>
              <LoopCard loop={loop} />
            </div>
          ))}
          {safeLoops.length === 0 && (
            <div className='h-screen flex items-center justify-center text-white text-lg'>No loops available</div>
          )}
          
        </div>
        
    </div>
  )
}

export default Loops
