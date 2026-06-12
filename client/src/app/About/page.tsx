'use client'
import { NavBar } from "@/components/Navbar";
import { Fotter } from "@/components/Fotter";
import { contentDict, useLanguage } from "@/tools/LanguageHandler";

export default function AboutPage() {
  const { lang } = useLanguage();
  
  // Safely fallback to English if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
        
        {/* 1. Navbar Container */}
        <header className="w-full sticky top-0 z-50">
          <NavBar /> 
        </header>

        {/* 2. Main Executive Content Body */}
        <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
          
          {/* Header Hero Section */}
          <div className="text-center border-b border-[#E8ECEF] pb-8 mb-10">
            <h1 className="text-4xl font-bold text-[#0B2545] tracking-tight mb-2">
              {t.aboutTitle}
            </h1>
            <p className="text-lg text-[#B0926A] font-medium">
              {t.aboutSubtitle}
            </p>
          </div>

          {/* Two-Column Information Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Box 1: Core System Purpose */}
            <section className="bg-white p-8 rounded-lg shadow-sm border border-[#E8ECEF] text-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏛️</span>
                <h2 className="text-2xl font-bold text-[#13315C]">
                  {t.section1Title}
                </h2>
              </div>
              <p className="text-[#4A5568] leading-relaxed text-base">
                {t.section1Desc}
              </p>
            </section>

            {/* Box 2: Security Highlight (Your Actual Portfolio Flex) */}
            <section className="bg-white p-8 rounded-lg shadow-sm border border-[#E8ECEF] text-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔒</span>
                <h2 className="text-2xl font-bold text-[#13315C]">
                  {t.section2Title}
                </h2>
              </div>
              <p className="text-[#4A5568] leading-relaxed text-base">
                {t.section2Desc}
              </p>
            </section>

          </div>

          {/* Technical Specifications Architecture Badge Footer */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-[#E8ECEF] text-center">
            <h3 className="text-sm font-semibold tracking-wider text-[#4A5568] uppercase mb-4">
              {t.techStack}
            </h3>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-mono font-medium">
              <span className="bg-[#F4F6F9] text-[#0B2545] px-3 py-1.5 rounded border border-[#E8ECEF]">Next.js 14 App Router</span>
              <span className="bg-[#F4F6F9] text-[#0B2545] px-3 py-1.5 rounded border border-[#E8ECEF]">PostgreSQL (Docker Instance)</span>
              <span className="bg-[#F4F6F9] text-[#0B2545] px-3 py-1.5 rounded border border-[#E8ECEF]">Prisma ORM Secure Client</span>
              <span className="bg-[#F4F6F9] text-[#0B2545] px-3 py-1.5 rounded border border-[#E8ECEF]">Tailwind Fluid Layouts</span>
              <span className="bg-[#F4F6F9] text-[#0B2545] px-3 py-1.5 rounded border border-[#E8ECEF]">JWT Cryptographic Sessions</span>
            </div>
          </section>

        </main>
        <Fotter/>
      </div>
    </>
  );
}