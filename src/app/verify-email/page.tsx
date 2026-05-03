'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email…');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                await apiFetch('/api/auth/user/verify', {
                    method: 'POST',
                    body: jsonBody({ token }),
                });
                setStatus('success');
                setMessage('Email verified successfully. Redirecting to sign in…');
                setTimeout(() => {
                    router.push('/login/user');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(errorMessage(error, 'Verification failed. Please try again.'));
            }
        };

        verifyEmail();
    }, [token, router]);

    const cardStyle: React.CSSProperties = {
        maxWidth: '440px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '3rem 2.5rem',
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
        marginBottom: '0.75rem',
        lineHeight: 1.2,
    };

    const bodyTextStyle: React.CSSProperties = {
        color: 'var(--color-text-secondary)',
        fontSize: '0.95rem',
        lineHeight: 1.6,
    };

    return (
        <div style={cardStyle}>
            {status === 'loading' && (
                <div>
                    <Loader2
                        size={32}
                        style={{
                            marginBottom: '1rem',
                            color: 'var(--color-terracotta)',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                    <p style={bodyTextStyle}>{message}</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}
            {status === 'success' && (
                <div>
                    <CheckCircle
                        size={44}
                        color="#3d7a4e"
                        style={{ marginBottom: '1rem' }}
                    />
                    <h2 style={headingStyle}>Verified</h2>
                    <p style={bodyTextStyle}>{message}</p>
                </div>
            )}
            {status === 'error' && (
                <div>
                    <XCircle
                        size={44}
                        color="var(--color-error)"
                        style={{ marginBottom: '1rem' }}
                    />
                    <h2 style={headingStyle}>Verification failed</h2>
                    <p style={bodyTextStyle}>{message}</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem' }}
                        onClick={() => router.push('/login/user')}
                    >
                        Go to sign in
                    </button>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
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
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </main>
    );
}
