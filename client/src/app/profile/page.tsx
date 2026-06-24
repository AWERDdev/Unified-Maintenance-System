'use client'
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter2} from "@/components/Fotter";
import {useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { isAUTH } from "@/tools/verfiy_user,";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const { lang } = useLanguage();
  
  // Safely fallback to English if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';
  
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkUser = async () => {
        const authStatus = await isAUTH();
        
        if (!authStatus.authenticated) {
          // If the tool says false, instantly kick them to sign up
          window.location.href = '/signup'; 
        } else {
          // Otherwise, turn off the loading state and let them see the page
          setLoading(false);
        }
      };
  
      checkUser();
    }, []);

if (loading) return <div>Checking permissions...</div>;
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