'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function UserLogin() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? '/api/auth/user/login' : '/api/auth/user/register';

        try {
            const res = await axios.post(endpoint, formData);
            if (res.status === 200 || res.status === 201) {
                toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
                if (isLogin) {
                    router.push('/dashboard/user');
                } else {
                    setIsLogin(true); // Switch to login after register
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Authentication failed');
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
            background: 'linear-gradient(135deg, #fdfbf7 0%, #e2e8f0 100%)', // Warm light gradient
            padding: '2rem 1rem'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem',
                borderRadius: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background blob */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    borderRadius: '50%',
                    opacity: 0.1
                }}></div>

                <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                    <h1 style={{
                        fontSize: '2.25rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.5px'
                    }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        {isLogin ? 'Enter your credentials to access your account' : 'Join us to manage your insurance policies'}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: isLogin ? 'white' : 'transparent',
                            color: isLogin ? '#0f172a' : '#64748b',
                            fontWeight: 600,
                            boxShadow: isLogin ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: !isLogin ? 'white' : 'transparent',
                            color: !isLogin ? '#0f172a' : '#64748b',
                            fontWeight: 600,
                            boxShadow: !isLogin ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label" style={{ color: '#475569' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                    style={{ paddingLeft: '3rem', background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label" style={{ color: '#475569' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                className="input-field"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ paddingLeft: '3rem', background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label" style={{ color: '#475569' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required={!isLogin}
                                    style={{ paddingLeft: '3rem', background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label" style={{ color: '#475569' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                style={{ paddingLeft: '3rem', background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div style={{ textAlign: 'right' }}>
                            <a href="#" style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: 500 }}>Forgot Password?</a>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                            boxShadow: '0 10px 20px rgba(236, 72, 153, 0.3)'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                        {!loading && <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
