'use client';

import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { badgeForStatus } from '../shared';
import type { PolicyRecord } from '@/types/domain';
import { getUserEmail, getUserName, getVehicle } from './policyHelpers';

interface PolicyTableProps {
    policies: PolicyRecord[];
    onEditPolicy: (policy: PolicyRecord) => void;
}

export function PolicyTable({ policies, onEditPolicy }: PolicyTableProps) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Expiry date</th>
                        <th>Status</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy) => (
                        <tr key={policy._id}>
                            <td>
                                <div>{getUserName(policy)}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{getUserEmail(policy)}</div>
                            </td>
                            <td>
                                <div>{getVehicle(policy)?.vehicleModel}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{getVehicle(policy)?.regNumber}</div>
                            </td>
                            <td>{format(new Date(policy.expiryDate), 'dd MMM yyyy')}</td>
                            <td><span className={badgeForStatus(policy.status)}>{policy.status || 'Active'}</span></td>
                            <td>
                                {policy.policyLink ? (
                                    <a href={policy.policyLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta)', textDecoration: 'underline', fontWeight: 500 }}>View</a>
                                ) : '-'}
                            </td>
                            <td>
                                <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => onEditPolicy(policy)} aria-label="Edit policy">
                                    <Edit size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
