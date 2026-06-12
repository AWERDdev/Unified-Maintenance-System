import { useState, useEffect } from "react";

export const useLanguage = () => {
    const [lang, setLang] = useState("en");

    // Synchronize state with the DOM on mount
    useEffect(() => {
        const currentLang = document.documentElement.getAttribute("lang") || "en";
        const timer = setTimeout(() => {
            if (currentLang !== lang) {
                setLang(currentLang);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [lang]);

    const toggleLanguage = () => {
        if (lang === "en") {
            document.documentElement.setAttribute("dir", "rtl");
            document.documentElement.setAttribute("lang", "ar");
            setLang("ar");
        } else {
            document.documentElement.setAttribute("dir", "ltr");
            document.documentElement.setAttribute("lang", "en");
            setLang("en");
        }
    };

    // Return both the current language string and the toggle function
    return { lang, toggleLanguage };
};

// 1. Define a strict TypeScript type for your translations structure
export type TranslationKeys = {
  nav: {
    signup: string;
    login: string;
    about: string;
  };
  hero: {
    title: string;
    subtitle: string;
    getStarted: string;
    learnMore: string;
  };
  footer: {
    rights: string;
  };
};

// 2. Create the static content dictionary mapping strings to the type
export const contentDict: Record<string, TranslationKeys> = {
  en: {
    nav: {
      signup: "Parent Sign Up",
      login: "Parent Login",
      about: "About"
    },
    hero: {
      title: "Welcome to the Ministry of Education Portal",
      subtitle: "The unified platform for parents to seamlessly manage, track, and support their children's educational journey.",
      getStarted: "Get Started Now",
      learnMore: "Learn More"
    },
    footer: {
      rights: "© 2026 Ministry of Education. All rights reserved."
    }
  },
  ar: {
    nav: {
      signup: "تسجيل حساب ولي الأمر",
      login: "تسجيل دخول ولي الأمر",
      about: "عن المنصة"
    },
    hero: {
      title: "مرحباً بكم في بوابة وزارة التربية والتعليم",
      subtitle: "المنصة الموحدة لأولياء الأمور لمتابعة وإدارة رحلة أبنائهم التعليمية بكل سهولة ودعمها.",
      getStarted: "ابدأ الآن",
      learnMore: "اقرأ المزيد"
    },
    footer: {
      rights: "© 2026 وزارة التربية والتعليم. جميع الحقوق محفوظة."
    }
  }
};