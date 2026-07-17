'use client'
import { NavBarNoOptionsAUTH } from "@/components/Navbar";
import { Fotter2 } from "@/components/Fotter";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { isAUTH } from "@/tools/verfiy_user";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/tools/API_handler";
import { ROUTES } from "@/Types/Routing";

type UserProfile = {
  legal_name: string;
  national_id: string;
  phone: string;
  email: string;
  staff_type: string;
  staff_school: string;
  created_at: string;
};

export default function ProfilePage() {
  const { lang } = useLanguage();
  const t = contentDict[lang] || contentDict.en;
  const isRTL = lang === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const authStatus = await isAUTH();

      if (!authStatus.authenticated) {
        window.location.href = ROUTES.Staff_Login;
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/routes/fetch/profile`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          setError(t.profilePage.error);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch {
        setError(t.profilePage.error);
        setLoading(false);
      }
    };

    loadProfile();
  }, [t.profilePage.error]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${BASE_URL}/auth/staff/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch {
      // Proceed with redirect even if the request fails
    }
    window.location.href = ROUTES.Staff_Login;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const profileFields = profile
    ? [
        { label: t.signupForm.labels.fullName, value: profile.legal_name },
        { label: t.signupForm.labels.nationalId, value: profile.national_id },
        { label: t.signupForm.labels.phone, value: profile.phone },
        { label: t.signupForm.labels.email, value: profile.email },
        { label: t.signupForm.labels.selectStaffType, value: profile.staff_type },
        { label: t.profilePage.schoolAffiliation, value: profile.staff_school },
        { label: t.profilePage.memberSince, value: formatDate(profile.created_at) },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-[#4A5568] text-sm font-medium">{t.profilePage.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <header className="w-full sticky top-0 z-50">
        <NavBarNoOptionsAUTH />
      </header>

      <main className="grow max-w-2xl w-full mx-auto px-6 py-12">
        <div className="text-center border-b border-[#E8ECEF] pb-8 mb-8">
          <h1 className="text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
            {t.profilePage.title}
          </h1>
          <p className="text-base text-[#B0926A] font-medium">
            {t.profilePage.subtitle}
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-[#E8ECEF] overflow-hidden">
            <div className="h-2 bg-[#0B2545]" />

            <div className="p-8 space-y-5">
              {profileFields.map((field) => (
                <div key={field.label} className="border-b border-[#E8ECEF] pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-1">
                    {field.label}
                  </p>
                  <p className="text-[#0B2545] font-semibold text-base">
                    {field.value || '—'}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-8 pb-8">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full bg-red-800 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold py-3 px-5 rounded-lg shadow-sm transition-all hover:cursor-pointer"
              >
                {loggingOut ? '...' : t.profilePage.logoutBtn}
              </button>
            </div>
          </div>
        )}
      </main>

      <Fotter2 />
    </div>
  );
}
