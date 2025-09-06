'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  // 處理登出
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  // 監聽瀏覽器返回按鈕，關閉模態框
  useEffect(() => {
    const handlePopState = () => {
      if (isLoginModalOpen) {
        setIsLoginModalOpen(false);
      }
      if (isSignupModalOpen) {
        setIsSignupModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoginModalOpen, isSignupModalOpen]);

  // 當模態框開啟時，添加歷史記錄
  useEffect(() => {
    if (isLoginModalOpen || isSignupModalOpen) {
      window.history.pushState({ modal: true }, '');
    }
  }, [isLoginModalOpen, isSignupModalOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    // { name: 'About', path: '/about' },
    { name: 'Freelancer', path: '/freelancer' },
    { name: 'Hiring', path: '/hiring' },
    // { name: 'LEARN2EARN', path: '/learn2earn' }
  ];

    return (
    <nav className="fixed top-0 z-[9999] bg-[#191919] w-[100%] min-w-[200px] h-[50px]">
      <div className="flex items-center justify-between px-[24px] h-full">
        {/* Navigation items on the left */}
        <div className="flex items-center space-x-[24px]">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (!isLoginModalOpen && !isSignupModalOpen) {
                  router.push(item.path);
                }
              }}
              className={`text-[#808080] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none ${
                pathname === item.path 
                  ? 'text-[white] scale-105' 
                  : ''
              } ${
                isLoginModalOpen || isSignupModalOpen
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:text-white hover:scale-105 hover:text-[#FFFFFF]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        
        {/* Auth buttons on the right */}
        <div className="flex items-center space-x-[16px]">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-[white] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none cursor-pointer hover:scale-105 hover:text-red-400"
            >
              Log out
            </button>
          ) : (
            <>
              <button 
                onClick={() => {
                  if (!isLoginModalOpen && !isSignupModalOpen) {
                    setIsLoginModalOpen(true);
                  }
                }}
                className={`text-[white] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none ${
                  isLoginModalOpen || isSignupModalOpen
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:scale-105'
                }`}
              >
                Log in
              </button>
              <button 
                onClick={() => {
                  if (!isLoginModalOpen && !isSignupModalOpen) {
                    setIsSignupModalOpen(true);
                  }
                }}
                className={`text-[white] text-[24px] font-normal transition-all duration-300 bg-[#D2691E] px-[20px] py-[8px] rounded-full border-none outline-none ${
                  isLoginModalOpen || isSignupModalOpen
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:scale-105'
                }`}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          // 登入成功後關閉模態框
          setIsLoginModalOpen(false);
        }}
      />
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </nav>
  );
} 