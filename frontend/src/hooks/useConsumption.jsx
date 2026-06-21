import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig.js';
import { setConsumptionData } from '../redux/userSlice.js';

const useConsumption = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    // Local state to keep track of precise seconds for the timer UI without hitting the backend every second
    const [secondsLeft, setSecondsLeft] = useState(null);

    const pingServer = async () => {
        try {
            const response = await axios.post(`${apiConfig.API_URL}/api/user/consumption/ping`, {}, {
                withCredentials: true
            });
            dispatch(setConsumptionData(response.data));
            if (!response.data.isLimitReached) {
                // If backend says 29 mins left, that's 29 * 60 seconds
                // We'll trust the backend, but since we decrement locally every second, 
                // we sync it when the ping succeeds.
                setSecondsLeft(response.data.timeLeft * 60);
            } else {
                setSecondsLeft(0);
            }
        } catch (error) {
            console.error("Error pinging consumption: ", error);
        }
    };

    useEffect(() => {
        if (!userData) return;

        // Ping immediately on mount to get the initial status
        pingServer();

        // Ping backend every 1 minute
        const pingInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                pingServer();
            }
        }, 60000);

        return () => clearInterval(pingInterval);
    }, [userData, dispatch]);

    // Local decrementing timer for smooth UI update every second
    useEffect(() => {
        if (secondsLeft === null || secondsLeft <= 0) return;

        const secondInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(secondInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearInterval(secondInterval);
    }, [secondsLeft]);

    return { secondsLeft };
};

export default useConsumption;
