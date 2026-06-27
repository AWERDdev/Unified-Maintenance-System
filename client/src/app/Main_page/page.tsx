'use client'
import { useState, useEffect } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter1 } from "@/components/Fotter";
import { isAUTH } from "@/tools/verfiy_user,";
import { Ticket } from "@/Types/tickets";
import {ROUTES} from "@/Types/Routing"

// 1. Importing your modular dashboard views
// Adjust paths based on your actual file architecture
import { TeacherView } from "@/components/Teacher_view";
import { AdminView } from "@/components/Admin_view";
import { PrincipalView } from "@/components/PrincipalFunding_View";
import { BASE_URL } from "@/tools/API_handler";

// Localized school asset data setup inside localized state tracking
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
  
  // Set up tickets state so updates reflect instantly in metric cards
  const [tickets, setTickets] = useState(initialTickets);
  const [loading, setLoading] = useState(true);

  // 2. State management for the user profile routing rule
  // Valid roles: 'teacher' | 'admin' | 'principal'
  const [staffType, setStaffType] = useState<"staff" | "teacher" | "admin" | "principal">("teacher");

  useEffect(() => {
    const checkUser = async () => {
      const authStatus = await isAUTH();
      
      if (!authStatus.authenticated) {
        window.location.href = ROUTES.Staff_Login; 
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 3. Dynamic metric computations based on the reactive state array
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545]">
              {isRTL ? "لوحة التحكم في بلاغات صيانة المنشآت" : "Facility Maintenance Escalation Terminal"}
            </h1>
            <p className="text-sm text-[#4A5568] mt-1">
              {isRTL ? "إدارة وتتبع أعطال البنية التحتية والأجهزة داخل المدرسة" : "Track structural failures and hardware ticket lifecycles"}
            </p>
          </div>
          
          {/* Action Trigger for adding a ticket (Hidden for Admins who only review) */}
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

        {/* 4. Conditional Sub-Component Router Interface Segment */}
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