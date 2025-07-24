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
    <section className="bg-gradient-to-b from-[#2f2f2f] to-[#eaeaea] text-black py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-16">Our Milestones</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center"
            >
              <h3 className="text-xl font-bold whitespace-pre-line text-center mb-4">
                {milestone.title}
              </h3>

              <div className="relative w-full h-40 sm:h-48 md:h-52 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  width={260}
                  height={180}
                  className="object-cover"
                />
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-center">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
