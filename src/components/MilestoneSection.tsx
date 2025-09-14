'use client';

import Image from 'next/image';

const milestones = [
  {
    title: 'Hult Prize Finalist\n(Taiwan, 2025)',
    image: '/images/milestones1.jpg',
    description: 'Out of 30k+ teams, FOVY made it to the top 6 nationally.',
  },
  {
    title: 'First Successful\nMatch',
    image: '/images/milestones2.jpg',
    description: 'Voyamee, an early-stage startup seeking intuitive product design. Through FOVY’s skill-based matching system.',
  },
  {
    title: 'Campus Recognition:\nRepresenting NCKU',
    image: '/images/milestones3.png',
    description: 'Represent NCKU in external innovation dialogues and demo sessions.',
  },
];

export default function MilestoneSection() {
  return (
    <section className="bg-gradient-to-b from-[#3D3D3E] to-[#E2E2EB] text-black py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-[54px] font-bold text-[white] pt-12 pb-8">Our Milestones</h2>

        <div className="flex justify-center gap-6 pb-12">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="bg-[white] rounded-[30px] shadow-lg p-6 flex flex-col items-center w-[400px]"
            >
              <h3 className="text-[32px] font-bold whitespace-pre-line text-center mb-4">
                {milestone.title}
              </h3>

              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  width={260}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="text-[24px] mx-[30px] leading-relaxed text-center">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
