'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Mail, ArrowRight, Phone } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

export default function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const isEmail = identifier.includes('@');
            const payload = isEmail ? { email: identifier } : { phone: identifier };

            const res = await apiFetch<{ message: string }>('/api/auth/user/forgot-password', {
                method: 'POST',
                body: jsonBody(payload),
            });
            setStatus('success');
            setMessage(res.message);
        } catch (error) {
            setStatus('error');
            setMessage(errorMessage(error, 'Something went wrong. Please try again.'));
        }
    };

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
                <div
                    style={{
                        maxWidth: '440px',
                        width: '100%',
                        padding: '2.5rem',
                        background: 'var(--color-ivory)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-whisper)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.75rem',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Forgot password?
                    </h2>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <div
                                style={{
                                    background: '#e9efe6',
                                    color: '#3d7a4e',
                                    border: '1px solid #d8e2d2',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.5,
                                }}
                            >
                                {message}
                            </div>
                            <p
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                Check your email for the reset link.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p
                                style={{
                                    marginBottom: '1.75rem',
                                    color: 'var(--color-text-secondary)',
                                    textAlign: 'center',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                Enter your email or phone and we&apos;ll send you a link to reset your password.
                            </p>

                            <div className="input-group">
                                <label className="input-label">Email or phone</label>
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--color-text-tertiary)',
                                        }}
                                    >
                                        {identifier.includes('@') || identifier === '' ? (
                                            <Mail size={18} />
                                        ) : (
                                            <Phone size={18} />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="john@example.com or 9876543210"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
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
                                {status === 'loading' ? 'Sending…' : 'Send reset link'}
                                {status !== 'loading' && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}

                    <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                        <Link
                            href="/login/user"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            ← Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
