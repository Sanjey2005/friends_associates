'use client';

import { Save, User, X } from 'lucide-react';
import type { UserRecord } from '@/types/domain';

interface ProfileModalProps {
    user: UserRecord | null;
    profileData: { name: string; email: string };
    saving: boolean;
    onChange: (data: { name: string; email: string }) => void;
    onClose: () => void;
    onSubmit: (event: React.FormEvent) => void;
}

export function ProfileModal({
    user,
    profileData,
    saving,
    onChange,
    onClose,
    onSubmit,
}: ProfileModalProps) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(20, 20, 19, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: 'var(--color-ivory)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: '0 20px 48px rgba(20, 20, 19, 0.18)',
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                    }}
                >
                    <X size={20} />
                </button>

                <h2
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <User size={22} style={{ color: 'var(--color-terracotta)' }} />
                    Edit profile
                </h2>

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={profileData.name}
                            onChange={(e) => onChange({ ...profileData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={profileData.email}
                            onChange={(e) => onChange({ ...profileData, email: e.target.value })}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Phone number (read only)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={user?.phone || ''}
                            disabled
                            style={{
                                opacity: 0.65,
                                cursor: 'not-allowed',
                                background: 'var(--color-parchment)',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                            marginTop: '1.5rem',
                        }}
                    >
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                            {!saving && <Save size={16} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
