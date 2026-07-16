'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/tools/LanguageHandler";
import { NavBarAUTH } from "@/components/Navbar";
import { Fotter1 } from "@/components/Fotter";
import { isAUTH } from "@/tools/verfiy_user";
import { Ticket } from "@/Types/tickets";
import { useRouter } from "next/navigation";

// Importing modular dashboard views
import { TeacherView } from "@/components/Teacher_view";
import { AdminView } from "@/components/Admin_view";
import { PrincipalView } from "@/components/PrincipalFunding_View";
import { BASE_URL } from "@/tools/API_handler";
import { ROUTES } from "@/Types/Routing";

// Fetch handlers
import { Fetch_tickets_my, Fetch_tickets_all, Update_ticket_approval, Resolve_ticket } from "@/tools/Fetch_tickets";

export default function MainPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [staffType, setStaffType] = useState<
    | "Super Admin"
    | "Principal"
    | "Vice Principal"
    | "Teacher"
    | "Administrator"
    | "School Counselor"
    | "IT Specialist"
    | "Librarian"
    | "Teacher Assistant"
    | "Academic Coordinator"
  >("Teacher");
  
  const [schoolName, setSchoolName] = useState<string>("Al-Najah Secondary School");

  useEffect(() => {
    const checkUserAndFetchTickets = async () => {
      const authStatus = await isAUTH();
      
      if (!authStatus.authenticated) {
        window.location.href = ROUTES.Staff_Login; 
        return; 
      }

      try {
        const targetUrl = `${BASE_URL}/routes/fetch/status`;
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', 
        });

        if (!response.ok) {
          setLoading(false);
          return; 
        }
        
        const data = await response.json();
        if (!data) {
          setLoading(false);
          return;
        }

        const activeSchool = data.staff_school || "Al-Najah Secondary School";
        const activeRole = data.staff_type || "Teacher";
        
        setSchoolName(activeSchool);
        setStaffType(activeRole);

        let fetchedTickets: Ticket[] | null = null;

        const elevatedRoles = [
          "Super Admin",
          "Administrator",
          "IT Specialist",
          "Principal",
          "Vice Principal",
          "Teacher"
        ];

        if (elevatedRoles.includes(activeRole)) {
          fetchedTickets = await Fetch_tickets_all();
        } else {
          fetchedTickets = await Fetch_tickets_my();
        }

        if (fetchedTickets) {
          setTickets(fetchedTickets);
        }

        setLoading(false);
      } catch (error) {
        console.error(`Initialization error: ${error}`);
        setLoading(false);
      }
    };

    checkUserAndFetchTickets();
  }, []);

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const approveTicket = async (ticketId: string) => { 
    const updatedTicket = await Update_ticket_approval(ticketId);
    if (updatedTicket) {
      setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? updatedTicket : ticket));
    }
  };

  const approveFunding = async (ticketId: string) => { 
    const updatedTicket = await Update_ticket_approval(ticketId);
    if (updatedTicket) {
      setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? updatedTicket : ticket));
    }
  };

  const resolveTicket = async (ticketId: string) => { 
    const updatedTicket = await Resolve_ticket(ticketId);
    if (updatedTicket) {
      setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? updatedTicket : ticket));
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-semibold tracking-wide text-slate-500">
        {isRTL ? "جاري التحقق من الحساب..." : "Checking account status..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <header className="w-full sticky top-0 z-50">
        <NavBarAUTH />
      </header>

      <main className="grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E8ECEF] pb-6 gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B2545]">
                {isRTL ? "لوحة التحكم في طلبات الصيانة" : "School Maintenance Dashboard"}
              </h1>
              <p className="text-sm text-[#4A5568] mt-1">
                {isRTL ? "تتبع وإدارة طلبات الصيانة والأعطال في المدرسة" : "Track and manage school maintenance requests"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#EEF2F6] text-[#0B2545] text-xs font-semibold px-3 py-1.5 rounded-md border border-[#E2E8F0]">
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
              <span>
                {isRTL ? `المدرسة: ${schoolName}` : `School: ${schoolName}`}
              </span>
            </div>
          </div>
          
          {/* Action Trigger */}
          {["Super Admin", "Administrator", "IT Specialist", "Teacher"].includes(staffType) && (
            <button 
              className="bg-[#0B2545] hover:bg-[#13315C] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all self-start md:self-auto hover:cursor-pointer"
              onClick={() => router.push(ROUTES.Ticket_creation_page)}
            >
              {isRTL ? "+ إرسال طلب جديد" : "+ Report New Issue"}
            </button>
          )}
        </div>

        {/* Metric Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "طلبات معلقة" : "Pending"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{pendingCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "قيد التنفيذ" : "In Progress"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{inProgressCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8ECEF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{isRTL ? "مكتملة" : "Resolved"}</p>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mt-1">{resolvedCount}</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* UI Sub-Component Routing Grid */}
        <div className="w-full mt-4">
          {["Principal", "Vice Principal"].includes(staffType) && (
            <PrincipalView tickets={tickets} isRTL={isRTL} onFund={approveFunding} />
          )}
          
          {["Super Admin", "Administrator", "IT Specialist"].includes(staffType) && (
            <AdminView tickets={tickets} isRTL={isRTL} onApprove={approveTicket} onResolve={resolveTicket} />
          )}
          
          {["Teacher", "School Counselor", "Librarian", "Teacher Assistant", "Academic Coordinator"].includes(staffType) && (
            <TeacherView tickets={tickets} isRTL={isRTL} />
          )}
        </div>

      </main>

      <Fotter1 />
    </div>
  );
}