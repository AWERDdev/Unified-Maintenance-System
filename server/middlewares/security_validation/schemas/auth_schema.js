const { z } = require('zod');

const signupSchema = z.object({
    // Stored as a string to preserve leading zeros and strictly check digit count
    national_id: z.string()
        .length(14, { message: "National ID must be exactly 14 digits long" })
        .regex(/^\d+$/, { message: "National ID must contain only numbers" }),
        
    email: z.string().email({ message: "Invalid email" }),
    
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    
    legal_name: z.string({ required_error: "Legal name is required" }),
    
    // Stored as a string to preserve the leading '0' in mobile numbers
    phone: z.string({ required_error: "Phone number is required" })
        .min(11, { message: "Phone number is too short" })
        .regex(/^\d+$/, { message: "Phone number must contain only numbers" })
});

const loginSchema = z.object({
        national_id: z.string()
        .length(14, { message: "National ID must be exactly 14 digits long" })
        .regex(/^\d+$/, { message: "National ID must contain only numbers" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
});

module.exports = { signupSchema, loginSchema };