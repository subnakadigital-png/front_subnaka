'use client';

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans antialiased">
      
      {/* Hero Section */}
      <div className="h-[400px] relative flex items-center justify-center bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Modern Architecture"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 text-center text-white px-4">
          <span className="text-brand-500 font-bold uppercase tracking-widest text-sm mb-2 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            Building the Future of Laos
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[90%] mx-auto px-4 py-16 bg-gray-50 relative z-10 rounded-t-3xl -mt-8 pt-16">
        
        {/* Intro Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              More than just Real Estate
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Founded in 2020, Subnaka Development has rapidly become the most trusted name in Vientiane&apos;s property market. We bridge the gap between traditional Lao hospitality and modern international standards.
            </p>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Our mission is to simplify the property journey for investors and families alike, providing transparency, legal security, and premium construction services.
            </p>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="border-l-4 border-brand-500 pl-4">
                <h4 className="font-bold text-2xl">500+</h4>
                <p className="text-sm text-gray-400">Properties Sold</p>
              </div>
              <div className="border-l-4 border-brand-500 pl-4">
                <h4 className="font-bold text-2xl">50+</h4>
                <p className="text-sm text-gray-400">Construction Projects</p>
              </div>
            </div>
          </div>
          
          {/* Feature Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 md:h-80 w-full mt-8">
                <Image 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Interior shot 1"
                    fill
                    className="rounded-2xl shadow-lg object-cover"
                />
            </div>
            <div className="relative h-64 md:h-80 w-full">
                <Image 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Interior shot 2"
                    fill
                    className="rounded-2xl shadow-lg object-cover"
                />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12">Meet the Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <TeamMember 
              name="Somsak P." 
              role="CEO & Founder" 
              img="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            />
            
            <TeamMember 
              name="Malaythip V." 
              role="Head of Sales" 
              img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            />
            
            <TeamMember 
              name="David Chen" 
              role="Construction Director" 
              img="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            />
            
            <TeamMember 
              name="Noy Phommasone" 
              role="Legal Consultant" 
              img="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            />

          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for Team Members
function TeamMember({ name, role, img }: { name: string; role: string; img: string }) {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-3/4">
        <Image 
          src={img}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
        />
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-brand-600 text-sm">{role}</p>
    </div>
  );
}