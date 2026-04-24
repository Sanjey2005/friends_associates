'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Car, FileText, LogOut, User, Settings, X, Save } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import toast from 'react-hot-toast';

const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
    fontWeight: 500,
    color: 'var(--color-text)',
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
};

export default function UserDashboard() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [policies, setPolicies] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, policiesRes, userRes] = await Promise.all([
                    axios.get('/api/vehicles', { withCredentials: true }),
                    axios.get('/api/policies', { withCredentials: true }),
                    axios.get('/api/user/profile', { withCredentials: true }),
                ]);
                setVehicles(vehiclesRes.data);
                setPolicies(policiesRes.data);
                setUser(userRes.data);
                setProfileData({ name: userRes.data.name, email: userRes.data.email || '' });
            } catch (error) {
                console.error('Error fetching data:', error);
                window.location.href = '/login/user';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/login/user');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put('/api/user/profile', profileData, {
                withCredentials: true,
            });
            setUser(res.data.user);
            toast.success('Profile updated successfully');
            setShowProfileModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
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

    const getBadgeClass = (status?: string) => {
        switch ((status || 'Active').toLowerCase()) {
            case 'active':
                return 'badge badge-success';
            case 'expired':
                return 'badge badge-error';
            case 'expiring soon':
                return 'badge badge-warning';
            default:
                return 'badge';
        }
    };

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
                                User Dashboard
                            </div>
                        </div>
                    </Link>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="btn btn-outline"
                        >
                            <Settings size={16} /> Profile
                        </button>
                        <button onClick={handleLogout} className="btn btn-ghost">
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ padding: '3rem 1.5rem 4rem' }}>
                <section style={{ marginBottom: '3.5rem' }}>
                    <h2 style={sectionTitle}>
                        <FileText size={26} style={{ color: 'var(--color-terracotta)' }} />
                        My Policies
                    </h2>
                    {policies.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            No policies found yet.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '1.25rem',
                            }}
                        >
                            {policies.map((policy) => (
                                <div
                                    key={policy._id}
                                    style={{
                                        background: 'var(--color-ivory)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '1.5rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        <span className={getBadgeClass(policy.status)}>
                                            {policy.status || 'Active'}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '0.825rem',
                                                color: 'var(--color-text-tertiary)',
                                            }}
                                        >
                                            Expires {format(new Date(policy.expiryDate), 'dd MMM yyyy')}
                                        </span>
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: '1.25rem',
                                            fontWeight: 500,
                                            marginBottom: '0.375rem',
                                            color: 'var(--color-text)',
                                        }}
                                    >
                                        {policy.vehicleId?.model || 'Vehicle'}
                                    </h3>
                                    <p
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            marginBottom: '1.25rem',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {policy.vehicleId?.regNumber}
                                    </p>
                                    {policy.policyLink ? (
                                        <a
                                            href={policy.policyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ width: '100%' }}
                                        >
                                            View policy document
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="btn btn-outline"
                                            style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
                                        >
                                            Document pending
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 style={sectionTitle}>
                        <Car size={26} style={{ color: 'var(--color-terracotta)' }} />
                        My Vehicles
                    </h2>
                    {vehicles.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            No vehicles found yet.
                        </p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Model</th>
                                        <th>Registration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle._id}>
                                            <td>{vehicle.type}</td>
                                            <td>{vehicle.vehicleModel}</td>
                                            <td>{vehicle.regNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {showProfileModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(20, 20, 19, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            background: 'var(--color-ivory)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            position: 'relative',
                            boxShadow: '0 20px 48px rgba(20, 20, 19, 0.18)',
                        }}
                    >
                        <button
                            onClick={() => setShowProfileModal(false)}
                            aria-label="Close modal"
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-tertiary)',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.5rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <User size={22} style={{ color: 'var(--color-terracotta)' }} />
                            Edit profile
                        </h2>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="input-group">
                                <label className="input-label">Full name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={profileData.name}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={profileData.email}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, email: e.target.value })
                                    }
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone number (read only)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={user?.phone || ''}
                                    disabled
                                    style={{
                                        opacity: 0.65,
                                        cursor: 'not-allowed',
                                        background: 'var(--color-parchment)',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.5rem',
                                    marginTop: '1.5rem',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving…' : 'Save changes'}
                                    {!saving && <Save size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ChatWidget />
            <Footer />
        </main>
    );
}
