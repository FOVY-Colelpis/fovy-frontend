'use client';

import Image from 'next/image';

export default function JoinUsSection() {
    return (
      <section className="bg-[#343436] text-[white] px-6">
        <div className="max-w-7xl mx-auto h-full relative px-6">
          {/* Top Content */}
          <div className="text-center mb-8 pt-8">
            <div className="flex items-center justify-center gap-4">
                              <span className="text-[64px] font-bold text-[#5DE1E6] pb-[15px]">JOIN US&nbsp;</span>
              <span className="text-[38px] font-medium">
                We're building the future of freelance careers
              </span>
            </div>
            <p className="text-[38px] font-medium text-center">
              and we're looking for someone who's excited to build it with us.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <Image
                src="/images/arrow.png"
                alt="arrow"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </div>

          {/* Form Area - 70% width, centered */}
          <div className="flex justify-center pb-[100px]">
            <div className="w-[70%] h-[80vh] bg-[white] rounded-lg mb-8 flex items-center justify-center">
              {/* Form content will go here */}
            </div>
          </div>

          {/* Connect Image - Bottom Right */}
          <div className="absolute bottom-[100px] right-[0] w-[300px] h-[300px]" style={{margin: 0, padding: 0}}>
            <Image
              src="/images/conect.png"
              alt="Connect with us"
              width={300}
              height={300}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
    );
  }
  