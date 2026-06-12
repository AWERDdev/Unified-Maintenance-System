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
      captcha: string;
    };
    placeholders: {
      fullName: string;
      phone: string;
    };
    disclaimer: string;
    submitBtn: string;
    hasAccount: string;
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