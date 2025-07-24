import HeroSection from '../components/HeroSection';
import CTASection from '../components/CTASection';
import PuzzleSection from '../components/PuzzleSection';
import VisionSection from '../components/VisionSection';
import MilestoneSection from '../components/MilestoneSection';
import SDGSection from '../components/SDGSection';
import TeamSection from '../components/TeamSection';
import JoinUsSection from '../components/JoinUsSection';


export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <CTASection />
      <PuzzleSection />
      <VisionSection />
      <MilestoneSection />
      <SDGSection />
      <TeamSection />
      <JoinUsSection />
    </main>
  );
}
