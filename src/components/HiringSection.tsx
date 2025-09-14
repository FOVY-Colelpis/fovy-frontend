'use client';

import Image from 'next/image';

export default function ComingSoonSection() {
  return (
    <section className="bg-[black] text-[white] min-h-screen flex flex-col items-center relative">
      {/* Content */}
      <div className="relative text-center z-10">
        <h2 className="text-[32px] font-medium my-16">
          Smart Matching
        </h2>
      </div>
      
      {/* Coming Soon Image */}
      <div className="relative z-10 mt-8">
        <Image
          src="/images/commingsoon.gif"
          alt="Coming Soon"
          width={780}
          height={280}
          unoptimized
          className="object-contain"
        />
      </div>
    </section>
  );
} 