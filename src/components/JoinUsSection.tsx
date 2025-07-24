'use client';

import Image from 'next/image';

export default function JoinUsSection() {
    return (
      <section className="bg-[#2f2f2f] text-white text-center py-20 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-300 mb-4">JOIN US</h2>
        <p className="text-lg sm:text-xl font-medium max-w-2xl mx-auto">
          We’re building the future of freelance careers <br />
          and we’re looking for someone who’s excited to build it with us.
        </p>
  
        <div className="mt-12">
          <div className="w-10 h-10 relative mx-auto animate-bounce">
            <Image
              src="/images/icon.png" // replace with actual arrow image if any
              alt="arrow"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-sm">
            <Image
              src="/images/conect.png"
              alt="Connect with us"
              width={816}
              height={880}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>
    );
  }
  