'use client'
import { ROUTES } from "@/Types/Routing"
import { useRouter } from "next/navigation";
import { NavBarNoOptions } from "@/components/Navbar";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { Fotter2 } from "@/components/Fotter";

export default function ParentLoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  // Safely fallback to English strings if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
        
        {/* 1. Portal Navigation Header Bar */}
        <header className="w-full sticky top-0 z-50">
          <NavBarNoOptions />
        </header>

        {/* 2. Centralized Gateway Authentication Frame */}
        <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20">
          <div className="bg-white w-full max-w-md rounded-lg shadow-md border border-[#E8ECEF] overflow-hidden">
            
            {/* Top Identity Accent Stripe */}
            <div className="h-2 bg-[#0B2545]" />

            {/* Form Headline Header Context */}
            <div className="p-6 md:p-8 text-center border-b border-[#F4F6F9]">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
                {t.nav.login}
              </h1>
              <p className="text-sm text-[#4A5568]">
                {t.loginForm.subtitle}
              </p>
            </div>

            {/* Static Interactive Form Sheet */}
            <form className="p-6 md:p-8 space-y-5 text-start" onSubmit={(e) => e.preventDefault()}>
              
              {/* Field 1: Parent National ID */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.loginForm.labels.nationalId}
                </label>
                <input 
                  type="text" 
                  maxLength={14}
                  placeholder="2950101210xxxx"
                  className="w-full px-4 py-2.5 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono tracking-wider"
                />
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.loginForm.labels.password}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                />
              </div>

              {/* Auxiliary Form Utilities (Remember Me / Forgot Password) */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A5568]">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#0B2545] rounded" />
                  <span>{t.loginForm.labels.rememberMe}</span>
                </label>
                
                <a href="#forgot" className="text-[#B0926A] font-medium hover:underline">
                  {t.loginForm.labels.forgotPassword}
                </a>
              </div>

              {/* Form Submission Action Dispatcher Button */}
              <button 
                type="submit"
                className="w-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold py-3 px-4 rounded-lg transition-all text-sm cursor-pointer shadow-sm"
              >
                {t.loginForm.submitBtn}
              </button>

              {/* Secondary Navigation Redirect Link */}
              <div className="text-center pt-3 border-t border-[#F4F6F9]">
                <p className="text-xs text-[#4A5568] leading-normal">
                  {t.loginForm.noAccount}
                  <a 
                    href={ROUTES.ParentSignup} 
                    className="block sm:inline text-[#B0926A] font-bold hover:underline sm:mx-1 transition-colors mt-1 sm:mt-0"
                  >
                    {t.nav.signup}
                  </a>
                </p>
              </div>

            </form>
          </div>
        </main>

        {/* 3. Standard Framework System Footer */}
        <Fotter2 />
      </div>
    </>
  );
}