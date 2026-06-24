'use client'
import { useState } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter1 } from "@/components/Fotter";

// Updated Mock Data with explicit technical and funding step tracking
const initialTickets = [
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
  
  // Simulated State for Testing (In production, populate this from your National ID Auth context)
  const [userRole, setUserRole] = useState<"teacher" | "admin" | "principal">("principal");
  const [tickets, setTickets] = useState(initialTickets);

  // Status Handlers
  const handleAdminApprove = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, adminApproved: true, status: t.principalFunded ? "In Progress" : "Pending" } : t));
  };

  const handlePrincipalFund = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, principalFunded: true, status: t.adminApproved ? "In Progress" : "Pending" } : t));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <header className="w-full sticky top-0 z-50">
        <NavBarAUTH />
      </header>

      {/* Role Switcher Toolbar for Development Testing */}
      <div className="bg-slate-800 text-white p-2 text-xs flex gap-4 justify-center items-center">
        <span>Dev Role Switcher:</span>
        <button onClick={() => setUserRole("teacher")} className={`px-2 py-0.5 rounded ${userRole === 'teacher' ? 'bg-blue-600' : 'bg-slate-600'}`}>Teacher</button>
        <button onClick={() => setUserRole("admin")} className={`px-2 py-0.5 rounded ${userRole === 'admin' ? 'bg-blue-600' : 'bg-slate-600'}`}>Admin</button>
        <button onClick={() => setUserRole("principal")} className={`px-2 py-0.5 rounded ${userRole === 'principal' ? 'bg-blue-600' : 'bg-slate-600'}`}>Principal</button>
      </div>

      <main className="grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Dynamic Title Context based on Role */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E8ECEF] pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545]">
              {isRTL ? "لوحة التحكم الموحدة للصيانة" : "Unified School Maintenance Terminal"}
              <span className="text-sm font-normal text-slate-500 block mt-1">
                {userRole === "teacher" && (isRTL ? "منصة المعلم: تقديم البلاغات ومتابعتها" : "Teacher Workspace: Request and Tracking")}
                {userRole === "admin" && (isRTL ? "منصة الفحص الفني: مراجعة واعتماد البلاغات" : "Technical Admin Workspace: Inspection & Engineering Approvals")}
                {userRole === "principal" && (isRTL ? "منصة الإدارة العليا: الميزانية والاعتماد النهائي" : "Principal Workspace: Budgetary Funding & Executive Final Sign-off")}
              </span>
            </h1>
          </div>
          
          {/* Teachers can file tickets directly */}
          {userRole === "teacher" && (
            <button className="bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all self-start md:self-auto">
              {isRTL ? "+ تسجيل بلاغ عطل جديد" : "+ File New Asset Ticket"}
            </button>
          )}
        </div>

        {/* Unified Status Counter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "البلاغات المعلقة" : "Pending Action"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">
                {tickets.filter(t => !t.adminApproved || !t.principalFunded).length}
              </h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "تحت الصيانة (معتمد بالكامل)" : "Under Maintenance"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">
                {tickets.filter(t => t.adminApproved && t.principalFunded && t.status !== "Resolved").length}
              </h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "تمت صيانته" : "Resolved Items"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">
                {tickets.filter(t => t.status === "Resolved").length}
              </h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Context-Specific Module Injection */}
        {userRole === "teacher" && <TeacherView tickets={tickets} isRTL={isRTL} />}
        {userRole === "admin" && <AdminInspectionView tickets={tickets} onApprove={handleAdminApprove} isRTL={isRTL} />}
        {userRole === "principal" && <PrincipalFundingView tickets={tickets} onFund={handlePrincipalFund} isRTL={isRTL} />}

      </main>
      <Fotter1 />
    </div>
  );
}

---

### Component 1: Teacher View
Focuses on tracking statuses and submission feedback transparently.

```tsx
function TeacherView({ tickets, isRTL }: { tickets: any[], isRTL: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#F4F6F9] bg-slate-50">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
          {isRTL ? "بلاغات الأعطال الخاصة بك" : "My Filed Classroom Requests"}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#4A5568] border-b border-[#E8ECEF] text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-start">{isRTL ? "كود البلاغ" : "Ticket ID"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "العنصر" : "Asset"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الموقع" : "Location"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "المراجعة الفنية" : "Technical Inspection"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الاعتماد المالي" : "Financial Approval"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الحالة الإجمالية" : "Overall Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9]">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket.id}</td>
                <td className="px-6 py-4 font-medium">{ticket.asset}</td>
                <td className="px-6 py-4 text-[#4A5568]">{ticket.room}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${ticket.adminApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {ticket.adminApproved ? (isRTL ? "مقبول فنيًا" : "Verified") : (isRTL ? "قيد الفحص فني" : "Pending Assessment")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${ticket.principalFunded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {ticket.principalFunded ? (isRTL ? "تم التمويل" : "Funded") : (isRTL ? "قيد اعتماد الميزانية" : "Awaiting Budget")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    !ticket.adminApproved || !ticket.principalFunded ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isRTL ? (ticket.adminApproved && ticket.principalFunded ? "جاهز للصيانة" : "جاري المراجعة") : (ticket.adminApproved && ticket.principalFunded ? "Ready for Repair" : "In Review pipeline")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}