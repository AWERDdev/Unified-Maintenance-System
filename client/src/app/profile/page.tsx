'use client'
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter2} from "@/components/Fotter";
import {useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";

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
          <NavBarAUTH /> 
        </header>

        {/* 2. Main Executive Content Body */}
        <main className="grow max-w-5xl w-full mx-auto px-6 py-12">
          
         

        </main>
        <Fotter2/>
      </div>
    </>
  );
}