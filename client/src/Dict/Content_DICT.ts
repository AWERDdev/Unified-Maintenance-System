import { TranslationKeys } from "@/Types/TranslationKey";

/**
 * ============================================================================
 * UMES - Unified Maintenance Escalation System (منظومة بلاغات الصيانة الموحدة)
 * Global Localization Dictionary Sheet
 * ============================================================================
 * * Structural Blueprint Layout Guide:
 * 1. Global Navigation Headers & System Triggers
 * 2. Landing Core Hero Information Panel
 * 3. Formal Executive About Page Context Blocks
 * 4. Structural Validation Terminals (Signup / Login Layout Sheets)
 * 5. Global Standard Layout Footers
 */

export const contentDict: Record<string, TranslationKeys> = {
  // --------------------------------------------------------------------------
  // ENGLISH LOCALIZATION ENGINE (LTR DIRECTIONAL BASE)
  // --------------------------------------------------------------------------
  en: {
    // 1. Navigation Header Controls
    nav: { 
      signup: "Staff Registration", 
      login: "Staff Portal Login", 
      about: "Platform Architecture" 
    },
    
    // 2. Landing Frame Hero Interface
    hero: {
      title: "Unified Maintenance Escalation System",
      subtitle: "The centralized digital tracking pipeline designed to monitor physical assets, escalate structural facility failures, and dispatch technical requests across school infrastructure.",
      getStarted: "Access System Dashboard",
      learnMore: "Review System Specifications"
    },
    
    // 3. Technical System Documentation / About Block
    aboutTitle: "About the UMES Platform",
    aboutSubtitle: "Secure National Asset Management & Logistics Escalation Engine",
    section1Title: "Functional Operational Purpose",
    section1Desc: "UMES was developed to eliminate manual administrative paperwork, ledger loss, and structural communication bottlenecks within Egyptian school facilities. By allowing personnel to securely log infrastructure failures directly through their checked accounts, the platform tracks incident priority queues, monitors equipment depreciation records, and streamlines maintenance dispatch times.",
    section2Title: "Zero-Trust System Security Layer",
    section2Desc: "Designed with security at its foundation, the system completely isolates data streams to prevent cross-institution indexing. It features rigid parameter validation bounds against payload injections, comprehensive protection preventing unauthorized access token manipulation, and monospaced session execution verification logging to keep administrative data highly secured.",
    techStack: "Core Architecture Blueprint",
    
    // 4. Secure Account Creation Terminal (Fits your current Signup Form)
    signupForm: {
      subtitle: "Personnel identity verification checkpoint",
      labels: {
        fullName: "Full Legal Name (Matching National ID)",
        nationalId: "National Identification Number (14 Digits)",
        phone: "Official Mobile Number",
        password: "Account Access Password",
        confirmPassword: "Re-enter Security Password",
        selectStaffType: "Select Personnel Classification Role",
        email:""
      },
      placeholders: {
        fullName: "e.g., Ahmed Mohamed Mansour",
        phone: "e.g., 01xxxxxxxxx",
        email:""
      },
      disclaimer: "By confirming registration parameters, you certify that your identity matches the verified personnel register of the educational directorate.",
      submitBtn: "Initialize Secure Account Credentials",
      hasAccount: "Already possess an active personnel profile?",
      select: {
        Teacher_staff_option: "Academic Educator / Teacher / Staff",
        IT_Administrator_option: "IT Infrastructure Admin",
        Principal_option: "School Principal / Executive Director",
        Vice_Principal_option: "School Vice Principal / Operational Director"
      },
      teacher_code: "Official Ministry Teacher Verification Code"
    },
    
    // 5. Authorative Login Access Form (Fits your current Login Form)
    loginForm: {
      subtitle: "Administrative gateway clearance check",
      labels: {
        nationalId: "National Identification Number (14 Digits)",
        password: "System Password",
        rememberMe: "Maintain active session token",
        forgotPassword: "Reset credentials parameters?"
      },
      submitBtn: "Authorize Account Clearance",
      noAccount: "Do not have an authorized profile assigned yet?"
    },

    // 6. Global Layout Footer Elements
    footer: { 
      rights: "© 2026 Unified Maintenance Escalation System. All administrative rights reserved." 
    }
  },

  // --------------------------------------------------------------------------
  // ARABIC LOCALIZATION ENGINE (RTL DIRECTIONAL BASE)
  // --------------------------------------------------------------------------
  ar: {
    // 1. القائمة العلوية والتحكم في النظام
    nav: { 
      signup: "تسجيل الموظفين والإداريين", 
      login: "بوابة دخول الكادر الإداري", 
      about: "مواصفات المنظومة الرقمية" 
    },
    
    // 2. واجهة العرض الرئيسية للمنصة
    hero: {
      title: "منظومة بلاغات الصيانة الموحدة للمدارس",
      subtitle: "المنصة الرقمية المركزية لإدارة العهدة، تتبع الأصول الفيزيائية، وتصعيد بلاغات أعطال البنية التحتية فورياً لتقليص البيروقراطية داخل المؤسسات التعليمية.",
      getStarted: "لوحة التحكم المركزية",
      learnMore: "دليل المواصفات الفنية"
    },
    
    // 3. التوثيق الفني والتعريف بالنظام
    aboutTitle: "عن منظومة البلاغات الرقمية الموحدة",
    aboutSubtitle: "المحرك الوطني الآمن لتتبع الأصول المدرسية وجدولة الإصلاحات العاجلة",
    section1Title: "الهدف والضرورة التشغيلية",
    section1Desc: "تم تطوير هذه المنظومة للقضاء تماماً على المعاملات الورقية التقليدية، وضياع الدفاتر، وتأخر عمليات الإصلاح داخل المنشآت التعليمية المصرية. تتيح المنصة للكادر التعليمي والإداري تسجيل أعطال غرف المعامل والفصول فور حدوثها، مما يضمن تصنيف الأولويات بدقة ومتابعة كفاءة الأجهزة وسرعة استجابة فنيي الصيانة.",
    section2Title: "الحماية الأمنية المتقدمة للهيكل البرمجي",
    section2Desc: "بخلاف الأنظمة التقليدية، تعتمد المنظومة على عزل تام لبيانات المنشآت لمنع التداخل أو تسريب المعلومات الإدارية. تتميز المنصة بآليات تحقق صارمة من هوية المستخدم تمنع التلاعب بالصلاحيات، وتصفية دقيقة للمدخلات البرمجية ضد الاختراقات، مع الاحتفاظ بسجل عمليات مشفر يوضح كافة التحركات الإدارية داخل النظام.",
    techStack: "الهيكل التقني للبنية الأساسية",
    
    // 4. نموذج إنشاء حساب جديد للكادر الإداري والتعليمي
    signupForm: {
      subtitle: "نافذة التحقق من الهوية الرقمية للموظفين",
      labels: {
        fullName: "الاسم رباعي بالكامل (كما هو مدون بالبطاقة الشخصية)",
        nationalId: "الرقم القومي للموظف (١٤ رقم)",
        phone: "رقم الهاتف المحمول المعتمد",
        password: "كلمة مرور الحساب الجديدة",
        confirmPassword: "إعادة تأكيد كلمة المرور المقترحة",
        selectStaffType: "اختر الصفة الوظيفية للكادر الإداري",
        email:""
      },
      placeholders: {
        fullName: "مثال: أحمد محمد منصور",
        phone: "مثال: ٠١xxxxxxxxx",
        email:""
      },
      disclaimer: "بالضغط على إنشاء الحساب، فإنك تقر بأنك موظف مقيد بقطاع التربية والتعليم وأن كافة البيانات المدخلة تطابق السجلات الرسمية للأحوال المدنية.",
      submitBtn: "إنشاء وتسجيل الحساب المعتمد",
      hasAccount: "هل لديك حساب إداري مسجل بالفعل على المنصة؟",
      select: {
        Teacher_staff_option: "معلم / كادر تعليمي / عمال",
        IT_Administrator_option: "مسؤول تطوير تكنولوجي / شبكات",
        Principal_option: "مدير المنشأة التعليمية",
        Vice_Principal_option: "ناظر المدرسة / كادر إداري تشغيلي"
      },
      teacher_code: "كود المعلم الوزاري المعتمد"
    },
    
    // 5. نموذج تسجيل الدخول الآمن للبوابة
    loginForm: {
      subtitle: "بوابة فحص وتدقيق صلاحيات الوصول",
      labels: {
        nationalId: "الرقم القومي (١٤ رقم)",
        password: "كلمة مرور النظام المعينة",
        rememberMe: "الحفاظ على نشاط جلسة الدخول الحالية",
        forgotPassword: "هل نسيت المعرفات السرية الخاصة بك؟"
      },
      submitBtn: "تسجيل الدخول وإصدار التصريح",
      noAccount: "ليس لديك ملف إداري معتمد على المنصة حتى الآن؟"
    },

    // 6. حقوق الطبع والنشر السفلية العامة
    footer: { 
      rights: "© 2026 جميع الحقوق الإدارية والبرمجية محفوظة لمنظومة بلاغات الصيانة الموحدة." 
    }
  }
};