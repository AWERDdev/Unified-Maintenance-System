'use client'
import { useState, useEffect } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter1 } from "@/components/Fotter";
import { isAUTH } from "@/tools/verfiy_user,";
import { Ticket } from "@/Types/tickets";

// 1. Importing your modular dashboard views
import { TeacherView } from "@/components/Teacher_view";
import { AdminView } from "@/components/Admin_view";
import { PrincipalView } from "@/components/PrincipalFunding_View";
import { BASE_URL } from "@/tools/API_handler";
import { ROUTES } from "@/Types/Routing";

const initialTickets: Ticket[]= [
  { 
    id: "TK-9402", 
    asset: "مكتب معمل الحاسب الآلي", 
    room: "Lab A", 
    category: "Infrastructure", 
    status: "Pending", 
    date: "2026-06-14", 
    arCategory: "بنية تحتية",
    adminApproved: false,
    principalFunded: false,
    cost: 1500
  },
  { 
    id: "TK-8831", 
    asset: "جهاز عرض الإسقاط (Projector)", 
    room: "Room 302", 
    category: "Hardware", 
    status: "In Progress", 
    date: "2026-06-12", 
    arCategory: "أجهزة برمجية",
    adminApproved: true,
    principalFunded: false,
    cost: 4200
  },
  { 
    id: "TK-7429", 
    asset: "إضاءة غرفة الاختبارات الرئيسية", 
    room: "Main Hall", 
    category: "Electrical", 
    status: "Resolved", 
    date: "2026-06-10", 
    arCategory: "كهرباء",
    adminApproved: true,
    principalFunded: true,
    cost: 600
  },
];

export default function MainPage() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  
  const [tickets, setTickets] = useState(initialTickets);
  const [loading, setLoading] = useState(true);
  const [staffType, setStaffType] = useState<"teacher" | "admin" | "principal">("teacher");
  
  // New state added to hold school metadata context dynamically
  const [schoolName, setSchoolName] = useState<string>("Al-Najah Secondary School");

  useEffect(() => {
    const checkUser = async () => {
      const authStatus = await isAUTH();
      
      if (!authStatus.authenticated) {
        window.location.href = ROUTES.Staff_Login; 
      } else {
        // Dynamic population hook template:
        // if (authStatus.staffType) setStaffType(authStatus.staffType);
        // if (authStatus.schoolName) setSchoolName(authStatus.schoolName);
        
        // Mocking localized names based on setup for demonstration
        setSchoolName(isRTL ? "مدرسة النجاح الثانوية" : "Al-Najah Secondary School");
        setLoading(false);
      }
    };

    checkUser();
  }, [isRTL]);

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const approveTicket = () =>{
    console.log("approved")
  }
  const approveFunding = () =>{
    console.log("approved")
  }

  if (loading) return <div>Checking permissions...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="w-full sticky top-0 z-50">
        <NavBarAUTH />
      </header>

      {/* Main Dashboard Control Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Dashboard Title & Meta Context */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E8ECEF] pb-6 gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545]">
                {isRTL ? "لوحة التحكم في بلاغات صيانة المنشآت" : "Facility Maintenance Escalation Terminal"}
              </h1>
              <p className="text-sm text-[#4A5568] mt-1">
                {isRTL ? "إدارة وتتبع أعطال البنية التحتية والأجهزة داخل المدرسة" : "Track structural failures and hardware ticket lifecycles"}
              </p>
            </div>

            {/* School / Registered Affiliation Badge Element */}
            <div className="inline-flex items-center gap-2 bg-[#EEF2F6] text-[#0B2545] text-xs font-semibold px-3 py-1.5 rounded-md border border-[#E2E8F0]">
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
              <span>
                {isRTL ? `المؤسسة الحالية: ${schoolName}` : `Affiliation: ${schoolName}`}
              </span>
            </div>
          </div>
          
          {/* Action Trigger for adding a ticket */}
          {staffType !== "admin" && (
            <button className="bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all self-start md:self-auto">
              {isRTL ? "+ تسجيل بلاغ عطل جديد" : "+ File New Asset Ticket"}
            </button>
          )}
        </div>

        {/* Executive Metric Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "البلاغات المعلقة" : "Pending Action"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{pendingCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "قيد الإصلاح" : "Under Maintenance"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{inProgressCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "تمت صيانته" : "Resolved Items"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{resolvedCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Conditional Sub-Component Router Interface Segment */}
        <div className="w-full mt-4">
          {staffType === "teacher" && (
            <TeacherView tickets={tickets} isRTL={isRTL} />
          )}
          
          {staffType === "admin" && (
            <AdminView tickets={tickets} isRTL={isRTL} onApprove={approveTicket} />
          )}
          
          {staffType === "principal" && (
            <PrincipalView tickets={tickets} isRTL={isRTL} onFund={approveFunding} />
          )}
        </div>

      </main>

      {/* Footer */}
      <Fotter1 />
    </div>
  );
}