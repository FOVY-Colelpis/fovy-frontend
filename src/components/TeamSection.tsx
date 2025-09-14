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
    <section className="bg-[#343436] text-[white] pt-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[54px] font-bold text-center mb-8 pt-8 pb-8">Best Team</h2>

        {/* Team Members and Awards - Left Side */}
        <div className="flex justify-between items-start">
          <div className="flex-1 px-8 pr-12">
            {/* Team Members */}
            <div className="flex gap-[10px]">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-left">
                  <div className="w-[150px] h-[120px] relative">
                    <div className="w-full h-full rounded-[15px] bg-gradient-to-br from-[#A182A0] to-[#8BA3EF]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={250}
                        className={`rounded-2xl object-cover w-full h-full`}
                      />
                    </div>
                  </div>
                  <p className="font-bold text-[24px] underline">{member.name}</p>
                  <p className="text-[18px]">{member.title}</p>
                  <p className="text-[18px]">{member.role}</p>
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className="flex gap-[30px] justify-start" style={{width: '100%', marginTop: '50px'}}>
              {awards.map((award, i) => (
                <div key={i} className="text-center flex-1">
                  <div className="relative w-[150px] h-[80px] mb-4 mx-auto">
                    <div className="w-full h-full rounded-full">
                      <Image src={award.image} alt={`award-${i}`} width={300} height={250} className="object-contain w-full h-full" />
                    </div>
                  </div>
                  <p className="text-[12px] text-[white] max-w-[300px] leading-relaxed">{award.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="px-8 pl-0">
            <div className="flex flex-col pb-[50px]">
              {icons.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-[100px] h-[100px] mb-2">
                    <Image src="/images/icon.png" alt="icon" width={80} height={80} className="object-contain" />
                  </div>
                  <p className="text-[20px] text-[white] text-center max-w-[180px] leading-relaxed" style={{margin: 0, paddingBottom: '20px'}}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
