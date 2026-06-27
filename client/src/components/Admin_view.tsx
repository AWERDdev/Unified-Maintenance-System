import { AdminViewProps } from "@/Types/tickets";

export const AdminView = ({ tickets, isRTL, onApprove }: AdminViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
      
      {/* Header Container with contextual dashboard identifier text */}
      <div className="p-5 border-b border-[#F4F6F9] bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
            {isRTL ? "طلبات الفحص المعملي والهندسي المعلقة" : "Technical Assessment Queue"}
          </h2>
          
          {/* Simple structural role badge text */}
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#0B2545]/10 text-[#0B2545] uppercase tracking-wider">
            {isRTL ? "صلاحية المسؤول الإداري" : "Admin Portal"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#4A5568] border-b border-[#E8ECEF] text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-start">{isRTL ? "كود البلاغ" : "Ticket ID"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "العنصر المستهدف" : "Affected Asset"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الموقع" : "Location"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "حالة الفحص الخاص بك" : "Inspection Status"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الإجراء الفني" : "Technical Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9] text-[#0A192F]">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket.id}</td>
                <td className="px-6 py-4 font-medium">{ticket.asset}</td>
                <td className="px-6 py-4 text-[#4A5568]">{ticket.room}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${ticket.adminApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {ticket.adminApproved ? (isRTL ? "تم تأكيد فحص العطل" : "Specs Verified") : (isRTL ? "بحاجة لمعاينة فنية" : "Awaiting Audit")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {!ticket.adminApproved ? (
                    <button 
                      onClick={() => onApprove(ticket.id)} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm transition-colors hover:cursor-pointer"
                    >
                      {isRTL ? "اعتماد الصيانة فنيًا ✓" : "Approve Technical Validity ✓"}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">
                      {isRTL ? "تم الإرسال للإدارة العليا" : "Sent to Principal Pipeline"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};