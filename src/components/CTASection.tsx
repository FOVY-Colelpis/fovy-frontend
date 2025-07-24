'use client';

import Image from 'next/image';
import freelancerImg from '../../public/images/freelancer.png';
import hiringImg from '../../public/images/hiring.png';

export default function CTASection() {
  return (
    <section className="py-24 bg-white text-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Freelancer */}
          <a
            href="#"
            className="group flex items-center border border-[#3e5ef4] rounded-3xl p-6 text-left hover:bg-[#eef0ff] transition"
          >
            <Image
              src={freelancerImg}
              alt="freelancer"
              width={80}
              height={80}
              className="mr-6"
            />
            <div>
              <h3 className="text-lg font-bold text-[#3e5ef4] font-alata mb-1 group-hover:underline">
                I’m a freelancer
              </h3>
              <p className="text-[#3e5ef4] text-sm font-body">
                looking to grow and get hired.
              </p>
            </div>
          </a>

          {/* Hiring */}
          <a
            href="#"
            className="group flex items-center border border-[#3e5ef4] rounded-3xl p-6 text-left hover:bg-[#eef0ff] transition"
          >
            <Image
              src={hiringImg}
              alt="hiring"
              width={80}
              height={80}
              className="mr-6"
            />
            <div>
              <h3 className="text-lg font-bold text-[#3e5ef4] font-alata mb-1 group-hover:underline">
                I’m hiring
              </h3>
              <p className="text-[#3e5ef4] text-sm font-body">
                looking for great talent.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
