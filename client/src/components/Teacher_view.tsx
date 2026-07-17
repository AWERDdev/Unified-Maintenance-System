import { TeacherViewProps } from "@/Types/tickets";

export const TeacherView = ({ tickets, isRTL }: TeacherViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
      
      {/* Header Container with contextual dashboard identifier text */}
      <div className="p-5 border-b border-[#F4F6F9] bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
            {isRTL ? "سجل بلاغات الأعطال الخاصة بك" : "Personal Asset Maintenance Registry"}
          </h2>
          
          {/* Simple structural role badge text */}
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#0B2545]/10 text-[#0B2545] uppercase tracking-wider">
            {isRTL ? "صلاحية المعلم" : "Teacher Portal"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-sm">
          {/* Table Headers */}
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
          {/* Table Body */}
          <tbody className="divide-y divide-[#F4F6F9] text-[#0A192F]">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket._id}</td>
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
};