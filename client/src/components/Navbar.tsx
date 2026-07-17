'use client';

import { ROUTES } from "@/Types/Routing";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

export const NavBar = () => {
  const { lang, toggleLanguage } = useLanguage();
  const router = useRouter();

  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  return (
    <>
      <nav 
        className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md w-full bg-[#0B2545] text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo Area */}
        <div className="logo flex items-center">
          <Image
            src='/android-chrome-512x512.png'
            alt="Ministry Of Education Logo" 
            width={50} 
            height={50}
            className="hover:cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push('/')}
          />
        </div>
        
        {/* Navigation options & language actions wrapper */}
        <div className="flex items-center gap-4 md:gap-8 text-base md:text-md">
          <div className="hidden md:flex gap-4 md:gap-8">
            <a href={ROUTES.Staff_Login} className="hover:underline hover:text-[#C5A880] transition-colors font-medium">
              {t.nav.login}
            </a>
            
            <a href={ROUTES.About} className="hover:underline hover:text-[#C5A880] transition-colors font-medium">
              {t.nav.about}
            </a>
          </div>

          {/* Universal Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2545] font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
      </nav>
    </>
  );
};

export const NavBarAUTH = () => {
  const { lang, toggleLanguage } = useLanguage();
  const router = useRouter();

  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  return (
    <>
      <nav 
        className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md w-full bg-[#0B2545] text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo Area */}
        <div className="logo flex items-center">
          <Image
            src='/android-chrome-512x512.png'
            alt="Ministry Of Education Logo" 
            width={50} 
            height={50}
            className="hover:cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push(ROUTES.Main_Page)}
          />
        </div>
        
        {/* Navigation options & language actions wrapper */}
        <div className="flex items-center gap-4 md:gap-8 text-base md:text-md">
          <div className="hidden md:flex gap-4 md:gap-8">
            <a href={ROUTES.Profile} className="hover:underline hover:text-[#C5A880] transition-colors font-medium">
              {t.nav.profile}
            </a>
          </div>

          {/* Universal Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2545] font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
      </nav>
    </>
  );
};

export const NavBarNoOptions_login = () => {
  const { lang, toggleLanguage } = useLanguage();
  const router = useRouter();

  const isRTL = lang === 'ar';
 
  const t = contentDict[lang] || contentDict.en;

  return (
    <>
      <nav 
        className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md w-full bg-[#0B2545] text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo Area */}
        <div className="logo flex items-center">
          <Image
            src='/android-chrome-512x512.png'
            alt="Ministry Of Education Logo" 
            width={50} 
            height={50}
            className="hover:cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push(ROUTES.IntroPage)}
          />
        </div>
        
        {/* Navigation options & language actions wrapper */}
        <div className="flex items-center gap-3 md:gap-4 text-base md:text-md">      
          {/* Universal Language Switcher Button */}
           <a href={ROUTES.Staff_Login} className="hover:underline hover:text-[#C5A880] transition-colors font-medium">
              {t.nav.login}
            </a>
          <button 
            onClick={toggleLanguage}
            className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2545] font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>

          {/* Styled Back Button (matching primary theme colors) */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-[#0B2545] bg-[#13315C] hover:bg-[#C5A880] border border-transparent rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#C5A880] hover:cursor-pointer"
          >
            <span>{lang === "en" ? "Back" : "الرجوع"}</span>
            <div className="transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180">
              <MoveRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};

export const NavBarNoOptionsAUTH = () => {
  const { lang, toggleLanguage } = useLanguage();
  const router = useRouter();

  const isRTL = lang === 'ar';

  return (
    <>
      <nav 
        className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md w-full bg-[#0B2545] text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo Area */}
        <div className="logo flex items-center">
          <Image
            src='/android-chrome-512x512.png'
            alt="Ministry Of Education Logo" 
            width={50} 
            height={50}
            className="hover:cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push(ROUTES.Main_Page)}
          />
        </div>
        
        {/* Navigation options & language actions wrapper */}
        <div className="flex items-center gap-3 md:gap-4 text-base md:text-md">      
          {/* Universal Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2545] font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>

          {/* Styled Back Button (matching primary theme colors) */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-[#0B2545] bg-[#13315C] hover:bg-[#C5A880] border border-transparent rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#C5A880] hover:cursor-pointer"
          >
            <span>{lang === "en" ? "Back" : "الرجوع"}</span>
            <div className="transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180">
              <MoveRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};


export const NavBarNoOptions = () => {
  const { lang, toggleLanguage } = useLanguage();
  const router = useRouter();

  const isRTL = lang === 'ar';

  return (
    <>
      <nav 
        className="flex justify-between items-center px-6 md:px-12 py-4 shadow-md w-full bg-[#0B2545] text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo Area */}
        <div className="logo flex items-center">
          <Image
            src='/android-chrome-512x512.png'
            alt="Ministry Of Education Logo" 
            width={50} 
            height={50}
            className="hover:cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push(ROUTES.IntroPage)}
          />
        </div>
        
        {/* Navigation options & language actions wrapper */}
        <div className="flex items-center gap-3 md:gap-4 text-base md:text-md">      
          {/* Universal Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B2545] font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>

          {/* Styled Back Button (matching primary theme colors) */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-[#0B2545] bg-[#13315C] hover:bg-[#C5A880] border border-transparent rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#C5A880] hover:cursor-pointer"
          >
            <span>{lang === "en" ? "Back" : "الرجوع"}</span>
            <div className="transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180">
              <MoveRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};