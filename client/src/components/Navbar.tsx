'use client'
import { ROUTES } from "@/Types/Routing"
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export const NavBar = () => {
    const {lang,toggleLanguage} = useLanguage()
    const router = useRouter()

    const t = contentDict[lang] || contentDict.en;
    const isRTL = lang === 'ar';
    return (
        <>
            {/* Changed justify-center to justify-between + added padding axes. 
              items-center aligns the logo, text, and button vertically without hardcoded top margins.
            */}
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
            <div className=" flex items-center gap-4 md:gap-8 text-base md:text-md">
                <div className="hidden md:flex gap-4 md:gap-8">
                <a href={ROUTES.Staff_Signup} className="hover:underline hover:text-[#C5A880] transition-colors font-medium">
                    {t.nav.signup}
                </a>
                
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
      const {lang,toggleLanguage} = useLanguage()
    const router = useRouter()

    const t = contentDict[lang] || contentDict.en;
    const isRTL = lang === 'ar'
    return (
          <>
            {/* Changed justify-center to justify-between + added padding axes. 
              items-center aligns the logo, text, and button vertically without hardcoded top margins.
            */}
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
            <div className=" flex items-center gap-4 md:gap-8 text-base md:text-md">
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
)
}


export const NavBarNoOptions = () => {
    const {lang,toggleLanguage} = useLanguage()
    const router = useRouter()

    const isRTL = lang === 'ar';
    return (
        <>
            {/* Changed justify-center to justify-between + added padding axes. 
              items-center aligns the logo, text, and button vertically without hardcoded top margins.
            */}
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
}
