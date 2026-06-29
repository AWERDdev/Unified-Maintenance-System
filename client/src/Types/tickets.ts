export interface Ticket  {
  id: string;
  asset: string;
  room: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved'; // String literal union for tighter control
  date: string;
  arCategory: string;
  adminApproved: boolean;
  principalFunded: boolean;
  cost: number;
}

export interface TeacherViewProps {
  tickets: Ticket[];
  isRTL: boolean;
}

export interface PrincipalViewProps {
  tickets: Ticket[];
  isRTL: boolean;
  onFund: (id: string) => void;
}

export interface AdminViewProps {
  tickets: Ticket[];
  isRTL: boolean;
  onApprove: (id: string) => void;
}