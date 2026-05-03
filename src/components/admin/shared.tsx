import React from 'react';
import type { AdminData as DomainAdminData } from '@/types/domain';

// ============================================================
// Shared types
// ============================================================

export type AdminData = DomainAdminData;

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

// ============================================================
// Shared styles
// ============================================================

export const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    marginBottom: '1.25rem',
};

export const modalOverlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20, 20, 19, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
};

export const modalCard: React.CSSProperties = {
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--color-ivory)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    position: 'relative',
    boxShadow: '0 20px 48px rgba(20, 20, 19, 0.18)',
};

export const modalCloseButton: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-tertiary)',
    cursor: 'pointer',
    padding: '0.25rem',
};

export const modalTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: '1.5rem',
};

export const modalActions: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
};

export const dropdownPanel: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.25rem',
    maxHeight: '220px',
    overflowY: 'auto',
    background: 'var(--color-ivory)',
    border: '1px solid var(--color-border-warm)',
    borderRadius: 'var(--radius-md)',
    zIndex: 50,
    boxShadow: '0 12px 32px rgba(20, 20, 19, 0.12)',
};

// ============================================================
// Badge helper
// ============================================================

export const badgeForStatus = (status?: string) => {
    switch ((status || '').toLowerCase()) {
        case 'active':
            return 'badge badge-success';
        case 'expired':
            return 'badge badge-error';
        case 'expiring soon':
            return 'badge badge-warning';
        default:
            return 'badge';
    }
};

// ============================================================
// Pagination component
// ============================================================

export function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.5rem',
            }}
        >
            <button
                className="btn btn-outline"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
                ← Previous
            </button>
            <span
                style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    padding: '0 0.5rem',
                }}
            >
                Page {page} of {totalPages}
            </span>
            <button
                className="btn btn-outline"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
                Next →
            </button>
        </div>
    );
}
