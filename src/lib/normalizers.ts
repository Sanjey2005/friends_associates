export function normalizeEmail(email?: string | null) {
    const value = email?.trim().toLowerCase();
    return value || undefined;
}

export function normalizePhone(phone: string) {
    return phone.trim().replace(/\s+/g, '');
}

export function normalizeRegistrationNumber(regNumber: string) {
    return regNumber.trim().replace(/\s+/g, '').toUpperCase();
}
