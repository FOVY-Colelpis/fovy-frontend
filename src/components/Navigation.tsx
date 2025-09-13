'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 處理登出
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
      setShowUserMenu(false);
    }
  };

  // 處理用戶選單點擊
  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  // 處理選單項點擊
  const handleMenuClick = (path: string) => {
    router.push(path);
    setShowUserMenu(false);
  };

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);


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
              onClick={() => router.push(item.path)}
              className={`text-[#808080] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none ${
                pathname === item.path 
                  ? 'text-[white] scale-105' 
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
            <div className="relative" ref={menuRef}>
              {/* 用戶頭像 */}
              <button
                onClick={handleUserMenuClick}
                className="flex items-center justify-center w-[40px] h-[40px] bg-[#D2691E] rounded-full text-white font-bold text-lg hover:bg-[#B85A1A] transition-colors duration-300"
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </button>

              {/* 下拉選單 */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-[200px] bg-[#2a2a2a] rounded-lg shadow-lg border border-gray-600 z-[10000]">
                  <div className="py-2">
                    {/* 用戶資訊 */}
                    <div className="px-4 py-2 border-b border-gray-600">
                      <p className="text-white text-sm font-medium">{user?.username}</p>
                      <p className="text-gray-400 text-xs">{user?.email}</p>
                    </div>
                    
                    {/* 選單項目 */}
                    <button
                      onClick={() => handleMenuClick('/dashboard')}
                      className="w-full px-4 py-3 text-left text-white hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('/profile')}
                      className="w-full px-4 py-3 text-left text-white hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleMenuClick('/settings')}
                      className="w-full px-4 py-3 text-left text-white hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                    
                    {/* 分隔線 */}
                    <div className="border-t border-gray-600 my-1"></div>
                    
                    {/* 登出按鈕 */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => router.push('/login')}
                className="text-[white] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none cursor-pointer hover:scale-105"
              >
                Log in
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="text-[white] text-[24px] font-normal transition-all duration-300 bg-[#D2691E] px-[20px] py-[8px] rounded-full border-none outline-none cursor-pointer hover:scale-105"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
      
    </nav>
  );
} 