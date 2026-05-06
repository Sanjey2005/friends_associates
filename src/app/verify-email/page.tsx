'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email…');
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendDone, setResendDone] = useState(false);

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
                setMessage(errorMessage(error, 'Verification failed. The link may have expired.'));
            }
        };

        verifyEmail();
    }, [token, router]);

    const startCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        if (!resendEmail) return;
        setResending(true);
        try {
            await apiFetch('/api/auth/user/resend-verification', {
                method: 'POST',
                body: jsonBody({ email: resendEmail }),
            });
        } catch {
            // backend always returns generic message — we still show done
        } finally {
            setResending(false);
            setResendDone(true);
            startCooldown();
        }
    };

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
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {status === 'loading' && (
                <div>
                    <Loader2
                        size={32}
                        style={{ marginBottom: '1rem', color: 'var(--color-terracotta)', animation: 'spin 1s linear infinite' }}
                    />
                    <p style={bodyTextStyle}>{message}</p>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <CheckCircle size={44} color="#3d7a4e" style={{ marginBottom: '1rem' }} />
                    <h2 style={headingStyle}>Verified!</h2>
                    <p style={bodyTextStyle}>{message}</p>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <XCircle size={44} color="var(--color-error)" style={{ marginBottom: '1rem' }} />
                    <h2 style={headingStyle}>Verification failed</h2>
                    <p style={{ ...bodyTextStyle, marginBottom: '1.75rem' }}>{message}</p>

                    {/* Resend section */}
                    {resendDone ? (
                        <p style={{ color: '#3d7a4e', fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            ✓ If that email is registered and unverified, a new link has been sent.
                            {resendCooldown > 0 && ` Resend available in ${resendCooldown}s.`}
                        </p>
                    ) : (
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                                Didn&apos;t receive it? Enter your email to resend:
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    className="btn btn-outline"
                                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                    onClick={handleResend}
                                    disabled={resending || !resendEmail || resendCooldown > 0}
                                >
                                    {resending
                                        ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                        : <RefreshCw size={15} />
                                    }
                                    {resendCooldown > 0 ? `${resendCooldown}s` : 'Resend'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.5rem' }}
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
