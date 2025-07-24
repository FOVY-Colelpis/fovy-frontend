'use client';

import Image from 'next/image';

const teamMembers = [
  {
    name: 'Battie Chen',
    title: 'CEO / Founder',
    role: 'Business Development / Brand',
    image: '/images/CEO.png',
  },
  {
    name: 'Fish Yu',
    title: 'CTO / Co-Founder',
    role: 'AI Specialist / AI Development',
    image: '/images/CTO2.png',
  },
  {
    name: 'William Wu',
    title: 'CFO / Co-Founder',
    role: 'Financial Strategy / Market',
    image: '/images/CFO.png',
  },
  {
    name: 'David Lin',
    title: 'CTO / Co-Founder',
    role: 'Product Developer / UI/UX',
    image: '/images/CTO1.png',
  },
];

const icons = [
  { text: 'Built from the inside' },
  { text: 'Guided by real-world mentors' },
  { text: 'Rooted in trust, driven by vision' },
];

const awards = [
    {
      image: '/images/team1.png',
      label: 'Hult Prize Boston Summit & NCKU Gold Winner (2024), finalist 2025',
    },
    {
      image: '/images/team2.png',
      label: 'Bank SinoPac, sponsored',
    },
    {
      image: '/images/team3.png',
      label: 'Atelire Future, Future Dynamic Accelerator Program (2024–2025)',
    },
    {
      image: '/images/team4.png',
      label: 'NCKU CCEP Metamorphosis Exhibition – Curator (2024)',
    },
  ];

export default function TeamSection() {
  return (
    <section className="bg-[#2f2f2f] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Best Team</h2>

        {/* Team Members */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 relative mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-xl object-cover"
                />
              </div>
              <p className="font-bold text-base">{member.name}</p>
              <p className="text-sm text-gray-300">{member.title}</p>
              <p className="text-sm text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          {awards.map((award, i) => (
            <div key={i} className="flex flex-col items-center text-center max-w-[200px]">
            <div className="relative w-20 h-20 mb-3">
                <Image src={award.image} alt={`award-${i}`} width={80} height={80} className="object-contain" />
            </div>
            <p className="text-sm text-gray-300">{award.label}</p>
            </div>
        ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
          {icons.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 relative">
                <Image src="/images/icon.png" alt="icon" width={150} height={150} className="object-contain" />
              </div>
              <p className="text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
