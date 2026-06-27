'use client'
import { useState } from "react";
import { useLanguage } from "@/tools/LanguageHandler";

// Type definition matching your structural schema
interface NewTicket {
  id: string;
  asset: string;
  room: string;
  category: "Infrastructure" | "Hardware" | "Electrical" | "Plumbing";
  status: "Pending";
  date: string;
  arCategory: string;
  adminApproved: boolean;
  principalFunded: boolean;
  cost: number;
}

export default function CreateTicketPage() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  // Form input states
  const [asset, setAsset] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState<NewTicket["category"]>("Infrastructure");
  const [cost, setCost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Translation Map for structural automatic data generation
  const categoryMap: Record<NewTicket["category"], string> = {
    Infrastructure: "بنية تحتية",
    Hardware: "أجهزة برمجية وكيانات مادية",
    Electrical: "كهرباء",
    Plumbing: "سباكة وصرف صحي",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset || !room) return alert(isRTL ? "برجاء ملء الحقول الإلزامية" : "Please fill out all mandatory fields");

    setIsSubmitting(true);

    // 1. Generate fully structured data payload matching your interface exactly
    const ticketPayload: NewTicket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`, // Generates random 4-digit token
      asset,
      room,
      category,
      status: "Pending",
      date: new Date().toISOString().split('T')[0], // Automatically tracks current calendar date
      arCategory: categoryMap[category], // Structural mapping
      adminApproved: false, // Core administrative constraint defaults
      principalFunded: false,
      cost: Number(cost) || 0,
    };

    try {
      // 2. Insert your backend fetch request handler here:
      // const response = await fetch('/api/tickets', { method: 'POST', body: JSON.stringify(ticketPayload) });
      
      console.log("Structured Ticket Payload Saved Successfully:", ticketPayload);
      
      // Temporary Success Feedback Loop Clear
      alert(isRTL ? "تم تسجيل بلاغ العطل بنجاح في المنظومة" : "Maintenance ticket logged successfully in tracking matrix.");
      setAsset("");
      setRoom("");
      setCost(0);
    } catch (error) {
      console.error("Transmission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E8ECEF] shadow-sm overflow-hidden">
        
        {/* Decorative Brand Accent Header */}
        <div className="bg-[#0B2545] p-6 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold">
            {isRTL ? "تسجيل بلاغ عطل / صيانة منشآت" : "File Infrastructure Incident Report"}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5">
            {isRTL ? "إرسال تقرير فني مباشر للإدارة المدرسية والمراجعة المالية" : "Submit direct structural hardware failure data logs for verification"}
          </p>
        </div>

        {/* Input Interactive Fields Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Asset Element Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#0B2545]">
              {isRTL ? "العنصر المتضرر / العطل قيد الفحص *" : "Affected Asset / Structural Defect *"}
            </label>
            <input 
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder={isRTL ? "مثال: جهاز عرض الإسقاط (Projector) معمل أ" : "e.g., Classroom Smart Screen Panel"}
              className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:bg-white text-[#0A192F] transition-all"
              required
            />
          </div>

          {/* Location / Classroom Room input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#0B2545]">
              {isRTL ? "موقع العطل الفعلي بالمنشأة *" : "Specific Failure Room / Physical Location *"}
            </label>
            <input 
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder={isRTL ? "مثال: الغرفة 302 أو معمل الحاسب الآلي الرئيسي" : "e.g., Computer Lab A"}
              className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:bg-white text-[#0A192F] transition-all"
              required
            />
          </div>

          {/* Categorization Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-bold text-[#0B2545]">
                {isRTL ? "تصنيف العطل الميكانيكي" : "Operational Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewTicket["category"])}
                className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-[#0A192F] transition-all cursor-pointer"
              >
                <option value="Infrastructure">{isRTL ? "بنية تحتية (Infrastructure)" : "Infrastructure"}</option>
                <option value="Hardware">{isRTL ? "أجهزة برمجية (Hardware)" : "Hardware"}</option>
                <option value="Electrical">{isRTL ? "كهرباء (Electrical)" : "Electrical"}</option>
                <option value="Plumbing">{isRTL ? "سباكة وصرف صحي (Plumbing)" : "Plumbing"}</option>
              </select>
            </div>

            {/* Estimated Initial Cost Parameter */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-bold text-[#0B2545]">
                {isRTL ? "التكلفة التقديرية المبدئية (ج.م)" : "Estimated Maintenance Cost (EGP)"}
              </label>
              <input 
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-[#0A192F] transition-all"
              />
            </div>
          </div>

          {/* Structural Submitting Action Triggers */}
          <div className="pt-4 border-t border-[#E8ECEF] flex items-center justify-end space-x-3 gap-2">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-lg border border-[#E8ECEF] text-sm font-medium text-[#4A5568] hover:bg-slate-50 transition-colors"
            >
              {isRTL ? "إلغاء الأمر" : "Cancel Process"}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (isRTL ? "جاري الحفظ البلاغ..." : "Saving Ledger Data...") : (isRTL ? "تأكيد وإرسال البلاغ" : "Submit Ticket Log")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}