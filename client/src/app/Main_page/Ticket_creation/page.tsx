'use client'
import { useState, useEffect } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { BASE_URL } from "@/tools/API_handler";

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
  const [activeSchool, setActiveSchool] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Clean, consistent Category Translation Map
  const categoryMap: Record<NewTicket["category"], string> = {
    Infrastructure: "بنية تحتية",
    Hardware: "أجهزة برمجية وكيانات مادية",
    Electrical: "كهرباء",
    Plumbing: "سباكة وصرف صحي",
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/routes/fetch/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          setActiveSchool(data.school || "");
        } else {
          console.error("Failed to fetch user profile status");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize values
    const sanitizedAsset = asset.trim();
    const sanitizedRoom = room.trim();

    if (!sanitizedAsset || !sanitizedRoom) {
      return alert(isRTL ? "برجاء ملء الحقول الإلزامية" : "Please fill out all mandatory fields");
    }

    if (!activeSchool) {
      return alert(isRTL ? "فشل في تحديد المدرسة النشطة، يرجى المحاولة لاحقاً" : "Failed to determine active school, please try again later.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/routes/tickets/create`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          asset: sanitizedAsset,
          room: sanitizedRoom,
          category,
          arCategory: categoryMap[category],
          cost: Math.max(0, cost), // Prevent sending negative costs to the DB
          school: activeSchool        
        })
      });
      
      const ticketPayload = await response.json();

      if (!response.ok) {
        alert(isRTL ? `خطأ: ${ticketPayload.message}` : `Error: ${ticketPayload.message}`);
        return;
      }

      console.log("Structured Ticket Payload Saved Successfully:", ticketPayload);
      
      alert(isRTL ? "تم تسجيل بلاغ العطل بنجاح في المنظومة" : "Maintenance ticket logged successfully.");
      setAsset("");
      setRoom("");
      setCost(0);
      window.history.back(); 
    } catch (error) {
      console.error("Transmission failed:", error);
      alert(isRTL ? "فشل إرسال البلاغ، يرجى المحاولة مرة أخرى" : "Failed to submit ticket, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Block interaction until we verify which school context this form is posting to
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center font-sans">
        <p className="text-slate-600 font-bold">
          {isRTL ? "جاري التحقق من هوية المنشأة..." : "Verifying school profile session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E8ECEF] shadow-sm overflow-hidden">
        
        {/* Decorative Brand Accent Header */}
        <div className="bg-[#0B2545] p-6 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold">
            {isRTL ? "تسجيل بلاغ عطل / صيانة منشآت" : "File Infrastructure Incident Report"}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 font-mono">
            {isRTL ? `المدرسة النشطة: ${activeSchool || "غير محددة"}` : `Active Location: ${activeSchool || "Unknown Context"}`}
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
                <option value="Infrastructure">{isRTL ? "بنية تحتية" : "Infrastructure"}</option>
                <option value="Hardware">{isRTL ? "أجهزة برمجية وكيانات مادية" : "Hardware"}</option>
                <option value="Electrical">{isRTL ? "كهرباء" : "Electrical"}</option>
                <option value="Plumbing">{isRTL ? "سباكة وصرف صحي" : "Plumbing"}</option>
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
                value={cost || ""}
                onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
                className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-[#0A192F] transition-all"
              />
            </div>
          </div>

          {/* Structural Submitting Action Triggers */}
          <div className="pt-4 border-t border-[#E8ECEF] flex items-center justify-end space-x-3 gap-2">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-lg border border-[#E8ECEF] text-sm font-medium text-[#4A5568] hover:bg-slate-50 transition-colors hover:cursor-pointer"
            >
              {isRTL ? "إلغاء الأمر" : "Cancel Process"}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !activeSchool}
              className="px-6 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50 hover:cursor-pointer"
            >
              {isSubmitting ? (isRTL ? "جاري الحفظ البلاغ..." : "Saving Ledger Data...") : (isRTL ? "تأكيد وإرسال البلاغ" : "Submit Ticket Log")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}