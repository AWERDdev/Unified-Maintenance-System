import { useState, useEffect } from "react";

export const useLanguage = () => {
    // 1. Initialize with a safe default. 
    // Never read localStorage/document in the initial state initialization;
    // doing so directly triggers hydration mismatches.
    const [lang, setLang] = useState<string>("en");
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {

        // Read saved preference from localStorage, falling back to document attribute or 'en'
        const savedLang = localStorage.getItem("umes_lang") || 
                          document.documentElement.getAttribute("lang") || 
                          "en";
        
        const dir = savedLang === "ar" ? "rtl" : "ltr";
        
        // Sync document attributes on initial load
        document.documentElement.setAttribute("lang", savedLang);
        document.documentElement.setAttribute("dir", dir);
        
        const timer = setTimeout(() => {
            setMounted(true);
            setLang(savedLang);
        }, 0);

        // Listen for language changes dispatched by other active instances of this hook
        const handleLangChange = () => {
            const updatedLang = localStorage.getItem("umes_lang") || "en";
            setLang(updatedLang);
        };

        window.addEventListener("langChanged", handleLangChange);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener("langChanged", handleLangChange);
        };
        
    }, []);

    const toggleLanguage = () => {
        const nextLang = lang === "en" ? "ar" : "en";
        const nextDir = nextLang === "ar" ? "rtl" : "ltr";

        // Persist the selection to localStorage so it survives page reloads/clicks
        localStorage.setItem("umes_lang", nextLang);

        // Update DOM attributes
        document.documentElement.setAttribute("dir", nextDir);
        document.documentElement.setAttribute("lang", nextLang);
        setLang(nextLang);

        // Notify other components
        window.dispatchEvent(new Event("langChanged"));
    };

    return { 
        // Force English during SSR/Hydration to match the server-rendered HTML.
        // Once mounted is true, return the actual chosen language safely.
        lang: mounted ? lang : "en", 
        toggleLanguage,
        mounted 
    };
};