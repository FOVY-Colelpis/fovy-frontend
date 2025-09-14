'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AutoLoginNotification() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);

  useEffect(() => {
    // 只在頁面首次載入且自動登入時顯示通知
    if (!isLoading && isLoggedIn && user && !hasShownNotification) {
      // 檢查是否是自動登入（localStorage 中有 token 且是頁面首次載入）
      const token = localStorage.getItem('fovy_token');
      const hasShownBefore = sessionStorage.getItem('fovy_auto_login_shown');
      
      if (token && !hasShownBefore) {
        setShowNotification(true);
        setHasShownNotification(true);
        sessionStorage.setItem('fovy_auto_login_shown', 'true');
      }
    }
  }, [isLoading, isLoggedIn, user, hasShownNotification]);

  // 3秒自動隱藏效果
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // 當用戶登出時重置通知狀態
  useEffect(() => {
    if (!isLoggedIn) {
      setHasShownNotification(false);
    }
  }, [isLoggedIn]);

  if (!showNotification || !user) {
    return null;
  }
  return (
    <div 
      className="fixed right-4 z-[99999] animate-slide-in"
      style={{ 
        position: 'fixed',
        top: '80px', // 移到 navigation 下面
        right: '16px',
        zIndex: 99999
      }}
    >
      <div 
        className="text-[white] rounded-lg shadow-lg relative"
        style={{
          backgroundColor: '#10B981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          minWidth: '300px',
          position: 'relative'
        }}
      >
        {/* X 按鈕在右上角 */}
        <button
          onClick={() => setShowNotification(false)}
          className="absolute top-2 right-[5px] text-[white] hover:text-gray-200 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            padding: '0'
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{
              width: '16px',
              height: '16px'
            }}
          >
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* 內容區域 */}
        <div className="flex items-center space-x-3 pr-6">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-[white]">已自動登入</p>
            <p className="text-sm text-[white] opacity-90">歡迎回來，{user.username}！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
