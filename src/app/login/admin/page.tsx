'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
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
                router.push('/dashboard/admin');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem'
            }}>
                <div className="card" style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                            color: 'white',
                            marginBottom: '1.5rem',
                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Admin Portal
                        </h1>
                        <p style={{ color: 'var(--text-light)' }}>Secure access for administrators</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Login to Dashboard'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href="/" style={{ color: 'var(--text-light)', fontSize: '0.9rem', transition: 'color 0.3s' }} className="hover:text-white">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
