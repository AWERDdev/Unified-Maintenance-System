'use client'
import { ROUTES } from "@/Types/Routing"
import { useRouter } from "next/navigation";
import { NavBarNoOptions } from "@/components/Navbar";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { Fotter2 } from "@/components/Fotter";
import { useState } from "react";
import { validate_login_data } from "@/tools/Form_validation"; // Adjust your import path accordingly
import { BASE_URL } from "@/tools/API_handler";

export default function StaffLoginPage() {
  const [national_id, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { lang } = useLanguage();
  const router = useRouter();

  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  const request_login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = { national_id, password };
    const validation = validate_login_data(formData, lang);

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Invalid credentials.");
      }

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
        
        <header className="w-full sticky top-0 z-50">
          <NavBarNoOptions />
        </header>

        <main className="grow flex items-center justify-center px-4 py-12 md:py-20">
          <div className="bg-white w-full max-w-md rounded-lg shadow-md border border-[#E8ECEF] overflow-hidden">
            
            <div className="h-2 bg-[#0B2545]" />

            <div className="p-6 md:p-8 text-center border-b border-[#F4F6F9]">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
                {t.nav.login}
              </h1>
              <p className="text-sm text-[#4A5568]">
                {t.loginForm.subtitle}
              </p>
            </div>

            {errorMessage && (
              <div className="mx-6 md:mx-8 mt-4 p-3 bg-red-50 border-s-4 border-red-500 text-red-700 text-sm rounded">
                {errorMessage}
              </div>
            )}

            <form className="p-6 md:p-8 space-y-5 text-start" onSubmit={request_login}>
              
              {/* Field 1: National ID */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.loginForm.labels.nationalId}
                </label>
                <input 
                  type="text" 
                  value={national_id}
                  onChange={(e) => setNationalId(e.target.value)}
                  maxLength={14}
                  placeholder="2950101210xxxx"
                  className="w-full px-4 py-2.5 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm font-mono tracking-wider"
                  required
                />
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#13315C]">
                  {t.loginForm.labels.password}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded border border-[#E8ECEF] focus:outline-none focus:border-[#C5A880] bg-[#F4F6F9] text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A5568]">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#0B2545] rounded" />
                  <span>{t.loginForm.labels.rememberMe}</span>
                </label>
                
                <a href="#forgot" className="text-[#B0926A] font-medium hover:underline">
                  {t.loginForm.labels.forgotPassword}
                </a>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B2545] hover:bg-[#13315C] disabled:bg-[#4A5568] text-white font-bold py-3 px-4 rounded-lg transition-all text-sm cursor-pointer shadow-sm"
              >
                {loading ? (lang === 'ar' ? "جاري تسجيل الدخول..." : "Logging in...") : t.loginForm.submitBtn}
              </button>

              <div className="text-center pt-3 border-t border-[#F4F6F9]">
                <p className="text-xs text-[#4A5568] leading-normal">
                  {t.loginForm.noAccount}
                  <a 
                    href={ROUTES.Staff_Signup} 
                    className="block sm:inline text-[#B0926A] font-bold hover:underline sm:mx-1 transition-colors mt-1 sm:mt-0"
                  >
                    {t.nav.signup}
                  </a>
                </p>
              </div>

            </form>
          </div>
        </main>

        <Fotter2 />
      </div>
    </>
  );
}