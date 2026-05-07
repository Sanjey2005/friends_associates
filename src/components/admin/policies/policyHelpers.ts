import type { PolicyStatus } from '@/lib/constants';
import type { PolicyRecord, UserRecord, VehicleRecord } from '@/types/domain';

export const ITEMS_PER_PAGE = 15;

export interface PolicyFormState {
    userId: string;
    vehicleId: string;
    policyLink: string;
    expiryDate: string;
    notes: string;
    status: PolicyStatus;
}

export const defaultPolicyFormState: PolicyFormState = {
    userId: '',
    vehicleId: '',
    policyLink: '',
    expiryDate: '',
    notes: '',
    status: 'Active',
};

export function getUserName(policy: PolicyRecord) {
    return policy.userId && typeof policy.userId === 'object' ? policy.userId.name : '';
}

export function getUserEmail(policy: PolicyRecord) {
    return policy.userId && typeof policy.userId === 'object' ? policy.userId.email || '' : '';
}

export function getVehicle(policy: PolicyRecord) {
    return policy.vehicleId && typeof policy.vehicleId === 'object' ? policy.vehicleId : null;
}

export function vehicleOwnerId(vehicle: VehicleRecord) {
    return vehicle.userId && typeof vehicle.userId === 'object' ? vehicle.userId._id : vehicle.userId;
}

export function filterPolicies(
    policies: PolicyRecord[],
    searchTerm: string,
    filterType: string,
    filterExpiry: string,
) {
    const searchLower = searchTerm.toLowerCase();

    return policies.filter((policy) => {
        const vehicle = getVehicle(policy);
        const matchesSearch = Boolean(
            !searchTerm ||
            getUserName(policy).toLowerCase().includes(searchLower) ||
            getUserEmail(policy).toLowerCase().includes(searchLower) ||
            vehicle?.regNumber?.toLowerCase().includes(searchLower),
        );
        const matchesType = filterType ? vehicle?.type === filterType : true;

        let matchesExpiry = true;
        if (filterExpiry) {
            const now = new Date();
            const expiry = new Date(policy.expiryDate);
            const daysToExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (filterExpiry === 'expired') matchesExpiry = daysToExpiry < 0;
            else if (filterExpiry === 'soon') matchesExpiry = daysToExpiry >= 0 && daysToExpiry <= 7;
            else if (filterExpiry === 'active') matchesExpiry = daysToExpiry > 0;
        }

        return matchesSearch && matchesType && matchesExpiry;
    });
}

export function filterUsers(users: UserRecord[], userSearch: string) {
    const searchLower = userSearch.toLowerCase();
    return users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchLower) ||
            (user.email || '').toLowerCase().includes(searchLower),
    );
}
