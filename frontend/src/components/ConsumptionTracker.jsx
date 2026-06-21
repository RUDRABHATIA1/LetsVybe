import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    zIndex: 9998,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    Time Left: {formatTime(secondsLeft)}
                </div>
            )}

            {/* Limit Reached Overlay */}
            {isLimitReached && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#ff4d4d' }}>Daily Limit Reached</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>You have reached your daily content consumption limit.</p>
                    
                    <div style={{ background: '#222', padding: '20px', borderRadius: '10px', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Need more time?</h3>
                        <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#ccc' }}>
                            You can take a loan for additional time today. However, your daily limits for the following days will be reduced as a penalty.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button 
                                onClick={() => handleLoan('5min')}
                                disabled={loadingLoan}
                                style={{
                                    padding: '12px',
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: loadingLoan ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Take 5 Min Loan (Next 5 days -5 mins)
                            </button>
                            
                            <button 
                                onClick={() => handleLoan('10min')}
                                disabled={loadingLoan}
                                style={{
                                    padding: '12px',
                                    background: '#ff9800',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: loadingLoan ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Take 10 Min Loan (Next 10 days -10 mins)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConsumptionTracker;
