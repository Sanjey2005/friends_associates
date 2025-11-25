'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function UserLogin() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/user/login', loginData);
            if (res.status === 200) {
                toast.success('Welcome back!');
                // Use window.location for full page reload to ensure cookies are available
                setTimeout(() => {
                    window.location.href = '/dashboard/user';
                }, 500);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/user/register', registerData);
            if (res.status === 201) {
                toast.success('Account created! Please check your email to verify.');
                setIsLogin(true);
                setLoginData({ email: registerData.email, password: '' });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
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
                    maxWidth: '500px',
                    padding: '3rem',
                    borderRadius: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)',
                        borderRadius: '50%',
                        opacity: 0.2,
                        filter: 'blur(40px)'
                    }}></div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                        <h1 style={{
                            fontSize: '2.25rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
                            {isLogin ? 'Login to access your dashboard' : 'Join us to manage your insurance'}
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '2rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.5rem',
                        borderRadius: '1rem'
                    }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            className={isLogin ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ flex: 1, padding: '0.75rem' }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={!isLogin ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ flex: 1, padding: '0.75rem' }}
                        >
                            Register
                        </button>
                    </div>

                    {isLogin ? (
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="email"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="john@example.com"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                                <Link href="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="John Doe"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="email"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="john@example.com"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="tel"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="9876543210"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="password"
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="••••••••"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href="/" style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s' }} className="hover:text-white">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
