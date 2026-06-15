import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  // If no role is passed in the URL, default to a regular Teacher
  const mockedRole = searchParams.get('mock_role') || 'Teacher'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    // When submitting, you pass `mockedRole` to your backend register function
    console.log(`Registering user as: ${mockedRole}`);
  };

  return (
    // Your beautiful, dropdown-free form code here
  );
}

// @/data/allowedStaff.ts
export const ALLOWED_MINISTRY_STAFF = [
  { nationalId: "29501012101234", role: "Teacher", name: "Kirlous Rami" },
  { nationalId: "28805122105678", role: "IT_Administrator", name: "Maged Ali" },
  { nationalId: "27409232109876", role: "Principal", name: "Sanaa Ahmed" }
];

import { ALLOWED_MINISTRY_STAFF } from "@/data/allowedStaff";

const verifyIdentity = (inputNationalId: string) => {
  const match = ALLOWED_MINISTRY_STAFF.find(staff => staff.nationalId === inputNationalId);

  if (!match) {
    // This is how you reject non-staff users cleanly!
    return { 
      success: false, 
      message: "Access Denied: This National ID is not registered in the Ministry employee ledger." 
    };
  }

  // If found, the system automatically assigns their legal role!
  return { 
    success: true, 
    role: match.role, 
    name: match.name 
  };
};