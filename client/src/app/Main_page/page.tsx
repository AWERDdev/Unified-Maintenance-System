'use client'
import { useState } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { contentDict } from "@/Dict/Content_DICT";
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter1 } from "@/components/Fotter";

// Mock Data representing localized school asset tickets
const initialTickets = [
  { id: "TK-9402", asset: "مكتب معمل الحاسب الآلي", room: "Lab A", category: "Infrastructure", status: "Pending", date: "2026-06-14", arCategory: "بنية تحتية" },
  { id: "TK-8831", asset: "جهاز عرض الإسقاط (Projector)", room: "Room 302", category: "Hardware", status: "In Progress", date: "2026-06-12", arCategory: "أجهزة برمجية" },
  { id: "TK-7429", asset: "إضاءة غرفة الاختبارات الرئيسية", room: "Main Hall", category: "Electrical", status: "Resolved", date: "2026-06-10", arCategory: "كهرباء" },
];

export default function MainPage() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  const [tickets] = useState(initialTickets);

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
          
          {/* Action Trigger for adding a ticket */}
          <button className="bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all self-start md:self-auto">
            {isRTL ? "+ تسجيل بلاغ عطل جديد" : "+ File New Asset Ticket"}
          </button>
        </div>

        {/* Executive Metric Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "البلاغات المعلقة" : "Pending Action"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">1</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "قيد الإصلاح" : "Under Maintenance"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">1</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "تمت صيانته" : "Resolved Items"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">1</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Real-time Ticket Ledger Data Table */}
        <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F4F6F9] bg-slate-50">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
              {isRTL ? "سجل البلاغات النشطة بالمؤسسة" : "Active School Incident Queue"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="bg-white text-[#4A5568] border-b border-[#E8ECEF] text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 text-start">{isRTL ? "كود البلاغ" : "Ticket ID"}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? "العنصر / العطل" : "Affected Asset"}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? "الموقع" : "Location"}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? "التصنيف" : "Category"}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? "حالة الطلب" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F9] text-[#0A192F]">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket.id}</td>
                    <td className="px-6 py-4 font-medium">{ticket.asset}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{ticket.room}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#F4F6F9] text-[#13315C] text-xs px-2.5 py-1 rounded border border-[#E8ECEF] font-medium">
                        {isRTL ? ticket.arCategory : ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ticket.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isRTL ? (
                          ticket.status === 'Pending' ? 'معلق' :
                          ticket.status === 'In Progress' ? 'جاري العمل' : 'تم الإصلاح'
                        ) : ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Fotter1 />
    </div>
  );
}