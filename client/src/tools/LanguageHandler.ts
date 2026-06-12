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

// ... keep your TranslationKeys type and contentDict object exactly the same below ...

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
  aboutTitle: string;
  aboutSubtitle: string;
  section1Title: string;
  section1Desc: string;
  section2Title: string;
  section2Desc: string;
  techStack: string;
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
    },
    aboutTitle: "About Nizam-ID Portal",
    aboutSubtitle: "Secure National Registration & Intake Verification Engine",
    section1Title: "System Purpose",
    section1Desc: "Nizam-ID was built to eliminate manual administrative errors and database bottlenecks within the Egyptian secondary school enrollment cycle. By parsing the 14-digit National Identification Number at the structural level, the platform instantly validates applicant age criteria, determines geographical school routing, and ensures zero human data-entry friction.",
    section2Title: "Security-First Architecture",
    section2Desc: "Unlike generic administration systems vulnerable to simple exploits, Nizam-ID implements a strict Zero-Trust backend. It features native protection against Broken Object Level Authorization (BOLA/IDOR), regex-validated input normalization to prevent injections, and JWT-secured relationship mapping to protect sensitive student records from unauthorized enumeration.",
    techStack: "Core Architecture Stack"
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
    },
    aboutTitle: "عن منصة نظام المعرف الموحد",
    aboutSubtitle: "محرك التحقق والتسجيل الوطني الآمن لمنظومة التعليم",
    section1Title: "هدف المنصة",
    section1Desc: "تم تطوير منصة نِظام للقضاء على الأخطاء الإدارية اليدوية وبطء قواعد البيانات في دورة تسجيل الطلاب بالمرحلة الثانوية المصرية. من خلال تحليل الرقم القومي المكون من 14 رقمًا برمجياً بشكل دقيق، تقوم المنصة فوراً بالتحقق من مطابقة السن القانوني وتحديد التوزيع الجغرافي للمدارس، مما يضمن انعدام الأخطاء البشرية تماماً.",
    section2Title: "بنية برمجية محمية أمنياً",
    section2Desc: "بخلاف الأنظمة التقليدية المعرضة للاختراقات، يعتمد نظام نِظام على بنية برمجية صارمة. تتميز المنصة بحماية مدمجة ضد ثغرات التحكم في الصلاحيات (BOLA/IDOR)، وتصفية دقيقة للمدخلات لمنع أي هجمات خبيثة، بالإضافة إلى تشفير البيانات باستخدام بروتوكول JWT لحماية سجلات الطلاب من أي تسريب.",
    techStack: "التقنيات المستخدمة في البنية الأساسية"
  }
};