'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Car, FileText, LogOut } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';

export default function UserDashboard() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, policiesRes] = await Promise.all([
                    axios.get('/api/vehicles', { withCredentials: true }),
                    axios.get('/api/policies', { withCredentials: true }),
                ]);
                setVehicles(vehiclesRes.data);
                setPolicies(policiesRes.data);
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
                    <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
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
            <ChatWidget />
            <Footer />
        </main>
    );
}
