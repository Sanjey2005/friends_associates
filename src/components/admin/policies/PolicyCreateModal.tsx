'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { dropdownPanel, modalActions, modalCard, modalCloseButton, modalOverlay, modalTitle } from '../shared';
import type { PolicyStatus } from '@/lib/constants';
import type { UserRecord, VehicleRecord } from '@/types/domain';
import type { PolicyFormState } from './policyHelpers';
import { vehicleOwnerId } from './policyHelpers';

interface PolicyCreateModalProps {
    newPolicy: PolicyFormState;
    users: UserRecord[];
    vehicles: VehicleRecord[];
    filteredUsers: UserRecord[];
    userSearch: string;
    showUserDropdown: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    onPolicyChange: (policy: PolicyFormState) => void;
    onUserSearchChange: (value: string) => void;
    onShowUserDropdownChange: (show: boolean) => void;
    onSelectUser: (user: UserRecord) => void;
    onClose: () => void;
    onSubmit: (event: React.FormEvent) => void;
}

export function PolicyCreateModal({
    newPolicy,
    vehicles,
    filteredUsers,
    userSearch,
    showUserDropdown,
    dropdownRef,
    onPolicyChange,
    onUserSearchChange,
    onShowUserDropdownChange,
    onSelectUser,
    onClose,
    onSubmit,
}: PolicyCreateModalProps) {
    const userVehicles = vehicles.filter((vehicle) => vehicleOwnerId(vehicle) === newPolicy.userId);

    return (
        <div style={modalOverlay}>
            <div style={modalCard}>
                <button onClick={onClose} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                <h3 style={modalTitle}>Create new policy</h3>
                <form onSubmit={onSubmit}>
                    <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                        <label className="input-label">Select user</label>
                        <div style={{ position: 'relative' }}>
                            <input type="text" className="input-field" placeholder="Search user..." value={userSearch} onChange={(e) => { onUserSearchChange(e.target.value); onShowUserDropdownChange(true); }} onFocus={() => onShowUserDropdownChange(true)} style={{ paddingRight: '2rem' }} />
                            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                        </div>
                        {showUserDropdown && (
                            <div style={dropdownPanel}>
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                                    const selected = newPolicy.userId === user._id;
                                    return (
                                        <div key={user._id} onClick={() => onSelectUser(user)} style={{ padding: '0.75rem 0.9rem', cursor: 'pointer', background: selected ? 'var(--color-sand)' : 'transparent', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{user.email}</div>
                                            </div>
                                            {selected && <Check size={16} color="var(--color-terracotta)" />}
                                        </div>
                                    );
                                }) : (
                                    <div style={{ padding: '0.85rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>No users found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {newPolicy.userId && (
                        <div className="input-group">
                            <label className="input-label" htmlFor="policy-vehicle">Select vehicle</label>
                            <select id="policy-vehicle" className="input-field" value={newPolicy.vehicleId} onChange={(e) => onPolicyChange({ ...newPolicy, vehicleId: e.target.value })} required>
                                <option value="">Select vehicle</option>
                                {userVehicles.map((vehicle) => (
                                    <option key={vehicle._id} value={vehicle._id}>{vehicle.vehicleModel} - {vehicle.regNumber}</option>
                                ))}
                            </select>
                            {userVehicles.length === 0 && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.375rem' }}>No vehicles found for this user.</p>
                            )}
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label" htmlFor="policy-link">Policy link</label>
                        <input id="policy-link" type="url" className="input-field" value={newPolicy.policyLink} onChange={(e) => onPolicyChange({ ...newPolicy, policyLink: e.target.value })} placeholder="https://drive.google.com/..." />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="policy-expiry">Expiry date</label>
                        <input id="policy-expiry" type="date" className="input-field" value={newPolicy.expiryDate} onChange={(e) => onPolicyChange({ ...newPolicy, expiryDate: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="policy-status">Status</label>
                        <select id="policy-status" className="input-field" value={newPolicy.status} onChange={(e) => onPolicyChange({ ...newPolicy, status: e.target.value as PolicyStatus })}>
                            <option value="Active">Active</option>
                            <option value="Expiring Soon">Expiring soon</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                    <div style={modalActions}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create policy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
