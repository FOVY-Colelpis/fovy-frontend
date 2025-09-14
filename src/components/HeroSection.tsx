'use client';

import Image from 'next/image';
import logo from '../../public/images/logo.png';
import icon from '../../public/images/icon.png';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#e2e2eb] to-[#DFDDE6] relative overflow-hidden py-8">
      <div className="w-full px-[14.28%] pt-12 relative">
        {/* Logo positioned at top-left with spacing */}
        <div className="mb-36 w-[128px] h-[56px]">
          <Image 
            src={logo} 
            alt="FOVY Logo" 
            width={128} 
            height={56} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main content - text only */}
        <div className="flex flex-col lg:flex-row items-start justify-between">
          {/* Left side - Text content aligned with logo */}
          <div className="text-left w-full lg:w-4/5 lg:pr-8">
            {/* Main headline */}
            <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] xl:text-[96px] font-bold leading-tight mb-6 tracking-tight">
              <div>
                <span className="text-[#004AAD]">Map</span>{' '}
                <span className="text-black">Potential,</span>
              </div>
              <div>
                <span className="text-[#004AAD]">Match</span>{' '}
                <span className="text-black">Future.</span>
              </div>
            </h1>

            {/* Description */}
            <p className="text-[20px] sm:text-[24px] lg:text-[28px] text-gray-700">
              A smarter way to grow, match, and thrive in freelance careers.
            </p>
          </div>
        </div>

        {/* Floating Icon positioned absolutely - height matches text */}
        <div className="absolute top-1/2 right-[14.28%] transform -translate-y-1/2 block z-50 lg:block hidden">
          <Image 
            src={icon} 
            alt="FOVY icon" 
            width={194} 
            height={250} 
            className="w-auto h-[200px] lg:h-[250px] object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Bottom CTA - horizontally centered, 1% from bottom */}
        <div className="text-center z-40 mt-24">
          <p className="text-[42px] lg:text-[48px] font-bold text-gray-900 mb-6">
            Ready to get started?
          </p>
          <a 
            href="https://www.surveycake.com/s/VG6XM" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[3] bg-[#004AAD] text-[white] px-[15] py-[6] rounded-full text-[20px] lg:text-[24px] font-semibold hover:bg-[#2d4bd8] hover:opacity-80 hover:scale-105 transition-colors duration-300 shadow-lg"
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