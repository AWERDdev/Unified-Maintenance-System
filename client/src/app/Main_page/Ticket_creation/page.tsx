'use client'
import { useState, useEffect } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { BASE_URL } from "@/tools/API_handler";

interface NewTicket {
  id: string;
  asset: string;
  room: string;
  category: "IT_Equipment" | "Electrical" | "Plumbing" | "Furniture" | "Structural";
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
  const [category, setCategory] = useState<NewTicket["category"]>("IT_Equipment");
  const [cost, setCost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSchool, setActiveSchool] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Re-designed operational school maintenance categories
  const categoryMap: Record<NewTicket["category"], string> = {
    IT_Equipment: "أجهزة تكنولوجية ومعامل",
    Electrical: "كهرباء وإضاءة",
    Plumbing: "سباكة وصرف صحي",
    Furniture: "أثاث ومقاعد طلابية",
    Structural: "مباني ومنشآت (أبواب، نوافذ، دهانات)",
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
          console.log("Fetched user profile data:", data);
          console.log("Fetched user school:", data.staff_school);
          setActiveSchool(data.staff_school || "");
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
    
    const sanitizedAsset = asset.trim();
    const sanitizedRoom = room.trim();

    if (!sanitizedAsset || !sanitizedRoom) {
      return alert(isRTL ? "يرجى ملء جميع الحقول الإلزامية" : "Please fill out all mandatory fields");
    }

    if (!activeSchool) {
      return alert(isRTL ? "فشل في تحديد المدرسة، يرجى المحاولة لاحقاً" : "Failed to determine active school, please try again later.");
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
          cost: Math.max(0, cost), 
          school: activeSchool        
        })
      });
      
      const ticketPayload = await response.json();

      if (!response.ok) {
        alert(isRTL ? `خطأ: ${ticketPayload.message}` : `Error: ${ticketPayload.message}`);
        return;
      }
      
      alert(isRTL ? "تم إرسال بلاغ العطل بنجاح" : "Maintenance ticket logged successfully.");
      setAsset("");
      setRoom("");
      setCost(0);
      window.history.back(); 
    } catch (error) {
      console.error("Transmission failed:", error);
      alert(isRTL ? "فشل في إرسال البلاغ، يرجى المحاولة مرة أخرى" : "Failed to submit ticket, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center font-sans">
        <p className="text-slate-600 font-bold">
          {isRTL ? "جاري تحديد بيانات المدرسة..." : "Loading school configuration..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#E8ECEF] shadow-sm overflow-hidden">
        
        {/* Header Block */}
        <div className="bg-[#0B2545] p-6 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold">
            {isRTL ? "تقديم بلاغ صيانة جديد" : "Report a Maintenance Issue"}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 font-mono">
            {isRTL ? `المدرسة: ${activeSchool || "غير محددة"}` : `School: ${activeSchool || "Unknown"}`}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Asset Element Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#0B2545]">
              {isRTL ? "الوصف المختصر للعطل أو الشيء التالف *" : "Description of Damage / Asset *"}
            </label>
            <input 
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder={isRTL ? "مثال: شاشة ذكية معطلة، كسر في مقعد طالب" : "e.g., Smart Screen frozen, broken student desk"}
              className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:bg-white text-[#0A192F] transition-all"
              required
            />
          </div>

          {/* Location / Classroom Room input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#0B2545]">
              {isRTL ? "مكان العطل بالتفصيل (الصف الدراسي / الغرفة) *" : "Location / Room *"}
            </label>
            <input 
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder={isRTL ? "مثال: معمل الحاسب الآلي، الفصل 2/3، الطابق الثاني" : "e.g., Computer Lab, Classroom 3/1, Second floor"}
              className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:bg-white text-[#0A192F] transition-all"
              required
            />
          </div>

          {/* Categorization Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-bold text-[#0B2545]">
                {isRTL ? "تصنيف العطل" : "Issue Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewTicket["category"])}
                className="w-full border border-[#E8ECEF] bg-slate-50 text-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-[#0A192F] transition-all cursor-pointer"
              >
                <option value="IT_Equipment"className="cursor-pointer">{isRTL ? "أجهزة تكنولوجية ومعامل" : "IT & Technology Equipment"}</option>
                <option value="Electrical" className="cursor-pointer">{isRTL ? "كهرباء وإضاءة" : "Electrical & Lighting"}</option>
                <option value="Plumbing" className="cursor-pointer">{isRTL ? "سباكة وصرف صحي" : "Plumbing & Drainage"}</option>
                <option value="Furniture" className="cursor-pointer">{isRTL ? "أثاث ومقاعد طلابية" : "Furniture & Desks"}</option>
                <option value="Structural" className="cursor-pointer">{isRTL ? "مباني ومنشآت (أبواب، نوافذ)" : "Structural & Building Maintenance"}</option>
              </select>
            </div>

            {/* Estimated Initial Cost Parameter */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-bold text-[#0B2545]">
                {isRTL ? "التكلفة التقديرية المبدئية (ج.م)" : "Estimated Cost (EGP)"}
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

          {/* Action Triggers */}
          <div className="pt-4 border-t border-[#E8ECEF] flex items-center justify-end space-x-3 gap-2">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-lg border border-[#E8ECEF] text-sm font-medium text-[#4A5568] hover:bg-slate-50 transition-colors hover:cursor-pointer"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !activeSchool}
              className="px-6 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50 hover:cursor-pointer"
            >
              {isSubmitting ? (isRTL ? "جاري الإرسال..." : "Submitting...") : (isRTL ? "إرسال البلاغ" : "Submit Report")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}