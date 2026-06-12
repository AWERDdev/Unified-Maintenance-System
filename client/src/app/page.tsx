'use client'
import {ROUTES} from "@/Types/Routing"
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/Navbar";
import { contentDict , useLanguage} from "@/tools/LanguageHandler";
import { Fotter } from "@/components/Fotter";
const IntroPage = () => {
  const router = useRouter()
  const { lang } = useLanguage()
  
  // Safely fallback to English if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  return (
    // "dir" handles bidirectional layout flow natively across all elements
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* 1. Navbar Container */}
      <header className="w-full sticky top-0 z-50">
        <NavBar /> 
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-16 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Hero Text content Column */}
          <div className="space-y-6 text-center lg:text-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B2545] leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={() => router.push(ROUTES.ParentSignup)}
                className="bg-[#0B2545] text-white font-semibold text-lg px-8 py-3.5 rounded-lg shadow-md hover:bg-[#13355e] transition-all duration-200 cursor-pointer"
              >
                {t.hero.getStarted}
              </button>
              <button 
                onClick={() => router.push(ROUTES.About)}
                className="border-2 border-[#0B2545] text-[#0B2545] font-semibold text-lg px-8 py-3.5 rounded-lg hover:bg-[#0B2545] hover:text-white transition-all duration-200 cursor-pointer"
              >
                {t.hero.learnMore}
              </button>
            </div>
          </div>

          {/* Graphical/Illustrative Column */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-80 md:h-[400px] bg-gradient-to-tr from-[#0B2545] to-[#1d4474] rounded-2xl shadow-xl flex items-center justify-center p-8 overflow-hidden">
              {/* Decorative accent layers background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880] opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              
              {/* Center icon graphic placeholder */}
              <div className="text-center text-white z-10 space-y-4">
                <div className="text-6xl">🏛️</div>
                <div className="w-24 h-1 bg-[#C5A880] mx-auto rounded-full"></div>
                <p className="text-sm uppercase tracking-widest text-[#C5A880] font-medium">Ministry Of Education</p>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* 3. Global Footer */}
      <Fotter/>
    </div>
  );
}

export default IntroPage;