import type { LeadStatus, PolicyStatus, BoardType } from '@/lib/constants';

export interface UserRecord {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminRecord {
    _id: string;
    email: string;
    role: 'admin';
}

export interface VehicleRecord {
    _id: string;
    userId: string | Pick<UserRecord, '_id' | 'name' | 'email' | 'phone'>;
    type: string;
    vehicleModel: string;
    regNumber: string;
    boardType?: BoardType;
    details?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}

export interface PolicyRecord {
    _id: string;
    userId: string | Pick<UserRecord, '_id' | 'name' | 'email' | 'phone'>;
    vehicleId: string | Pick<VehicleRecord, '_id' | 'type' | 'vehicleModel' | 'regNumber'>;
    policyLink?: string;
    expiryDate: string;
    notes?: string;
    status: PolicyStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeadRecord {
    _id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleModel?: string;
    mfgYear?: string;
    regNumber?: string;
    insuranceType: string;
    additionalInfo?: string;
    status: LeadStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface ChatMessage {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
}

export interface ChatRecord {
    _id: string;
    userId: string | Pick<UserRecord, '_id' | 'name' | 'email'>;
    messages: ChatMessage[];
    lastUpdated: string;
}

export interface AdminData {
    policies: PolicyRecord[];
    leads: LeadRecord[];
    users: UserRecord[];
    vehicles: VehicleRecord[];
    chats: ChatRecord[];
}
