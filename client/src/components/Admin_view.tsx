import { AdminViewProps } from "@/Types/tickets";

export const AdminView = ({ tickets, isRTL, onResolve }: AdminViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECEF] shadow-sm overflow-hidden">
      
      {/* Header Container */}
      <div className="p-5 border-b border-[#F4F6F9] bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#13315C]">
            {isRTL ? "متابعة التنفيذ وإكمال أعمال الصيانة" : "Maintenance Execution & Actions"}
          </h2>
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
              <th className="px-6 py-4 text-start">{isRTL ? "الحالة" : "Status"}</th>
              <th className="px-6 py-4 text-start">{isRTL ? "الإجراء الفني" : "Technical Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9] text-[#0A192F]">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-[#B0926A]">{ticket._id}</td>
                <td className="px-6 py-4 font-medium">{ticket.asset}</td>
                <td className="px-6 py-4 text-[#4A5568]">{ticket.room}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    ticket.status === "Resolved" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : ticket.status === "In_Progress" 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {ticket.status === "Resolved" 
                      ? (isRTL ? "تم إصلاحه" : "Resolved") 
                      : ticket.status === "In_Progress" 
                        ? (isRTL ? "قيد الإصلاح" : "In Progress") 
                        : (isRTL ? "بانتظار التمويل" : "Awaiting Funds")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {ticket.status === "In_Progress" && (
                    <button 
                      onClick={() => onResolve(ticket._id)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm transition-colors hover:cursor-pointer"
                    >
                      {isRTL ? "إكمال رصد الإصلاح ✓" : "Mark Resolved ✓"}
                    </button>
                  )}
                  {ticket.status === "Pending_Approval" && (
                    <span className="text-xs text-amber-600 font-medium italic">
                      {isRTL ? "في انتظار موافقة المدير" : "Pending Principal Allocation"}
                    </span>
                  )}
                  {ticket.status === "Resolved" && (
                    <span className="text-xs text-slate-400 font-medium italic">
                      {isRTL ? "مكتمل" : "Completed"}
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