import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useConsumption from '../hooks/useConsumption.jsx';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig.js';
import { setConsumptionData } from '../redux/userSlice.js';

const ConsumptionTracker = () => {
    const { secondsLeft } = useConsumption();
    const { consumptionData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loadingLoan, setLoadingLoan] = useState(false);

    if (!consumptionData) return null;

    const { isLimitReached } = consumptionData;

    const formatTime = (totalSeconds) => {
        if (totalSeconds === null || totalSeconds < 0) return "00:00";
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleLoan = async (type) => {
        setLoadingLoan(true);
        try {
            const response = await axios.post(`${apiConfig.API_URL}/api/user/consumption/loan`, { loanType: type }, {
                withCredentials: true
            });
            dispatch(setConsumptionData(response.data));
            // Let the hook naturally pick up the new state and reset the timer in the background, 
            // but the dispatch will immediately update `isLimitReached` to false.
        } catch (error) {
            console.error("Failed to take loan", error);
            alert(error.response?.data?.message || "Failed to take loan");
        } finally {
            setLoadingLoan(false);
        }
    };

    return (
        <>
            {/* Floating Timer UI */}
            {!isLimitReached && secondsLeft !== null && (
                <>
                    <style>
                        {`
                        @keyframes pulse-clock {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        `}
                    </style>
                    <div className="fixed bottom-[110px] right-[20px] lg:bottom-[30px] lg:right-[30px]" style={{
                        background: 'rgba(20, 20, 20, 0.65)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 77, 77, 0.4)',
                        color: '#ff4d4d',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        zIndex: 9998,
                        fontWeight: '800',
                        fontSize: '1.1rem',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 32px 0 rgba(255, 77, 77, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                        userSelect: 'none'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse-clock 2s infinite ease-in-out' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span style={{ textShadow: '0 0 15px rgba(255, 77, 77, 0.6)' }}>
                            {formatTime(secondsLeft)}
                        </span>
                    </div>
                </>
            )}

        </>
    );
};

export default ConsumptionTracker;
