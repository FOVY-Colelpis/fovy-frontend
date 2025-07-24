'use client';
import Image from 'next/image';

const goals = [
  {
    id: 'GOAL #01',
    title: 'Rebuild Trust in Non-Traditional Talent',
    image: '/images/puzzle-trust.png',
  },
  {
    id: 'GOAL #02',
    title: 'Make Career Growth Visible and Actionable',
    image: '/images/puzzle-growth.png',
  },
  {
    id: 'GOAL #03',
    title: 'Bridge the Gap Between Emerging Talent and Real Work',
    image: '/images/puzzle-gap.png',
  },
];

export default function PuzzleSection() {
  return (
    <section className="bg-[#2f2f2f] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-20">
          For Startups, NGOs, and Teams that <br /> care about potential.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="relative bg-white text-black rounded-[2rem] p-8 pt-12 pb-24 shadow-lg flex flex-col items-center"
            >
              <p className="text-blue-700 text-sm font-bold mb-3">{goal.id}</p>
              <h3 className="text-xl font-semibold text-center leading-snug mb-6">
                {goal.title}
              </h3>

              {/* 底部圖片 + READ MORE */}
              <div className="absolute -bottom-12 flex justify-center items-center w-full">
                <div className="relative w-24 h-24">
                  <Image
                    src={goal.image}
                    alt={goal.title}
                    width={80}
                    height={80}
                    className="object-contain drop-shadow-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] text-blue-700 font-bold text-center leading-tight">
                      READ<br />MORE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
