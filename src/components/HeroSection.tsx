'use client';

import Image from 'next/image';
import logo from '../../public/images/logo.png';
import icon from '../../public/images/icon.png';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#e2e2eb] to-[#DFDDE6] relative overflow-hidden py-20">
      <div className="max-w-full px-[14.28%] lg:px-[14.28%] pt-[96px] lg:pt-[112px] pb-[32px] lg:pb-[48px] relative">
        {/* Logo positioned at top-left with spacing */}
        <div className="mb-[64px] lg:mb-[80px]">
          <Image 
            src={logo} 
            alt="FOVY Logo" 
            width={140} 
            height={64} 
            className="lg:w-[96px] lg:h-auto"
          />
        </div>

        {/* Main content - text only */}
        <div className="flex flex-col items-start justify-start">
          {/* Left side - Text content aligned with logo */}
          <div className="text-left w-full lg:w-1/2 lg:pr-[32px]">
            {/* Main headline */}
            <h1 className="text-[72px] sm:text-[96px] lg:text-[120px] xl:text-[144px] font-bold leading-tight mb-[48px] tracking-tight">
              <span className="text-[#004AAD]">Map</span>{' '}
              <span className="text-black">Potential,</span>
              <br />
              <span className="text-[#004AAD]">Match</span>{' '}
              <span className="text-black">Future.</span>
            </h1>

            {/* Description */}
            <p className="text-[32px] sm:text-[36px] lg:text-[40px] text-gray-700 max-w-[1024px]">
              A smarter way to grow, match, and thrive in freelance careers.
            </p>
          </div>
        </div>

        {/* Floating Icon positioned absolutely - height matches text */}
        <div className="absolute top-[30%] right-[15%] transform -translate-y-[1/2] block z-50">
          <Image 
            src={icon} 
            alt="FOVY icon" 
            width={194} 
            height={250} 
            className="w-auto h-[250px] object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Bottom CTA - horizontally centered, 1% from bottom */}
        <div className="text-center z-40 mt-[100px]">
          <p className="text-[50px] lg:text-[58px] font-bold text-gray-900 mb-[32px]">
            Ready to get started?
          </p>
          <a 
            href="https://www.surveycake.com/s/VG6XM" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[3] bg-[#004AAD] text-[white] px-[15] py-[6] rounded-full text-[30px] lg:text-[40px] font-semibold hover:bg-[#2d4bd8] hover:opacity-80 hover:scale-105 transition-colors duration-300 shadow-lg"
          >
            Try it for FREE
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path 
                d="M7 17L17 7M17 7H7M17 7V17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}