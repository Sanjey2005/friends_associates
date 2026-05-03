'use client';

import { X } from 'lucide-react';
import { modalActions, modalCard, modalCloseButton, modalOverlay, modalTitle } from '../shared';
import type { PolicyRecord } from '@/types/domain';

interface PolicyEditModalProps {
    policy: PolicyRecord;
    onChange: (policy: PolicyRecord) => void;
    onClose: () => void;
    onSubmit: (event: React.FormEvent) => void;
}

export function PolicyEditModal({ policy, onChange, onClose, onSubmit }: PolicyEditModalProps) {
    return (
        <div style={modalOverlay}>
            <div style={modalCard}>
                <button onClick={onClose} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                <h3 style={modalTitle}>Update policy</h3>
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label className="input-label">Policy link</label>
                        <input type="url" className="input-field" value={policy.policyLink || ''} onChange={(e) => onChange({ ...policy, policyLink: e.target.value })} placeholder="https://drive.google.com/..." />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Expiry date</label>
                        <input type="date" className="input-field" value={policy.expiryDate ? new Date(policy.expiryDate).toISOString().split('T')[0] : ''} onChange={(e) => onChange({ ...policy, expiryDate: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Internal notes</label>
                        <textarea className="input-field" value={policy.notes || ''} onChange={(e) => onChange({ ...policy, notes: e.target.value })} rows={3} />
                    </div>
                    <div style={modalActions}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
