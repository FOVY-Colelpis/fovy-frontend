'use client';

export default function FreelancerSection() {
  return (
    <section className="bg-[black] text-[white] min-h-screen flex flex-col items-center relative px-8">
      {/* Content */}
      <div className="relative text-center z-10 max-w-4xl">
        <h2 className="text-[48px] font-medium mt-[100px]">
          Skill Mapping
        </h2>
        
        <p className="text-[24px] my-[50px]">
          Get a <span className="text-[#5DE1E6]">FREE personalized skill map</span> from FOVY.
        </p>
        
        <div className="text-[22px] leading-relaxed space-y-6 text-center max-w-[800px]">
          <p>
            This is part of our early-stage user testing for FOVY's career system.
          </p>
          <p>
            We want to understand how freelancers grow, and how we can help that growth become visible, trusted, and rewarded.
          </p>
          <p>
            You'll get a free, personalized skill map. We'll get insights to make FOVY better.
          </p>
        </div>
      </div>
    </section>
  );
} 