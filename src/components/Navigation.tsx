'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    // { name: 'About', path: '/about' },
    { name: 'Freelancer', path: '/freelancer' },
    { name: 'Hiring', path: '/hiring' },
    // { name: 'LEARN2EARN', path: '/learn2earn' }
  ];

  return (
    <nav className="fixed top-0 z-[9999] bg-[#191919] w-[100%] min-w-[200px] h-[50px]">
      <div className="flex space-x-[24px] px-[24px] h-full items-center justify-end">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`text-[#808080] text-[24px] font-normal transition-all duration-300 cursor-pointer hover:text-white hover:scale-105 hover:text-[#FFFFFF] bg-transparent border-none outline-none ${
              pathname === item.path 
                ? 'text-[white] scale-105' 
                : ''
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </nav>
  );
} 