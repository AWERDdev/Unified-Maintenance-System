'use client'
import { contentDict , useLanguage} from "@/tools/LanguageHandler";

export const Fotter = () =>{
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