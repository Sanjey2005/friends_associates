'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/admin/login', formData);
            if (res.status === 200) {
                toast.success('Welcome back, Admin!');
                setTimeout(() => {
                    window.location.href = '/dashboard/admin';
                }, 500);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
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
                        maxWidth: '440px',
                        padding: '2.5rem',
                        background: 'var(--color-ivory)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-whisper)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                padding: '0.875rem',
                                borderRadius: '14px',
                                background: 'rgba(201, 100, 66, 0.1)',
                                color: 'var(--color-terracotta)',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <ShieldCheck size={32} />
                        </div>
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
                            Admin Portal
                        </h1>
                        <p
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.95rem',
                            }}
                        >
                            Secure access for administrators.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating…' : 'Login to dashboard'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
                        <Link
                            href="/"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
