import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig.js';
import { setConsumptionData } from '../redux/userSlice.js';

const LimitReachedUI = () => {
    const dispatch = useDispatch();
    const { consumptionData } = useSelector((state) => state.user);
    const [loadingLoan, setLoadingLoan] = useState(false);

    if (!consumptionData || !consumptionData.isLimitReached) return null;

    const handleLoan = async (type) => {
        setLoadingLoan(true);
        try {
            const response = await axios.post(`${apiConfig.API_URL}/api/user/consumption/loan`, { loanType: type }, {
                withCredentials: true
            });
            dispatch(setConsumptionData(response.data));
        } catch (error) {
            console.error("Failed to take loan", error);
            alert(error.response?.data?.message || "Failed to take loan");
        } finally {
            setLoadingLoan(false);
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '"Inter", "Roboto", sans-serif',
            borderRadius: '24px'
        }}>
            <div style={{ 
                background: 'linear-gradient(145deg, rgba(30,30,40,0.9) 0%, rgba(20,20,25,0.95) 100%)', 
                padding: '40px', 
                borderRadius: '24px', 
                maxWidth: '450px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.05)',
                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
            }}>
                <style>
                    {`
                    @keyframes popIn {
                        0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .loan-btn {
                        padding: 16px;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 1rem;
                        color: #fff;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        position: relative;
                        overflow: hidden;
                    }
                    .loan-btn:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }
                    .btn-5min {
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
                    }
                    .btn-5min:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
                    }
                    .btn-10min {
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
                    }
                    .btn-10min:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4);
                    }
                    .btn-subtext {
                        font-size: 0.75rem;
                        opacity: 0.8;
                        font-weight: 500;
                    }
                    `}
                </style>

                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(255, 77, 77, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255, 77, 77, 0.2)'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                            <circle cx="12" cy="12" r="3" fill="#ff4d4d"/>
                        </svg>
                    </div>
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#fff', letterSpacing: '-0.5px' }}>
                    Time's Up!
                </h1>
                <p style={{ fontSize: '1.05rem', color: '#a0a0b0', marginBottom: '35px', lineHeight: '1.5' }}>
                    You've reached your daily consumption limit for Vybe. Take a break, or grab a quick loan to finish what you were watching.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button 
                        className="loan-btn btn-5min"
                        onClick={() => handleLoan('5min')}
                        disabled={loadingLoan}
                    >
                        <span>Get 5 Extra Minutes</span>
                        <span className="btn-subtext">Penalty: -5 mins for the next 5 days</span>
                    </button>
                    
                    <button 
                        className="loan-btn btn-10min"
                        onClick={() => handleLoan('10min')}
                        disabled={loadingLoan}
                    >
                        <span>Get 10 Extra Minutes</span>
                        <span className="btn-subtext">Penalty: -10 mins for the next 10 days</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LimitReachedUI;
