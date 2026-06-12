import { TranslationKeys } from "@/Types/TranslationKey";

export const contentDict: Record<string, TranslationKeys> = {
  en: {
    nav: { signup: "Parent Sign Up", login: "Parent Login", about: "About" },
    hero: {
      title: "Welcome to the Ministry of Education Portal",
      subtitle: "The unified platform for parents to seamlessly manage, track, and support their children's educational journey.",
      getStarted: "Get Started Now",
      learnMore: "Learn More"
    },
    footer: { rights: "© 2026 Ministry of Education. All rights reserved." },
    aboutTitle: "About Nizam-ID Portal",
    aboutSubtitle: "Secure National Registration & Intake Verification Engine",
    section1Title: "System Purpose",
    section1Desc: "Nizam-ID was built to eliminate manual administrative errors and database bottlenecks within the Egyptian secondary school enrollment cycle. By parsing the 14-digit National Identification Number at the structural level, the platform instantly validates applicant age criteria, determines geographical school routing, and ensures zero human data-entry friction.",
    section2Title: "Security-First Architecture",
    section2Desc: "Unlike generic administration systems vulnerable to simple exploits, Nizam-ID implements a strict Zero-Trust backend. It features native protection against Broken Object Level Authorization (BOLA/IDOR), regex-validated input normalization to prevent injections, and JWT-secured relationship mapping to protect sensitive student records from unauthorized enumeration.",
    techStack: "Core Architecture Stack",
    // 🚀 English Form Fields
    signupForm: {
      subtitle: "Secure citizen enrollment validation terminal",
      labels: {
        fullName: "Full Legal Name",
        nationalId: "National Identification Number (14 Digits)",
        phone: "Mobile Phone Number",
        password: "Account Password",
        confirmPassword: "Confirm Password",
        captcha: "I am not a robot"
      },
      placeholders: {
        fullName: "e.g., Mohamed Ahmed Ali",
        phone: "e.g., 01xxxxxxxxx"
      },
      disclaimer: "By clicking register, you acknowledge that all data entered must conform to official Egyptian Civil Status parameters.",
      submitBtn: "Register Secure Account",
      hasAccount: "Already registered with this platform?"
    },
    loginForm: {
  subtitle: "Identity verification checkpoint",
  labels: {
    nationalId: "National Identification Number (14 Digits)",
    password: "Password",
    rememberMe: "Remember session identity",
    forgotPassword: "Forgot password?"
  },
  submitBtn: "Authorize Secure Login",
  noAccount: "Don't have an administrative account yet?"
}
  },
  ar: {
    nav: { signup: "تسجيل حساب ولي الأمر", login: "تسجيل دخول ولي الأمر", about: "عن المنصة" },
    hero: {
      title: "مرحباً بكم في بوابة وزارة التربية والتعليم",
      subtitle: "المنصة الموحدة لأولياء الأمور لمتابعة وإدارة رحلة أبنائهم التعليمية بكل سهولة ودعمها.",
      getStarted: "ابدأ الآن",
      learnMore: "اقرأ المزيد"
    },
    footer: { rights: "© 2026 وزارة التربية والتعليم. جميع الحقوق محفوظة." },
    aboutTitle: "عن منصة نظام المعرف الموحد",
    aboutSubtitle: "محرك التحقق والتسجيل الوطني الآمن لمنظومة التعليم",
    section1Title: "هدف المنصة",
    section1Desc: "تم تطوير منصة نِظام للقضاء على الأخطاء الإدارية اليدوية وبطء قواعد البيانات في دورة تسجيل الطلاب بالمرحلة الثانوية المصرية. من خلال تحليل الرقم القومي المكون من 14 رقمًا برمجياً بشكل دقيق، تقوم المنصة فوراً بالتحقق من مطابقة السن القانوني وتحديد التوزيع الجغرافي للمدارس، مما يضمن انعدام الأخطاء البشرية تماماً.",
    section2Title: "بنية برمجية محمية أمنياً",
    section2Desc: "بخلاف الأنظمة التقليدية المعرضة للاختراقات، يعتمد نظام نِظام على بنية برمجية صارمة. تتميز المنصة بحماية مدمجة ضد ثغرات التحكم في الصلاحيات (BOLA/IDOR)، وتصفية دقيقة للمدخلات لمنع أي هجمات خبيثة، بالإضافة إلى تشفير البيانات باستخدام بروتوكول JWT لحماية سجلات الطلاب من أي تسريب.",
    techStack: "التقنيات المستخدمة في البنية الأساسية",
    // 🚀 Arabic Form Fields
    signupForm: {
      subtitle: "بوابة تسجيل المواطنين والتحقق من الهوية الرقمية",
      labels: {
        fullName: "الاسم رباعي بالكامل (كما هو في البطاقة)",
        nationalId: "الرقم القومي لولي الأمر (١٤ رقم)",
        phone: "رقم الهاتف المحمول",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        captcha: "أنا لست برنامج روبوت"
      },

      placeholders: {
        fullName: "مثال: محمد أحمد علي",
        phone: "مثال: ٠١xxxxxxxxx"
      },
      disclaimer: "بالضغط على التسجيل، فإنك تقر بصحة جميع البيانات المدخلة ومطابقتها للسجلات الرسمية بقطاع الأحوال المدنية المصري.",
      submitBtn: "إنشاء حساب آمن",
      hasAccount: "لديك حساب مسجل بالفعل؟"
    },
          // Add inside your contentDict.ar object
loginForm: {
  subtitle: "نافذة التحقق من الهوية الرقمية والدخول الآمن",
  labels: {
    nationalId: "الرقم القومي (١٤ رقم)",
    password: "كلمة المرور",
    rememberMe: "تذكر جلسة الدخول",
    forgotPassword: "هل نسيت كلمة المرور؟"
  },
  submitBtn: "تسجيل الدخول الآمن",
  noAccount: "ليس لديك حساب إداري مسجل حتى الآن؟"
},
  }
};