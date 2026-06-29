// inside @/Types/tickets.ts
export interface Ticket {
  id: string;
  asset: string;
  room: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string; // The flat date property on the ticket schema
  arCategory: string;
  adminApproved: boolean;
  principalFunded: boolean;
  cost: number;
  createdBy: {
    _id: string;
    legal_name: string;
    email: string;
  };
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