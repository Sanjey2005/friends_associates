'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Lock, CheckCircle } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

const cardStyle: React.CSSProperties = {
    maxWidth: '440px',
    width: '100%',
    padding: '2.5rem',
    background: 'var(--color-ivory)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-whisper)',
};

const headingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.75rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    textAlign: 'center',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
};

const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-tertiary)',
};

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing token');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await apiFetch('/api/auth/user/reset-password', {
                method: 'POST',
                body: jsonBody({ token, password }),
            });
            setStatus('success');
            setMessage('Password reset successfully. Redirecting to sign in…');
            setTimeout(() => {
                router.push('/login/user');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage(errorMessage(error, 'Failed to reset password'));
        }
    };

    if (!token) {
        return (
            <div style={{ ...cardStyle, textAlign: 'center' }}>
                <h2 style={{ ...headingStyle, color: 'var(--color-error)' }}>Invalid link</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    The password reset link is invalid or missing.
                </p>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem', padding: '0.75rem 1.25rem' }}
                    onClick={() => router.push('/forgot-password')}
                >
                    Request new link
                </button>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            <h2 style={headingStyle}>Reset password</h2>

            {status === 'success' ? (
                <div style={{ textAlign: 'center' }}>
                    <CheckCircle
                        size={44}
                        color="#3d7a4e"
                        style={{ margin: '0 auto 1rem' }}
                    />
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {message}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">New password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {status === 'error' && (
                        <div
                            style={{
                                color: 'var(--color-error)',
                                background: '#f1dede',
                                border: '1px solid #e3c9c9',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.875rem' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Resetting…' : 'Reset password'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main style={{ background: 'var(--color-parchment)', minHeight: '100vh' }}>
            <Navbar />
            <div
                className="container"
                style={{
                    padding: '4rem 1.5rem',
                    minHeight: 'calc(100vh - 80px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Suspense fallback={<div style={{ color: 'var(--color-text-secondary)' }}>Loading…</div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </main>
    );
}
