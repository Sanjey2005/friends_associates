'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Car, FileText, LogOut, User, Settings, X, Save } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import toast from 'react-hot-toast';

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
                // If unauthorized, redirect to login
                window.location.href = '/login/user';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        // Clear cookie (client side hack or call api)
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/login/user');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put('/api/user/profile', profileData, { withCredentials: true });
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
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <main>
            <nav className="navbar">
                <div className="container navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Image
                            src="/logo.png"
                            alt="Friends Associates logo"
                            width={48}
                            height={48}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                        <div>
                            <div className="logo" style={{ margin: 0 }}>Friends Associates</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>User Dashboard</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setShowProfileModal(true)} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                            <Settings size={18} /> Profile
                        </button>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="page-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText /> My Policies
                    </h2>
                    {policies.length === 0 ? (
                        <p>No policies found.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {policies.map((policy) => (
                                <div key={policy._id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="badge badge-success">{policy.status || 'Active'}</span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                            Expires: {format(new Date(policy.expiryDate), 'dd MMM yyyy')}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {policy.vehicleId?.model || 'Vehicle'}
                                    </h3>
                                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                                        {policy.vehicleId?.regNumber}
                                    </p>
                                    {policy.policyLink ? (
                                        <a
                                            href={policy.policyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ width: '100%', textDecoration: 'none' }}
                                        >
                                            View Policy Document
                                        </a>
                                    ) : (
                                        <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.5 }}>
                                            Document Pending
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="page-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Car /> My Vehicles
                    </h2>
                    {vehicles.length === 0 ? (
                        <p>No vehicles found.</p>
                    ) : (
                        <div className="table-container card" style={{ padding: 0 }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Model</th>
                                        <th>Registration Number</th>
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

            {/* Profile Modal */}
            {showProfileModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-light)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User /> Edit Profile
                        </h2>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone Number (Cannot be changed)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={user?.phone || ''}
                                    disabled
                                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
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
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                    {!saving && <Save size={18} />}
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
