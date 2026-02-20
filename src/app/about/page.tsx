
import Image from 'next/image';
import { Handshake, Mountain, Trophy } from 'lucide-react';

// A reusable component for feature cards
const ValueCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-lg p-6 shadow-soft">
    <div className="flex items-start">
      <div className="bg-yellow-100 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{children}</p>
      </div>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-[#CA8A04] uppercase tracking-widest">About Subnaka</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-balance">
            Your Trusted Partner in Laotian Real Estate
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-8 text-gray-600">
            We are a dedicated team of professionals committed to making your property journey in Laos seamless, transparent, and successful.
          </p>
        </div>

        {/* Founder Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 sm:mb-20">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-xs mx-auto lg:max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-deep">
              <Image
                  src="/Nok m.png"
                  alt="Valaluk Viranam, CEO & Founder of Subnaka"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">Valaluk Viranam</h3>
              <p className="text-sm text-gray-500">CEO & Founder</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Meet Our Founder</h2>
            <p className="mt-4 text-gray-600 leading-7">
              Subnaka was founded by <span className="font-semibold text-gray-800">Valaluk Viranam</span>, a visionary with over 15 years of deep experience in the Laotian real estate market. Her mission was to build a company grounded in trust and local expertise.
            </p>
            <p className="mt-4 text-gray-600 leading-7">
              Valaluk&apos;s leadership ensures that every client benefits from our profound market knowledge and our unwavering commitment to their success. We don&apos;t just facilitate transactions; we build lasting relationships.
            </p>
            <blockquote className="mt-6 pl-4 border-l-4 border-[#CA8A04]"> 
              <p className="text-md italic text-gray-700">
                &quot;Our promise is to guide you with integrity and a passion for excellence, turning your real estate goals into reality.&quot;
              </p>
            </blockquote>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Core Principles</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
            These values are the foundation of our work and the reason our clients trust us.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard icon={<Handshake size={24} className="text-[#CA8A04]" />} title="Unwavering Integrity">
            We prioritize honesty and transparency in every interaction, ensuring you feel confident and informed.
          </ValueCard>
          <ValueCard icon={<Mountain size={24} className="text-[#CA8A04]" />} title="Local Expertise">
            Our deep roots in the Laotian market provide you with an unmatched advantage in your property search.
          </ValueCard>
          <ValueCard icon={<Trophy size={24} className="text-[#CA8A04]" />} title="Commitment to Excellence">
            We are relentless in our pursuit of client satisfaction, aiming to exceed your expectations at every turn.
          </ValueCard>
        </div>

      </main>
    </div>
  );
}
