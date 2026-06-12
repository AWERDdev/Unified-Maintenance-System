import { useState, useEffect } from "react";

export const useLanguage = () => {
    const [lang, setLang] = useState<string>("en");

    useEffect(() => {
        // Read initial state safely from the root HTML element
        const currentLang = document.documentElement.getAttribute("lang") || "en";
        setTimeout(()=>{
          setLang(currentLang);
        },0)
        

        // Listen for language changes dispatched by other instances of this hook
        const handleLangChange = () => {
            const updatedLang = document.documentElement.getAttribute("lang") || "en";
            setLang(updatedLang);
        };

        window.addEventListener("langChanged", handleLangChange);
        return () => window.removeEventListener("langChanged", handleLangChange);
    }, []);

    const toggleLanguage = () => {
        const nextLang = lang === "en" ? "ar" : "en";
        const nextDir = nextLang === "ar" ? "rtl" : "ltr";

        document.documentElement.setAttribute("dir", nextDir);
        document.documentElement.setAttribute("lang", nextLang);
        setLang(nextLang);

        // Dispatch a global native event so all other active components instantly sync up
        window.dispatchEvent(new Event("langChanged"));
    };

    return { lang, toggleLanguage };
};