
export const  TeacherView = ({ tickets, isRTL }: { tickets:any[], isRTL: boolean }) => {
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