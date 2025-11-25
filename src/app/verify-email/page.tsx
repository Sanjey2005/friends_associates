'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle } from 'lucide-react';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                await axios.post('/api/auth/user/verify', { token });
                setStatus('success');
                setMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login/user');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            {status === 'loading' && (
                <div>
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p>{message}</p>
                </div>
            )}
            {status === 'success' && (
                <div>
                    <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>Verified!</h2>
                    <p>{message}</p>
                </div>
            )}
            {status === 'error' && (
                <div>
                    <XCircle size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>Verification Failed</h2>
                    <p>{message}</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => router.push('/login/user')}>
                        Go to Login
                    </button>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <main>
            <Navbar />
            <div className="container" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </main>
    );
}
