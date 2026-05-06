'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

export default function UserLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({ phone: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '' });

    // Post-registration state
    const [emailSent, setEmailSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiFetch('/api/auth/user/login', {
                method: 'POST',
                body: jsonBody(loginData),
            });
            toast.success('Welcome back!');
            setTimeout(() => { window.location.href = '/dashboard/user'; }, 500);
        } catch (error) {
            toast.error(errorMessage(error, 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We wait for the actual API response — the backend only returns 201
            // AFTER nodemailer has confirmed the email was accepted for delivery.
            // If email sending fails, the backend returns 503 and we show an error.
            await apiFetch('/api/auth/user/register', {
                method: 'POST',
                body: jsonBody(registerData),
            });
            setRegisteredEmail(registerData.email);
            setEmailSent(true);
        } catch (error) {
            toast.error(errorMessage(error, 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await apiFetch('/api/auth/user/resend-verification', {
                method: 'POST',
                body: jsonBody({ email: registeredEmail }),
            });
            toast.success('Verification email sent again!');
            startResendCooldown();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to resend. Please try again later.'));
        } finally {
            setResending(false);
        }
    };

    const iconStyle: React.CSSProperties = {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-text-tertiary)',
    };

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-parchment)',
            }}
        >
            <Navbar />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1.5rem',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '460px',
                        padding: '2.5rem',
                        background: 'var(--color-ivory)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-whisper)',
                    }}
                >
                    {/* ─── Email Sent Confirmation Screen ─── */}
                    {emailSent ? (
                        <div style={{ textAlign: 'center' }}>
                            <CheckCircle size={48} color="#3d7a4e" style={{ marginBottom: '1.25rem' }} />
                            <h2
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.75rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                Check your inbox
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                                We sent a verification link to
                            </p>
                            <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                                {registeredEmail}
                            </p>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                                Click the link in the email to activate your account. It may take a few minutes to arrive. Check your spam folder too.
                            </p>

                            {/* Resend button with cooldown */}
                            <button
                                className="btn btn-outline"
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                onClick={handleResend}
                                disabled={resending || resendCooldown > 0}
                            >
                                {resending ? (
                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
                                ) : resendCooldown > 0 ? (
                                    `Resend in ${resendCooldown}s`
                                ) : (
                                    <><RefreshCw size={16} /> Resend verification email</>
                                )}
                            </button>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '0.875rem' }}
                                onClick={() => { setEmailSent(false); setIsLogin(true); }}
                            >
                                Go to Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* ─── Header ─── */}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '2rem',
                                        fontWeight: 500,
                                        color: 'var(--color-text)',
                                        marginBottom: '0.5rem',
                                        lineHeight: 1.15,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {isLogin ? 'Welcome back' : 'Create your account'}
                                </h1>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {isLogin ? 'Sign in to access your dashboard.' : 'Join us to manage your insurance with ease.'}
                                </p>
                            </div>

                            {/* ─── Tab toggle ─── */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.375rem',
                                    marginBottom: '1.75rem',
                                    background: 'var(--color-parchment)',
                                    padding: '0.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <button
                                    onClick={() => setIsLogin(true)}
                                    style={{
                                        flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: 'none',
                                        background: isLogin ? 'var(--color-ivory)' : 'transparent',
                                        color: isLogin ? 'var(--color-text)' : 'var(--color-text-secondary)',
                                        fontWeight: 500, fontSize: '0.9rem',
                                        boxShadow: isLogin ? '0 0 0 1px var(--color-border-warm)' : 'none',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    style={{
                                        flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: 'none',
                                        background: !isLogin ? 'var(--color-ivory)' : 'transparent',
                                        color: !isLogin ? 'var(--color-text)' : 'var(--color-text-secondary)',
                                        fontWeight: 500, fontSize: '0.9rem',
                                        boxShadow: !isLogin ? '0 0 0 1px var(--color-border-warm)' : 'none',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                    }}
                                >
                                    Register
                                </button>
                            </div>

                            {/* ─── Login Form ─── */}
                            {isLogin ? (
                                <form onSubmit={handleLogin}>
                                    <div className="input-group">
                                        <label className="input-label">Phone Number</label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={iconStyle} />
                                            <input
                                                type="tel"
                                                className="input-field"
                                                style={{ paddingLeft: '2.5rem' }}
                                                placeholder="9876543210"
                                                value={loginData.phone}
                                                onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={iconStyle} />
                                            <input
                                                type="password"
                                                className="input-field"
                                                style={{ paddingLeft: '2.5rem' }}
                                                placeholder="••••••••"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                                        <Link href="/forgot-password" style={{ color: 'var(--color-terracotta)', fontSize: '0.875rem', fontWeight: 500 }}>
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
                                        {loading ? (
                                            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
                                        ) : (
                                            <>Sign in <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* ─── Register Form ─── */
                                <form onSubmit={handleRegister}>
                                    <div className="input-group">
                                        <label className="input-label">Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={iconStyle} />
                                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="John Doe" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={iconStyle} />
                                            <input type="email" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="john@example.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Phone Number</label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={iconStyle} />
                                            <input type="tel" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="9876543210" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={iconStyle} />
                                            <input type="password" className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="••••••••" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required minLength={7} />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                                        {loading ? (
                                            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending verification email…</>
                                        ) : (
                                            <>Create account <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </form>
                            )}

                            <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                                <Link href="/" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                                    ← Back to home
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
