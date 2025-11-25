'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Lock, CheckCircle } from 'lucide-react';

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
            await axios.post('/api/auth/user/reset-password', { token, password });
            setStatus('success');
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login/user');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Failed to reset password');
        }
    };

    if (!token) {
        return (
            <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Invalid Link</h2>
                <p>The password reset link is invalid or missing.</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => router.push('/forgot-password')}>
                    Request New Link
                </button>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>

            {status === 'success' ? (
                <div style={{ textAlign: 'center' }}>
                    <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                    <p>{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                        <label className="input-label">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                        <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main>
            <Navbar />
            <div className="container" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </main>
    );
}
