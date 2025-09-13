'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();

  // 處理登出
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };


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
            <button 
              onClick={handleLogout}
              className="text-[white] text-[24px] font-normal transition-all duration-300 bg-transparent border-none outline-none cursor-pointer hover:scale-105 hover:text-red-400"
            >
              Log out
            </button>
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