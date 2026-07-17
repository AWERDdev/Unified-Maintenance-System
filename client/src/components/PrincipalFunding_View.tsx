import { PrincipalViewProps } from "@/Types/tickets";

export const PrincipalView = ({ tickets, isRTL, onFund }: PrincipalViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
      
      {/* Header Container */}
      <div className="p-5 border-b border-[#F4F6F9] bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
            {isRTL ? "إدارة اعتمادات الميزانية والصرف" : "Executive Budget Allocations & Funding"}
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#0B2545]/10 text-[#0B2545] uppercase tracking-wider">
            {isRTL ? "صلاحية مدير المدرسة" : "Principal Portal"}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#4A5568] border-b border-[#E8ECEF] text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-start">{isRTL ? "كود البلاغ" : "Ticket ID"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "العنصر" : "Asset"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "موقع العطل" : "Location"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "التكلفة التقديرية" : "Estimated Cost"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "قرار الصرف" : "Disbursement Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9] text-[#0A192F]">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket._id}</td>
                <td className="px-6 py-4 font-medium">{ticket.asset}</td>
                <td className="px-6 py-4 text-[#4A5568]">{ticket.room}</td>
                <td className="px-6 py-4 font-mono font-bold text-[#0B2545]">
                  {ticket.cost ? `${ticket.cost} ${isRTL ? "ج.م" : "EGP"}` : (isRTL ? "غير محدد" : "Unspecified")}
                </td>
                <td className="px-6 py-4">
                  {!ticket.principalFunded ? (
                    <button 
                      onClick={() => onFund(ticket._id)}
                      className="text-xs font-bold py-1.5 px-3 rounded transition-colors text-white bg-[#0B2545] hover:bg-[#13315C] shadow-sm hover:cursor-pointer"
                    >
                      {isRTL ? "الموافقة على صرف الميزانية" : "Approve & Disburse"}
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-block">
                      {isRTL ? "✓ تم تحويل الميزانية" : "✓ Funded"}
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