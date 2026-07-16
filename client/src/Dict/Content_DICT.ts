import { TranslationKeys } from "@/Types/TranslationKey";

/**
 * ============================================================================
 * UMES - Unified Maintenance Escalation System (منظومة بلاغات الصيانة الموحدة)
 * Global Localization Dictionary Sheet
 * ============================================================================
 */

export const contentDict: Record<string, TranslationKeys> = {
  // --------------------------------------------------------------------------
  // ENGLISH LOCALIZATION ENGINE (LTR DIRECTIONAL BASE)
  // --------------------------------------------------------------------------
  en: {
    // 1. Navigation Header Controls
    nav: { 
      signup: "Sign Up", 
      login: "Login", 
      about: "About",
      profile: "Profile"
    },
    
    // 2. Landing Frame Hero Interface
    hero: {
      title: "Unified Maintenance Escalation System",
      subtitle: "A simple, centralized platform to report school maintenance issues, track infrastructure problems, and dispatch technical requests quickly.",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    
    // 3. Technical System Documentation / About Block
    aboutTitle: "About UMES",
    aboutSubtitle: "Fast, secure, and reliable school asset and maintenance tracking",
    section1Title: "Why UMES?",
    section1Desc: "UMES was built to replace slow paperwork and lost logs in Egyptian schools. School staff can easily report maintenance issues as they happen, helping maintenance teams prioritize requests and fix problems faster.",
    section2Title: "Built-In Security",
    section2Desc: "We take data privacy seriously. The platform keeps school data separated, secures your login credentials, prevents unauthorized access, and maintains secure logs to keep school information safe.",
    techStack: "Tech Stack & Architecture",
    
    // 4. Account Creation Form
    signupForm: {
      subtitle: "Create your staff account",
      labels: {
        fullName: "Full Name (as on your National ID)",
        nationalId: "National ID (14 digits)",
        phone: "Mobile Number",
        password: "Password",
        confirmPassword: "Confirm Password",
        selectStaffType: "Select Your Role",
        email: "Ministry Email Address"
      },
      placeholders: {
        fullName: "e.g., Ahmed Mohamed Mansour",
        phone: "e.g., 01xxxxxxxxx",
        email: "username@moe.edu.eg"
      },
      disclaimer: "By signing up, you confirm that you are a registered employee under the Ministry of Education and that your details are accurate.",
      submitBtn: "Create Account",
      hasAccount: "Already have an account?",
      select: {
        Teacher_staff_option: "Teacher / Staff Member",
        IT_Administrator_option: "IT Administrator",
        Principal_option: "School Principal",
        Vice_Principal_option: "Vice Principal"
      },
      teacher_code: "Ministry Teacher Code"
    },
    
    // 5. Login Access Form
    loginForm: {
      subtitle: "Log in to your account",
      labels: {
        nationalId: "National ID (14 digits)",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?"
      },
      submitBtn: "Log In",
      noAccount: "Don't have an account yet?"
    },

    profilePage: {
      title: "My Profile",
      subtitle: "Your verified account and school details",
      logoutBtn: "Log Out",
      loading: "Loading your profile...",
      error: "Couldn't load profile. Please try again.",
      memberSince: "Member Since",
      schoolAffiliation: "School / Institution"
    },

    // 6. Global Layout Footer Elements
    footer: { 
      rights: "© 2026 Unified Maintenance Escalation System. All rights reserved." 
    }
  },

  // --------------------------------------------------------------------------
  // ARABIC LOCALIZATION ENGINE (RTL DIRECTIONAL BASE)
  // --------------------------------------------------------------------------
  ar: {
    // 1. القائمة العلوية والتحكم في النظام
    nav: { 
      signup: "إنشاء حساب", 
      login: "تسجيل الدخول", 
      about: "عن المنظومة",
      profile: "الملف الشخصي"
    },
    
    // 2. واجهة العرض الرئيسية للمنصة
    hero: {
      title: "منظومة بلاغات الصيانة الموحدة",
      subtitle: "منصة رقمية سهلة وموحدة للإبلاغ عن أعطال المدارس، وتتبع المشاكل، وإرسال طلبات الصيانة بشكل سريع ومباشر.",
      getStarted: "ابدأ الآن",
      learnMore: "اعرف المزيد"
    },
    
    // 3. التوثيق الفني والتعريف بالنظام
    aboutTitle: "عن منظومة UMES",
    aboutSubtitle: "نظام آمن وسريع لتتبع وإصلاح أعطال المنشآت التعليمية",
    section1Title: "لماذا تم تطوير المنظومة؟",
    section1Desc: "تم تصميم هذه المنصة للتخلص من المعاملات الورقية التقليدية وضياع دفاتر الصيانة في المدارس المصرية. تتيح المنظومة للمعلمين والإداريين الإبلاغ عن أي عطل فور حدوثه، مما يساعد فريق الصيانة على تحديد الأولويات وسرعة الاستجابة.",
    section2Title: "أمان كامل لبياناتك",
    section2Desc: "نهتم بخصوصية وأمان بيانات المدارس، حيث تعتمد المنظومة على عزل البيانات لحماية الخصوصية، وتأمين حسابات المستخدمين لمنع الوصول غير المصرح به، مع تسجيل آمن لكل العمليات لضمان حماية المعلومات.",
    techStack: "البنية البرمجية والتقنيات المستخدمة",
    
    // 4. نموذج إنشاء حساب جديد للكادر الإداري والتعليمي
    signupForm: {
      subtitle: "إنشاء حساب جديد للموظفين",
      labels: {
        fullName: "الاسم رباعي (كما هو في بطاقة الرقم القومي)",
        nationalId: "الرقم القومي (١٤ رقم)",
        phone: "رقم الموبايل",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        selectStaffType: "اختر الصفة الوظيفية",
        email: "البريد الإلكتروني الوزاري"
      },
      placeholders: {
        fullName: "مثال: أحمد محمد منصور",
        phone: "مثال: ٠١xxxxxxxxx",
        email: "username@moe.edu.eg"
      },
      disclaimer: "بالضغط على إنشاء الحساب، فإنك تؤكد أنك موظف مقيد بوزارة التربية والتعليم وأن كافة البيانات المدخلة صحيحة.",
      submitBtn: "إنشاء حساب",
      hasAccount: "لديك حساب بالفعل؟",
      select: {
        Teacher_staff_option: "معلم / كادر تعليمي / عامل",
        IT_Administrator_option: "مسؤول تطوير تكنولوجي",
        Principal_option: "مدير المدرسة",
        Vice_Principal_option: "وكيل المدرسة"
      },
      teacher_code: "كود المعلم"
    },
    
    // 5. نموذج تسجيل الدخول الآمن للبوابة
    loginForm: {
      subtitle: "تسجيل الدخول إلى حسابك",
      labels: {
        nationalId: "الرقم القومي (١٤ رقم)",
        password: "كلمة المرور",
        rememberMe: "تذكرني على هذا الجهاز",
        forgotPassword: "نسيت كلمة المرور؟"
      },
      submitBtn: "تسجيل الدخول",
      noAccount: "ليس لديك حساب بعد؟"
    },

    profilePage: {
      title: "ملفي الشخصي",
      subtitle: "بيانات الحساب والمدرسة المسجلة في النظام",
      logoutBtn: "تسجيل الخروج",
      loading: "جاري تحميل بيانات الملف الشخصي...",
      error: "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.",
      memberSince: "تاريخ التسجيل",
      schoolAffiliation: "المدرسة / الجهة التابع لها"
    },

    // 6. حقوق الطبع والنشر السفلية العامة
    footer: { 
      rights: "© 2026 جميع الحقوق محفوظة لمنظومة بلاغات الصيانة الموحدة." 
    }
  }
};