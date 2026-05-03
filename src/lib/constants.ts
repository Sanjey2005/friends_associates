export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
} as const;

export const POLICY_STATUSES = ['Active', 'Expired', 'Expiring Soon'] as const;

export const LEAD_STATUSES = ['Completed', 'Not Completed', "Customer Didn't Pick"] as const;

export const VEHICLE_TYPES = ['Bike', 'Car', 'Commercial'] as const;

export const BOARD_TYPES = ['Own Board', 'T Board'] as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type PolicyStatus = typeof POLICY_STATUSES[number];
export type LeadStatus = typeof LEAD_STATUSES[number];
export type VehicleType = typeof VEHICLE_TYPES[number];
export type BoardType = typeof BOARD_TYPES[number];
