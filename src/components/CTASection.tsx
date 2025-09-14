'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import freelancerImg from '../../public/images/freelancer.png';
import hiringImg from '../../public/images/hiring.png';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-[#DFDDE6] to-[#505052] text-center flex items-center justify-center py-12">
      <div className="max-w-10xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-30">
          {/* Freelancer */}
          <div className="flex flex-col items-center">
            <Image
              src={freelancerImg}
              alt="freelancer"
              width={300}
              height={300}
              className="my-6 w-auto h-[250px] lg:h-[300px] object-contain"
            />
            <button 
              onClick={() => router.push('/freelancer')}
              className="bg-gradient-to-r from-[#CBFCFB] to-[#B5D2FF] rounded-full py-[10px] my-6 text-black font-bold text-[36px] w-[450px] hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer" 
              style={{border: 'none', outline: 'none'}}
            >
              I'm a freelancer
            </button>
            <p className="text-[white] text-[36px] mt-0 mb-8">
              looking to grow and get hired.
            </p>
          </div>

          {/* Hiring */}
          <div className="flex flex-col items-center">
            <Image
              src={hiringImg}
              alt="hiring"
              width={300}
              height={300}
              className="my-6 w-auto h-[250px] lg:h-[300px] object-contain"
            />
            <button 
              onClick={() => router.push('/hiring')}
              className="bg-gradient-to-r from-[#F4EDFE] to-[#C5CBFF] rounded-full py-[10px] my-6 text-black font-bold text-[36px] w-[450px] hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer" 
              style={{border: 'none', outline: 'none'}}
            >
              I'm hiring
            </button>
            <p className="text-[white] text-[36px] mt-0 pb-8">
              looking for great talent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
