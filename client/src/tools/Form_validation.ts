/**
 * Client-side validation for the Staff Signup workflow.
 * Validates state values directly before they are dispatched to the network.
 */
export const validate_signup_data = (data: {
  legal_name: string;
  national_id: string;
  phone: string;
  email: string;
  password: string;
}, lang: string) => {
  
  const isAr = lang === 'ar';

  // 1. Check for empty fields
  if (!data.legal_name.trim() || !data.national_id.trim() || !data.phone.trim() || !data.email.trim() || !data.password.trim()) {
    return {
      isValid: false,
      message: isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields."
    };
  }

  // 2. National ID validation (Must be exactly 14 numeric digits)
  const nationalIdRegex = /^\d{14}$/;
  if (!nationalIdRegex.test(data.national_id)) {
    return {
      isValid: false,
      message: isAr ? "الرقم القومي يجب أن يتكون من 14 رقماً فقط." : "National ID must be exactly 14 numeric digits."
    };
  }

  // 3. Phone validation (Standard Egyptian mobile format: 010, 011, 012, 015 followed by 8 digits)
  const egPhoneRegex = /^01[0125]\d{8}$/;
  if (!egPhoneRegex.test(data.phone)) {
    return {
      isValid: false,
      message: isAr ? "رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010، 011، 012، أو 015 ويتكون من 11 رقماً." : "Invalid Egyptian phone number format."
    };
  }

  // 4. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      message: isAr ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email address format."
    };
  }

  // 5. Password length validation
  if (data.password.length < 8) {
    return {
      isValid: false,
      message: isAr ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل." : "Password must be at least 8 characters long."
    };
  }

  // Everything passes validation safely
  return { isValid: true, message: "" };
};

export const validate_login_data = (data: {
  national_id: string;
  password: string;
}, lang: string) => {
  const isAr = lang === 'ar';

  if (!data.national_id.trim() || !data.password.trim()) {
    return {
      isValid: false,
      message: isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields."
    };
  }

  const nationalIdRegex = /^\d{14}$/;
  if (!nationalIdRegex.test(data.national_id)) {
    return {
      isValid: false,
      message: isAr ? "الرقم القومي يجب أن يتكون من 14 رقماً فقط." : "National ID must be exactly 14 numeric digits."
    };
  }

  return { isValid: true, message: "" };
};