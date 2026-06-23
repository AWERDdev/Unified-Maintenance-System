'use client'
import { ROUTES } from "@/Types/Routing";
import { useRouter } from "next/navigation";
import { NavBarNoOptions } from "@/components/Navbar"; 
import { useLanguage } from "@/tools/LanguageHandler";
import { Fotter2 } from "@/components/Fotter";
import { contentDict } from "@/Dict/Content_DICT";
import { useState } from "react";
import { validate_signup_data } from "@/tools/Form_validation";

export default function StaffSignupPage() {
  // 1. All Required Form State Values
  const [legal_name, setLegalName] = useState("");
  const [national_id, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State variables to handle processing feedback
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { lang } = useLanguage();
  const router = useRouter();

  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  // 2. Automated Request Dispatch Handler
  const request_signup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    setErrorMessage(""); 
    
    // Gather your state values into an object
  const formData = { legal_name, national_id, phone, email, password };

  // Run the validation block
  const validation = validate_signup_data(formData, lang);

  // If client-side validation catches an error, stop immediately and show it
  if (!validation.isValid) {
    setErrorMessage(validation.message);
    return;
  }

    setLoading(true);

    try {
      // Connect to your absolute backend signup route URI
      const response = await fetch("/api/staff/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name,
          national_id,
          phone,
          email,
          password
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        // If the backend returns a custom message (like whitelist errors), use it, 
        // otherwise default to the classic "failed to signup try again later" format
        throw new Error(resData.message || "Failed to signup. Please try again later.");
      }

      // Route to your platform main lander upon successful profile save
      router.push(ROUTES.Main_Page);

   } catch (error: unknown) {
  console.error(`[FRONTEND AUTH ERROR]: ${error}`);
  
  const defaultError = lang === 'ar' 
    ? "فشل في العملية، يرجى المحاولة مرة أخرى لاحقاً" 
    : "Authentication failed, please try again later.";

  if (error instanceof Error) {
    // If the error message looks like a stringified JSON array (common with Zod validation dumps)
    if (error.message.startsWith('[')) {
      try {
        const parsedZod = JSON.parse(error.message);
        // Grab the first validation error message from the array
        setErrorMessage(parsedZod[0]?.message || defaultError);
      } catch {
        setErrorMessage(error.message);
      }
    } else {
      // Standard backend rejection message (e.g., "Invalid National ID or password")
      setErrorMessage(error.message);
    }
  } else {
    setErrorMessage(defaultError);
  }
} finally {
  setLoading(false);
}
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
        
        {/* 1. Portal Navigation Header Bar */}
        <header className="w-full sticky top-0 z-50">
          <NavBarNoOptions />
        </header>

        {/* 2. Centralized Gateway Authentication Frame */}
        <main className="grow flex items-center justify-center px-4 py-12 md:py-20">
          <div className="bg-white w-full max-w-md rounded-lg shadow-md border border-[#E8ECEF] overflow-hidden">
            
            {/* Top Identity Accent Stripe */}
            <div className="h-2 bg-[#0B2545]" />

            {/* Form Headline Header Context */}
            <div className="p-6 md:p-8 text-center border-b border-[#F4F6F9]">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
                {t.nav.signup}
              </h1>
              <p className="text-sm text-[#4A5568]">
                {t.signupForm.subtitle}
              </p>
            </div>

            {/* Dynamic System Error Banner Display Component */}
            {errorMessage && (
              <div className="mx-6 md:mx-8 mt-4 p-3 bg-red-50 border-s-4 border-red-500 text-red-700 text-sm rounded">
                {errorMessage}
              </div>
            )}

            {/* Static Interactive Form Sheet */}
            <form className="p-6 md:p-8 space-y-4 text-start" onSubmit={request_signup}>
              
              {/* Field 1: Full Legal Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.fullName}
                </label>
                <input 
                  type="text" 
                  value={legal_name}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder={t.signupForm.placeholders.fullName}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                  required
                />
              </div>

              {/* Field 2: National ID */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.nationalId}
                </label>
                <input 
                  type="text" 
                  value={national_id}
                  onChange={(e) => setNationalId(e.target.value)}
                  maxLength={14}
                  placeholder="2950101210xxxx"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono tracking-wider"
                  required
                />
              </div>

              {/* Field 3: Mobile Contact Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.phone}
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.signupForm.placeholders.phone}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono"
                  required
                />
              </div>
              
              {/* Field 4: Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.email}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.signupForm.placeholders.phone}
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono"
                  required
                />
              </div>

              {/* Field 5: Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.password}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                  required
                />
              </div>

              {/* Field 6: Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.signupForm.labels.confirmPassword}
                </label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                  required
                />
              </div>

              {/* Legal Framework Terms Disclaimer Acknowledgement */}
              <div className="text-xs text-[#4A5568] leading-relaxed bg-[#F4F6F9] p-3 rounded border border-[#E8ECEF]">
                {t.signupForm.disclaimer}
              </div>

              {/* Form Submission Action Dispatcher Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2545] hover:bg-[#13315C] disabled:bg-[#4A5568] text-white font-bold py-2.5 px-4 rounded-lg transition-all text-sm cursor-pointer shadow-sm"
              >
                {loading ? (lang === 'ar' ? "جاري التسجيل..." : "Registering...") : t.signupForm.submitBtn}
              </button>

              {/* Secondary Navigation Redirect Link */}
              <div className="text-center pt-2 border-t border-[#F4F6F9]">
                <p className="text-xs text-[#4A5568]">
                  {t.signupForm.hasAccount}
                  <a 
                    href={ROUTES.Staff_Login} 
                    className="text-[#B0926A] font-bold hover:underline mx-1 transition-colors"
                  >
                    {t.nav.login}
                  </a>
                </p>
              </div>

            </form>
          </div>
        </main>

        {/* 3. Standard Framework System Footer */}
        <Fotter2 />
      </div>
    </>
  );
}