'use client'
import { ROUTES } from "@/Types/Routing";
import { useRouter } from "next/navigation";
import { NavBarNoOptions } from "@/components/Navbar"; 
import {useLanguage } from "@/tools/LanguageHandler";
import { Fotter2 } from "@/components/Fotter";
import { contentDict } from "@/Dict/Content_DICT";

export default function ParentSignupPage() {
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
        <main className="grow flex items-center justify-center px-4 py-12 md:py-20">
          <div className="bg-white w-full max-w-md rounded-lg shadow-md border border-[#E8ECEF] overflow-hidden">
            
            {/* Top Identity Accent Stripe */}
            <div className="h-2 bg-[#0B2545]" />

            {/* Form Headline Header Context */}
            <div className="p-6 md:p-8 text-center border-b border-[#F4F6F9]">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
                {t.nav.signup}
              </h1>
              <p className="text-sm text-[#4A5568]">
                {t.signupForm.subtitle}
              </p>
            </div>

            {/* Static Interactive Form Sheet */}
            <form className="p-6 md:p-8 space-y-4 text-start" onSubmit={(e) => e.preventDefault()}>
              
              {/* Field 1: Full Legal Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.fullName}
                </label>
                <input 
                  type="text" 
                  placeholder={t.signupForm.placeholders.fullName}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                />
              </div>

              {/* Field 2: National ID */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.nationalId}
                </label>
                <input 
                  type="text" 
                  maxLength={14}
                  placeholder="2950101210xxxx"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono tracking-wider"
                />
              </div>

              {/* Field 3: Mobile Contact Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.phone}
                </label>
                <input 
                  type="tel" 
                  placeholder={t.signupForm.placeholders.phone}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono"
                />
              </div>
              
          <div className="space-y-1">
  <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
    {t.signupForm.labels.selectStaffType}
  </label>
  <select 
    name="Staff_Type" 
    id="Staff_Type" 
    defaultValue=""
    className="w-full h-10 px-4 py-2 text-sm rounded border border-[#E8ECEF] bg-[#F4F6F9] text-[#4A5568] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors cursor-pointer appearance-none"
  >
    <option value="" disabled hidden>
      {isRTL ? "-- اختر الصفة الوظيفية --" : "-- Select Role --"}
    </option>
    <option value="Teacher">
      {t.signupForm.select.Teacher_option}
    </option>
    <option value="IT_Administrator">
      {t.signupForm.select.IT_Administrator_option}
    </option>
    <option value="Principal">
      {t.signupForm.select.Principal_option}
    </option>
  </select>
</div>
              {/* <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.phone}
                </label>
                <input 
                  type="text" 
                  placeholder={t.signupForm.teacher_code}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono"
                />
              </div> */}
              {/* Field 4: Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.password}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                />
              </div>

              {/* Field 5: Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.confirmPassword}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                />
              </div>
              {/* Legal Framework Terms Disclaimer Acknowledgement */}
              <div className="text-xs text-[#4A5568] leading-relaxed bg-[#F4F6F9] p-3 rounded border border-[#E8ECEF]">
                {t.signupForm.disclaimer}
              </div>

              {/* Form Submission Action Dispatcher Button */}
              <button 
                type="submit"
                className="w-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold py-2.5 px-4 rounded-lg transition-all text-sm cursor-pointer shadow-sm"
                onClick={()=>{router.push(ROUTES.Main_Page)}}
              >
                {t.signupForm.submitBtn}
              </button>

              {/* Secondary Navigation Redirect Link */}
              <div className="text-center pt-2 border-t border-[#F4F6F9]">
                <p className="text-xs text-[#4A5568]">
                  {t.signupForm.hasAccount}
                  <a 
                    href={ROUTES.Staff_Login} 
                    className="text-[#B0926A] font-bold hover:underline mx-1 transition-colors"
                  >
                    {t.nav.login}
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