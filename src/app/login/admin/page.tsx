'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)', // Soft light blue-grey gradient
            padding: '1rem'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '3rem',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                width: '100%',
                maxWidth: '450px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        marginBottom: '1.5rem',
                        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                    }}>
                        <ShieldCheck size={40} />
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        marginBottom: '0.5rem'
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: '#64748b' }}>Secure access for administrators</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" style={{ color: '#475569', fontWeight: 600 }}>Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="admin@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{
                                background: '#f8fafc',
                                borderColor: '#e2e8f0',
                                color: '#334155'
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" style={{ color: '#475569', fontWeight: 600 }}>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{
                                background: '#f8fafc',
                                borderColor: '#e2e8f0',
                                color: '#334155'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
