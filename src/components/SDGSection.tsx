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
    <section className="bg-[#f3f3f3] text-black py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Designing a More Inclusive Future of Work
        </h2>
        <p className="text-lg mb-12">
          Empowering non-traditional talent through inclusive, skill-based career systems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md px-6 py-6 flex flex-col items-center text-left text-sm"
            >
              <div className="relative w-12 h-12 mb-4">
                <Image src={sdg.image} alt={sdg.title} width={250} height={250} className="object-contain" />
              </div>
              <p className="text-gray-800 leading-relaxed">{sdg.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
