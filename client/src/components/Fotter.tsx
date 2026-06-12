'use client'
import {useLanguage} from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";

export const Fotter1 = () =>{
      const { lang } = useLanguage()
  
  // Safely fallback to English if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

    return(
        <>
        <div dir={isRTL ? "rtl" : "ltr"}>
    <footer className="w-full bg-slate-900 text-slate-400 py-6 text-center text-sm border-t border-slate-800">
        <p>{t.footer.rights}</p>
      </footer>
      </div>
        </>
    )
}

export const Fotter2 = () =>{
      const { lang } = useLanguage()
  
  // Safely fallback to English if lang is undefined
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

    return(
        <>
        <div dir={isRTL ? "rtl" : "ltr"}>
  <footer className="w-full bg-white border-t border-[#E8ECEF] py-4 text-center text-xs text-[#4A5568]">
          <p>{t.footer.rights}</p>
        </footer>      
        </div>
        </>
    )
}

