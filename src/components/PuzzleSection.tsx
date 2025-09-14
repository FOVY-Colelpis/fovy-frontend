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
          <section className="bg-[#343436] flex items-center justify-center py-12 pb-[400px]">
        <div className="max-w-8xl mx-auto text-center">
        <h2 className="text-[52px] text-[white] leading-tight text-center px-[400px] m-0 font-normal pb-24 pt-8">
          For Startups, NGOs, and Teams that care about potential.
        </h2>

        <div className="flex justify-center gap-[25px] relative">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-[white] text-[black] rounded-[30px] p-8 flex flex-col items-center relative w-[350px]"
            >
              {/* 上方 Goal */}
              <p className="text-[#3e5ef4] text-lg font-bold my-[20px] text-center">{goal.id}</p>
              
              {/* 中間內文 */}
              <h3 className="text-[28px] font-normal text-center leading-snug mt-[20px] flex-grow">
                {goal.title}
              </h3>
            </div>
          ))}
          
          {/* 圖片疊加層 */}
          {goals.map((goal, index) => (
            <div
              key={`image-${goal.id}`}
              className="absolute"
              style={{
                left: `${400 * index + 30 * index + 200}px`,
                top: '100%',
                transform: 'translateY(-10%)'
              }}
            >
              <div className="relative bg-white rounded-full shadow-lg flex items-center justify-center">
                <Image
                  src={goal.image}
                  alt={goal.title}
                  width={390}
                  height={390}
                  className="object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center" style={{
                  transform: `translateY(-20px) ${index === 2 ? 'translateX(20px)' : ''}`
                }}>
                  <span className="text-[16px] text-[#3e5ef4] font-bold text-center leading-tight underline">
                    READ<br />MORE
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
