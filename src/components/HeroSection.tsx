'use client';

import Image from 'next/image';
import logo from '../../public/images/logo.png';
import icon from '../../public/images/icon.png';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#eef0ff] to-black text-center py-28 px-4 text-white">
      <div className="max-w-2xl mx-auto">
        <Image src={logo} alt="FOVY Logo" width={180} height={80} className="mx-auto mb-8" />
        <Image src={icon} alt="FOVY icon" width={300} height={180} className="mx-auto mb-8" />
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 font-alata">
          <span className="text-[#3e5ef4]">Map</span> Potential,<br />
          <span className="text-[#3e5ef4]">Match</span> Future.
        </h1>
        <p className="text-lg mb-8 text-gray-200">
          A smarter way to grow, match, and thrive in freelance careers.
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-16 font-grotesque">
          Ready to get started?
        </h2>
        <a
          href="#"
          className="inline-block bg-[#3e5ef4] hover:bg-[#2d45c7] text-white font-bold px-6 py-3 rounded-full transition"
        >
          Try it for FREE
        </a>
      </div>
    </section>
  );
}