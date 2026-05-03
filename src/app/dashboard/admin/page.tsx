'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdminAnalytics from '@/components/AdminAnalytics';
import AdminPoliciesTab from '@/components/admin/AdminPoliciesTab';
import AdminLeadsTab from '@/components/admin/AdminLeadsTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminVehiclesTab from '@/components/admin/AdminVehiclesTab';
import AdminMessagesTab from '@/components/admin/AdminMessagesTab';
import {
    LogOut,
    BarChart3,
    FileText,
    Users,
    Car,
    Mail,
    MessageCircle,
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import type { AdminData, ChatRecord, LeadRecord, PolicyRecord, UserRecord, VehicleRecord } from '@/types/domain';

const tabConfig: { id: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'leads', label: 'Leads', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AdminData>({
        policies: [],
        leads: [],
        users: [],
        vehicles: [],
        chats: [],
    });

    const fetchData = useCallback(async () => {
        try {
            const [policies, leads, vehicles, users, chats] = await Promise.all([
                apiFetch<PolicyRecord[]>('/api/policies?scope=admin'),
                apiFetch<LeadRecord[]>('/api/leads'),
                apiFetch<VehicleRecord[]>('/api/vehicles?scope=admin'),
                apiFetch<UserRecord[]>('/api/users'),
                apiFetch<ChatRecord[]>('/api/chat?scope=admin'),
            ]);

            setData({
                policies,
                leads,
                users,
                vehicles,
                chats,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            window.location.href = '/login/admin';
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        await apiFetch('/api/auth/admin/logout', { method: 'POST' });
        router.push('/login/admin');
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: '4rem',
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-parchment)',
                    minHeight: '100vh',
                }}
            >
                Loading…
            </div>
        );
    }

    return (
        <main style={{ background: 'var(--color-parchment)', minHeight: '100vh' }}>
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textDecoration: 'none',
                        }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Friends Associates logo"
                            width={48}
                            height={48}
                            style={{ objectFit: 'contain', borderRadius: '8px' }}
                            priority
                        />
                        <div>
                            <div className="logo" style={{ fontSize: '1.25rem', lineHeight: 1.1 }}>
                                Friends Associates
                            </div>
                            <div
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-secondary)',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Admin Dashboard
                            </div>
                        </div>
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost">
                        <LogOut size={16} /> Log out
                    </button>
                </div>
            </nav>

            <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
                <div
                    role="tablist"
                    style={{
                        display: 'flex',
                        gap: '0.375rem',
                        marginBottom: '2.25rem',
                        overflowX: 'auto',
                        padding: '0.375rem',
                        background: 'var(--color-sand)',
                        border: '1px solid var(--color-border-warm)',
                        borderRadius: 'var(--radius-md)',
                        width: 'fit-content',
                        maxWidth: '100%',
                    }}
                >
                    {tabConfig.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab === id;
                        return (
                            <button
                                key={id}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveTab(id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.9rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    border: isActive ? '1px solid var(--color-border-warm)' : '1px solid transparent',
                                    background: isActive ? 'var(--color-ivory)' : 'transparent',
                                    color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <Icon size={15} /> {label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'analytics' && (
                    <AdminAnalytics
                        policies={data.policies}
                        leads={data.leads}
                        vehicles={data.vehicles}
                        chats={data.chats}
                    />
                )}

                {activeTab === 'policies' && (
                    <AdminPoliciesTab
                        policies={data.policies}
                        users={data.users}
                        vehicles={data.vehicles}
                        onDataChange={fetchData}
                    />
                )}

                {activeTab === 'leads' && (
                    <AdminLeadsTab leads={data.leads} onDataChange={fetchData} />
                )}

                {activeTab === 'users' && (
                    <AdminUsersTab users={data.users} onDataChange={fetchData} />
                )}

                {activeTab === 'vehicles' && (
                    <AdminVehiclesTab
                        vehicles={data.vehicles}
                        users={data.users}
                        onDataChange={fetchData}
                    />
                )}

                {activeTab === 'messages' && (
                    <AdminMessagesTab chats={data.chats} onDataChange={fetchData} />
                )}
            </div>

            <Footer />
        </main>
    );
}
