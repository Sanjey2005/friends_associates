'use client';

import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Mail, ArrowRight, Phone } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            // Determine if input is email or phone
            const isEmail = identifier.includes('@');
            const payload = isEmail ? { email: identifier } : { phone: identifier };

            const res = await axios.post('/api/auth/user/forgot-password', payload);
            setStatus('success');
            setMessage(res.data.message);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main>
            <Navbar />
            <div className="container" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Forgot Password</h2>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                {message}
                            </div>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                Check your email for the reset link.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)', textAlign: 'center' }}>
                                Enter your email address or phone number and we'll send you a link to reset your password.
                            </p>

                            <div className="input-group">
                                <label className="input-label">Email Address or Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px' }}>
                                        {identifier.includes('@') || identifier === '' ? <Mail size={18} /> : <Phone size={18} />}
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
                                <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                {!status && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
