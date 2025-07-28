'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import freelancerImg from '../../public/images/freelancer.png';
import hiringImg from '../../public/images/hiring.png';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-[#DFDDE6] to-[#505052] text-center flex items-center justify-center py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-[200px]">
          {/* Freelancer */}
          <div className="flex flex-col items-center">
            <Image
              src={freelancerImg}
              alt="freelancer"
              width={300}
              height={300}
              className="my-[30px] w-auto h-[300px] lg:h-[400px] object-contain"
            />
            <button className="bg-gradient-to-r from-[#CBFCFB] to-[#B5D2FF] rounded-full py-[10px] my-[50px] text-black font-bold text-[40px] w-[450px] cursor-pointer" style={{border: 'none', outline: 'none'}}>
              I'm a freelancer
            </button>
            <p className="text-[white] text-[40px] mt-[0px] mb-[60px]">
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
              className="my-[30px] w-auto h-[300px] lg:h-[400px] object-contain"
            />
            <button 
              onClick={() => router.push('/hiring')}
              className="bg-gradient-to-r from-[#F4EDFE] to-[#C5CBFF] rounded-full py-[10px] my-[50px] text-black font-bold text-[40px] w-[450px] hover:opacity-90 transition-opacity duration-300 cursor-pointer" 
              style={{border: 'none', outline: 'none'}}
            >
              I'm hiring
            </button>
            <p className="text-[white] text-[40px] mt-[0px] pb-[60px]">
              looking for great talent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
