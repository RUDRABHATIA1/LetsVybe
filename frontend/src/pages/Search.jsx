import React, { useEffect } from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { apiConfig } from '../config/apiConfig';
import { useDispatch } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dp from '../assets/dp.png';

const Search = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState("");
    const dispatch= useDispatch()
    const { searchData, userData } = useSelector((state)=>state.user)

    const handleSearch = async () => {
        try {
            if(!input.trim()){
                dispatch(setSearchData([]))
                return
            }
            const result = await axios.get(`/api/user/search?keyword=${encodeURIComponent(input.trim())}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmitSearch = (e) => {
        e.preventDefault()
        handleSearch()
    }

    useEffect(()=>{
        handleSearch()
    },[input])


  return (
    <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5'>
      <div className='w-full h-20 flex items-center gap-5 px-5'>
            <MoveLeft onClick={()=>navigate( `/` )} className='text-white w-6 h-6 cursor-pointer' />
            <h1 className='text-white text-xl font-semibold'>Search Users</h1>
        </div>

        <div className='w-[90%] max-w-[800px]'>
          <div className='text-gray-300 text-sm mb-2'>Type username or name</div>
          <form action="" onSubmit={onSubmitSearch} className='w-full h-14 rounded-xl bg-[#0f1414] border border-gray-700 flex items-center px-4'>
              <SearchIcon className='w-5 h-5 text-white'/>
              <input
                type="text"
                placeholder='e.g. radha@vybe'
                className='w-full h-full outline-0 px-4 text-white bg-transparent'
                onChange={(e)=>setInput(e.target.value)}
                value={input}
                autoFocus
              />
          </form>
        </div>

                <div className='w-[90%] max-w-[800px] mt-2.5 flex flex-col gap-2.5'>
                    {searchData && searchData.length > 0 ? (
                        searchData
                            .filter((user)=> user?._id !== userData?._id)
                            .map((user)=> (
                                <div
                                    key={user._id}
                                    className='w-full h-16 px-3 bg-[#0f1414] border border-gray-800 rounded-xl flex items-center justify-between cursor-pointer'
                                >
                                    <div className='flex items-center gap-2.5' onClick={()=>navigate(`/profile/${user.username}`)}>
                                        <div className='w-11 h-11 rounded-full overflow-hidden'>
                                            <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover' />
                                        </div>
                                        <div>
                                            <div className='text-white text-[16px] font-semibold'>{user.username}</div>
                                            <div className='text-gray-400 text-[13px]'>{user.name}</div>
                                        </div>
                                    </div>
                                    <button className='px-3 py-1.5 bg-white text-black rounded-lg cursor-pointer' onClick={()=>navigate(`/profile/${user.username}`)}>Open</button>
                                </div>
                            ))
                    ) : (
                        <div className='text-gray-400 text-center py-4'>Search users by username or name</div>
                    )}
                </div>
    </div>
  )
}

export default Search
