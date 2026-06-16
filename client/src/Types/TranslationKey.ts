// 1. Define a strict TypeScript type for your translations structure
export type TranslationKeys = {
  nav: { signup: string; login: string; about: string };
  hero: { title: string; subtitle: string; getStarted: string; learnMore: string };
  footer: { rights: string };
  aboutTitle: string;
  aboutSubtitle: string;
  section1Title: string;
  section1Desc: string;
  section2Title: string;
  section2Desc: string;
  techStack: string;
  // 🚀 New Signup Form Schema Extensions
  signupForm: {
    subtitle: string;
    labels: {
      fullName: string;
      nationalId: string;
      phone: string;
      password: string;
      confirmPassword: string;
      selectStaffType:string;
      email: string

    };
    placeholders: {
      fullName: string;
      phone: string;
      email:string
    };
    disclaimer: string;
    submitBtn: string;
    hasAccount: string;
    select:{
      Teacher_staff_option:string;
      IT_Administrator_option:string;
      Principal_option:string;
      Vice_Principal_option:string;

    };
    teacher_code:string;

  };
      // Add this inside your TranslationKeys type definition
loginForm: {
  subtitle: string;
  labels: {
    nationalId: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
  };
  submitBtn: string;
  noAccount: string;
};
};