'use client';

import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import type { PolicyRecord } from '@/types/domain';
import { userSectionTitle } from './styles';

interface PoliciesSectionProps {
    policies: PolicyRecord[];
}

function getBadgeClass(status?: string) {
    switch ((status || 'Active').toLowerCase()) {
        case 'active':
            return 'badge badge-success';
        case 'expired':
            return 'badge badge-error';
        case 'expiring soon':
            return 'badge badge-warning';
        default:
            return 'badge';
    }
}

export function PoliciesSection({ policies }: PoliciesSectionProps) {
    return (
        <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={userSectionTitle}>
                <FileText size={26} style={{ color: 'var(--color-terracotta)' }} />
                My Policies
            </h2>
            {policies.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    No policies found yet.
                </p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {policies.map((policy) => (
                        <div
                            key={policy._id}
                            style={{
                                background: 'var(--color-ivory)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <span className={getBadgeClass(policy.status)}>
                                    {policy.status || 'Active'}
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.825rem',
                                        color: 'var(--color-text-tertiary)',
                                    }}
                                >
                                    Expires {format(new Date(policy.expiryDate), 'dd MMM yyyy')}
                                </span>
                            </div>
                            <h3
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.25rem',
                                    fontWeight: 500,
                                    marginBottom: '0.375rem',
                                    color: 'var(--color-text)',
                                }}
                            >
                                {policy.vehicleId && typeof policy.vehicleId === 'object' ? policy.vehicleId.vehicleModel : 'Vehicle'}
                            </h3>
                            <p
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: '1.25rem',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {policy.vehicleId && typeof policy.vehicleId === 'object' ? policy.vehicleId.regNumber : ''}
                            </p>
                            {policy.policyLink ? (
                                <a
                                    href={policy.policyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    View policy document
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="btn btn-outline"
                                    style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
                                >
                                    Document pending
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
