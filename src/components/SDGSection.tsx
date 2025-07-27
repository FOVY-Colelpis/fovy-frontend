'use client';

import Image from 'next/image';

const sdgs = [
  {
    title: 'QUALITY EDUCATION',
    image: '/images/sdg-4.png',
    description: (
      <>
        FOVY empowers freelancers to <strong>visualize</strong> and <strong>validate</strong> their skills through AI-powered mapping and project-based learning, helping them access real jobs and build confidence without traditional credentials.
      </>
    ),
  },
  {
    title: 'DECENT WORK AND ECONOMIC GROWTH',
    image: '/images/sdg-8.png',
    description: (
      <>
        We create <strong>income-generating opportunities</strong> for early-stage freelancers, support micro-entrepreneurship, and value <strong>work-in-progress</strong> as part of growth, not just outcomes.
      </>
    ),
  },
  {
    title: 'INDUSTRY, INNOVATION AND INFRASTRUCTURE',
    image: '/images/sdg-9.png',
    description: (
      <>
        We built for underrepresented freelancers, often those <strong>without elite degrees, formal networks, or conventional paths</strong>, to be seen, trusted, and hired based on potential and growth.
      </>
    ),
  },
  {
    title: 'REDUCED INEQUALITIES',
    image: '/images/sdg-10.png',
    description: (
      <>
        We use AI to rebuild the infrastructure of <strong>trust</strong> and <strong>career-building</strong>, especially for freelance and flexible work models often ignored by traditional systems.
      </>
    ),
  },
];

export default function SDGSection() {
  return (
    <section className="bg-[#E2E2EB] text-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-[54px] font-bold pt-[100px]" style={{margin: 0}}>
            Designing a More Inclusive Future of Work
          </h2>
          <p className="text-[32px] pt-[80px] pb-[120px]" style={{margin: 0}}>
            Empowering non-traditional talent through inclusive, skill-based career systems.
          </p>
        </div>

        <div className="space-y-6">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-8 rounded-xl text-[white] ${
                index === 0 ? 'bg-[#C51A2D]' :
                index === 1 ? 'bg-[#A21842]' :
                index === 2 ? 'bg-[#FD6825]' :
                'bg-[#DD1466]'
              }`}
            >
                            <div className="flex items-center space-x-[30px] px-[200px]">
                {index === 1 || index === 3 ? (
                  <>
                    <div className="text-[32px] leading-relaxed max-w-2xl">
                      {sdg.description}
                    </div>
                    <div className="text-center">
                      <div className="mt-4">
                        <Image src={sdg.image} alt={sdg.title} width={265} height={265} className="object-contain" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="mt-4">
                        <Image src={sdg.image} alt={sdg.title} width={265} height={265} className="object-contain" />
                      </div>
                    </div>
                    <div className="text-[32px] leading-relaxed max-w-2xl">
                      {sdg.description}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
