import { z } from 'zod';

// ============================================================
// Shared primitives
// ============================================================

const phoneSchema = z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-() ]+$/, 'Invalid phone number format');

const emailSchema = z.string().trim().email('Invalid email format').max(254);

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

const passwordSchema = z
    .string()
    .min(7, 'Password must be at least 7 characters')
    .max(128, 'Password is too long')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );

const nameSchema = z.string().trim().min(1, 'Name is required').max(100, 'Name is too long');

// ============================================================
// Auth schemas
// ============================================================

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema.optional().or(z.literal('')),
    phone: phoneSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    phone: phoneSchema,
    password: z.string().min(1, 'Password is required').max(128),
});

export const adminLoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(128),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required').max(256),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema.optional().or(z.literal('')),
    phone: phoneSchema.optional().or(z.literal('')),
}).refine(
    (data) => (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0),
    { message: 'Email or phone is required' }
);

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required').max(256),
    password: passwordSchema,
});

// ============================================================
// Policy schemas
// ============================================================

export const createPolicySchema = z.object({
    userId: objectIdSchema,
    vehicleId: objectIdSchema,
    policyLink: z.string().url('Invalid URL').max(2048).optional().or(z.literal('')),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    notes: z.string().max(1000, 'Notes too long').optional().or(z.literal('')),
    status: z.enum(['Active', 'Expired', 'Expiring Soon']).default('Active'),
});

export const updatePolicySchema = z.object({
    id: objectIdSchema,
    policyLink: z.string().url('Invalid URL').max(2048).optional().or(z.literal('')),
    expiryDate: z.string().optional(),
    notes: z.string().max(1000, 'Notes too long').optional().or(z.literal('')),
});

// ============================================================
// Lead schemas
// ============================================================

export const createLeadSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    vehicleType: z.string().trim().min(1, 'Vehicle type is required').max(50),
    vehicleModel: z.string().trim().max(100).optional().or(z.literal('')),
    mfgYear: z.string().trim().max(4).optional().or(z.literal('')),
    regNumber: z.string().trim().max(20).optional().or(z.literal('')),
    insuranceType: z.string().trim().min(1, 'Insurance type is required').max(50),
    additionalInfo: z.string().max(2000, 'Additional info too long').optional().or(z.literal('')),
});

export const updateLeadSchema = z.object({
    id: objectIdSchema,
    status: z.enum(['Completed', 'Not Completed', "Customer Didn't Pick"]),
});

// ============================================================
// Vehicle schemas
// ============================================================

export const createVehicleSchema = z.object({
    userId: objectIdSchema,
    type: z.string().trim().min(1, 'Vehicle type is required').max(50),
    vehicleModel: z.string().trim().min(1, 'Vehicle model is required').max(100),
    regNumber: z.string().trim().min(1, 'Registration number is required').max(20),
    boardType: z.enum(['Own Board', 'T Board']).optional().default('Own Board'),
    details: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================
// User schemas (admin CRUD)
// ============================================================

export const createUserSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema.optional().or(z.literal('')),
});

export const updateUserSchema = z.object({
    id: objectIdSchema,
    _id: objectIdSchema.optional(), // frontend sometimes sends _id
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema.optional().or(z.literal('')),
}).passthrough(); // allow _id and other fields frontend sends

export const deleteUserSchema = z.object({
    id: objectIdSchema,
});

// ============================================================
// Profile schemas
// ============================================================

export const updateProfileSchema = z.object({
    name: nameSchema,
    email: emailSchema.optional().or(z.literal('')),
});

// ============================================================
// Chat schemas
// ============================================================

export const chatMessageSchema = z.object({
    text: z.string().trim().min(1, 'Message text is required').max(5000, 'Message too long'),
    userId: objectIdSchema.optional(), // only present for admin sending to a user
});

// ============================================================
// Helper to parse & return formatted error
// ============================================================

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const firstError = result.error.issues[0];
    const message = firstError ? `${firstError.path.join('.')}: ${firstError.message}`.replace(/^: /, '') : 'Validation failed';
    return { success: false, error: message };
}
