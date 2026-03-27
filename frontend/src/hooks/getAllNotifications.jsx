import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiConfig } from '../config/apiConfig'
import axios from 'axios'
import { setNotificationData } from '../redux/userSlice'

const getAllNotifications = () => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)

    useEffect(() => {
        if (!userId) return
        const fetchNotifications = async () => {
            try {
                const result = await axios.get(`${apiConfig.API_URL}/api/user/getAllNotifications`, { withCredentials: true })
                dispatch(setNotificationData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchNotifications()
    }, [dispatch, userId])
}



export default getAllNotifications  