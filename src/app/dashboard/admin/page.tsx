'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdminAnalytics from '@/components/AdminAnalytics';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
    LogOut,
    Search,
    Edit,
    X,
    Plus,
    Check,
    ChevronDown,
    MessageCircle,
    Send,
    BarChart3,
    FileText,
    Users,
    Car,
    Mail,
    Trash2,
} from 'lucide-react';

const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    marginBottom: '1.25rem',
};

const tabConfig: { id: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'leads', label: 'Leads', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
];

const modalOverlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20, 20, 19, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
};

const modalCard: React.CSSProperties = {
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--color-ivory)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    position: 'relative',
    boxShadow: '0 20px 48px rgba(20, 20, 19, 0.18)',
};

const modalCloseButton: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-tertiary)',
    cursor: 'pointer',
    padding: '0.25rem',
};

const modalTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: '1.5rem',
};

const modalActions: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
};

const dropdownPanel: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.25rem',
    maxHeight: '220px',
    overflowY: 'auto',
    background: 'var(--color-ivory)',
    border: '1px solid var(--color-border-warm)',
    borderRadius: 'var(--radius-md)',
    zIndex: 50,
    boxShadow: '0 12px 32px rgba(20, 20, 19, 0.12)',
};

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ policies: any[]; leads: any[]; users: any[]; vehicles: any[]; chats: any[] }>({
        policies: [],
        leads: [],
        users: [],
        vehicles: [],
        chats: [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterExpiry, setFilterExpiry] = useState('');

    const [editingPolicy, setEditingPolicy] = useState<any>(null);
    const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);

    const [newPolicy, setNewPolicy] = useState({ userId: '', vehicleId: '', policyLink: '', expiryDate: '', notes: '', status: 'Active' });
    const [newVehicle, setNewVehicle] = useState({ userId: '', type: 'Car', vehicleModel: '', regNumber: '', details: '', boardType: 'Own Board' });
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', email: '' });

    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [adminMessage, setAdminMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            const [policiesRes, leadsRes, vehiclesRes, usersRes, chatsRes] = await Promise.all([
                axios.get('/api/policies?scope=admin', { withCredentials: true }),
                axios.get('/api/leads', { withCredentials: true }),
                axios.get('/api/vehicles?scope=admin', { withCredentials: true }),
                axios.get('/api/users', { withCredentials: true }),
                axios.get('/api/chat?scope=admin', { withCredentials: true }),
            ]);

            setData({
                policies: policiesRes.data,
                leads: leadsRes.data,
                users: usersRes.data,
                vehicles: vehiclesRes.data,
                chats: chatsRes.data,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            window.location.href = '/login/admin';
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    useEffect(() => {
        if (activeTab === 'messages') {
            const interval = setInterval(async () => {
                try {
                    const res = await axios.get('/api/chat?scope=admin', { withCredentials: true });
                    setData((prev) => ({ ...prev, chats: res.data }));
                    if (selectedChat) {
                        const updatedChat = res.data.find((c: any) => c._id === selectedChat._id);
                        if (updatedChat) setSelectedChat(updatedChat);
                    }
                } catch (error) {
                    console.error(error);
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab, selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        document.cookie = 'admin_token=; Max-Age=0; path=/;';
        router.push('/login/admin');
    };

    const handleUpdatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/policies', {
                id: editingPolicy._id,
                policyLink: editingPolicy.policyLink,
                expiryDate: editingPolicy.expiryDate,
                notes: editingPolicy.notes,
            });
            setData((prev) => ({
                ...prev,
                policies: prev.policies.map((p) => (p._id === editingPolicy._id ? res.data : p)),
            }));
            setEditingPolicy(null);
            toast.success('Policy updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update policy');
        }
    };

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/policies', newPolicy);
            setData((prev) => ({ ...prev, policies: [...prev.policies, res.data] }));
            setIsCreatingPolicy(false);
            setNewPolicy({ userId: '', vehicleId: '', policyLink: '', expiryDate: '', notes: '', status: 'Active' });
            setUserSearch('');
            toast.success('Policy created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create policy');
        }
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedVehicle = {
                ...newVehicle,
                regNumber: newVehicle.regNumber.replace(/\s+/g, ''),
            };
            const res = await axios.post('/api/vehicles', sanitizedVehicle);
            setData((prev) => ({ ...prev, vehicles: [...prev.vehicles, res.data] }));
            setIsAddingVehicle(false);
            setNewVehicle({ userId: '', type: 'Car', vehicleModel: '', regNumber: '', details: '', boardType: 'Own Board' });
            setUserSearch('');
            toast.success('Vehicle added successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to add vehicle');
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users', newUser);
            setData((prev) => ({ ...prev, users: [res.data.user, ...prev.users] }));
            setIsCreatingUser(false);
            setNewUser({ name: '', phone: '', email: '' });
            toast.success('User created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/users', editingUser);
            setData((prev) => ({
                ...prev,
                users: prev.users.map((u) => (u._id === editingUser._id ? res.data : u)),
            }));
            setEditingUser(null);
            toast.success('User updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`/api/users?id=${id}`);
            setData((prev) => ({ ...prev, users: prev.users.filter((u) => u._id !== id) }));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleUpdateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await axios.put('/api/leads', { id, status });
            setData((prev) => ({
                ...prev,
                leads: prev.leads.map((l) => (l._id === id ? res.data : l)),
            }));
            toast.success('Lead status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSendAdminMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminMessage.trim() || !selectedChat) return;
        try {
            await axios.post(
                '/api/chat',
                { text: adminMessage, userId: selectedChat.userId._id },
                { withCredentials: true },
            );
            setAdminMessage('');
            const res = await axios.get('/api/chat?scope=admin', { withCredentials: true });
            setData((prev) => ({ ...prev, chats: res.data }));
            const updatedChat = res.data.find((c: any) => c._id === selectedChat._id);
            if (updatedChat) setSelectedChat(updatedChat);
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const filteredPolicies = data.policies.filter((p) => {
        const matchesSearch =
            p.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.vehicleId?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType ? p.vehicleId?.type === filterType : true;
        let matchesExpiry = true;
        if (filterExpiry) {
            const now = new Date();
            const expiry = new Date(p.expiryDate);
            const daysToExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (filterExpiry === 'expired') matchesExpiry = daysToExpiry < 0;
            else if (filterExpiry === 'soon') matchesExpiry = daysToExpiry >= 0 && daysToExpiry <= 7;
            else if (filterExpiry === 'active') matchesExpiry = daysToExpiry > 0;
        }
        return matchesSearch && matchesType && matchesExpiry;
    });

    const filteredUsers = data.users.filter(
        (u) =>
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase()),
    );

    const selectUserForPolicy = (user: any) => {
        setNewPolicy({ ...newPolicy, userId: user._id, vehicleId: '' });
        setUserSearch(user.name);
        setShowUserDropdown(false);
    };

    const selectUserForVehicle = (user: any) => {
        setNewVehicle({ ...newVehicle, userId: user._id });
        setUserSearch(user.name);
        setShowUserDropdown(false);
    };

    const badgeForStatus = (status?: string) => {
        switch ((status || '').toLowerCase()) {
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
                    <AdminAnalytics policies={data.policies} leads={data.leads} vehicles={data.vehicles} />
                )}

                {activeTab === 'policies' && (
                    <section>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap',
                                gap: '1rem',
                            }}
                        >
                            <h2 style={sectionTitle}>Policies</h2>
                            <button className="btn btn-primary" onClick={() => setIsCreatingPolicy(true)}>
                                <Plus size={16} /> Create policy
                            </button>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                                <Search
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-text-tertiary)',
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search user, email, reg number…"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="input-field"
                                style={{ width: 'auto', minWidth: '140px' }}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">All types</option>
                                <option value="Bike">Bike</option>
                                <option value="Car">Car</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                            <select
                                className="input-field"
                                style={{ width: 'auto', minWidth: '160px' }}
                                value={filterExpiry}
                                onChange={(e) => setFilterExpiry(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active</option>
                                <option value="soon">Expiring soon</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Vehicle</th>
                                        <th>Expiry date</th>
                                        <th>Status</th>
                                        <th>Link</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPolicies.map((policy) => (
                                        <tr key={policy._id}>
                                            <td>
                                                <div>{policy.userId?.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                    {policy.userId?.email}
                                                </div>
                                            </td>
                                            <td>
                                                <div>{policy.vehicleId?.vehicleModel}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                    {policy.vehicleId?.regNumber}
                                                </div>
                                            </td>
                                            <td>{format(new Date(policy.expiryDate), 'dd MMM yyyy')}</td>
                                            <td>
                                                <span className={badgeForStatus(policy.status)}>
                                                    {policy.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                {policy.policyLink ? (
                                                    <a
                                                        href={policy.policyLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: 'var(--color-terracotta)',
                                                            textDecoration: 'underline',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem 0.6rem' }}
                                                    onClick={() => setEditingPolicy(policy)}
                                                    aria-label="Edit policy"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'leads' && (
                    <section>
                        <h2 style={sectionTitle}>Leads</h2>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Vehicle</th>
                                        <th>Insurance type</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.leads.map((lead) => (
                                        <tr key={lead._id}>
                                            <td>{lead.name}</td>
                                            <td>
                                                <div>{lead.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                    {lead.phone}
                                                </div>
                                            </td>
                                            <td>
                                                {lead.vehicleType} — {lead.vehicleModel}
                                            </td>
                                            <td>{lead.insuranceType}</td>
                                            <td>
                                                <select
                                                    className="input-field"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                                                    value={lead.status || 'Not Completed'}
                                                    onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                                                >
                                                    <option value="Not Completed">Not completed</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Customer Didn’t Pick">Customer didn't pick</option>
                                                </select>
                                            </td>
                                            <td>{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'users' && (
                    <section>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap',
                                gap: '1rem',
                            }}
                        >
                            <h2 style={sectionTitle}>Users</h2>
                            <button className="btn btn-primary" onClick={() => setIsCreatingUser(true)}>
                                <Plus size={16} /> Create user
                            </button>
                        </div>

                        <div style={{ position: 'relative', maxWidth: '420px', marginBottom: '1.25rem' }}>
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-tertiary)',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or email…"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user: any) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email || '—'}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.4rem 0.6rem' }}
                                                        onClick={() => setEditingUser(user)}
                                                        aria-label="Edit user"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.4rem 0.6rem' }}
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        aria-label="Delete user"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'vehicles' && (
                    <section>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap',
                                gap: '1rem',
                            }}
                        >
                            <h2 style={sectionTitle}>Vehicles</h2>
                            <button className="btn btn-primary" onClick={() => setIsAddingVehicle(true)}>
                                <Plus size={16} /> Add vehicle
                            </button>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Owner</th>
                                        <th>Type</th>
                                        <th>Model</th>
                                        <th>Reg number</th>
                                        <th>Board</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.vehicles.map((v: any) => (
                                        <tr key={v._id}>
                                            <td>{v.userId?.name}</td>
                                            <td>{v.type}</td>
                                            <td>{v.vehicleModel}</td>
                                            <td>{v.regNumber}</td>
                                            <td>{v.type === 'Car' ? v.boardType || 'Own Board' : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'messages' && (
                    <section>
                        <h2 style={sectionTitle}>Messages</h2>
                        <div
                            style={{
                                height: '600px',
                                display: 'flex',
                                overflow: 'hidden',
                                background: 'var(--color-ivory)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                            }}
                        >
                            <div
                                style={{
                                    width: '300px',
                                    borderRight: '1px solid var(--color-border)',
                                    overflowY: 'auto',
                                    background: 'var(--color-parchment)',
                                }}
                            >
                                {data.chats.length === 0 ? (
                                    <div
                                        style={{
                                            padding: '1.25rem',
                                            color: 'var(--color-text-tertiary)',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        No messages yet
                                    </div>
                                ) : (
                                    data.chats.map((chat) => {
                                        const isActive = selectedChat?._id === chat._id;
                                        return (
                                            <div
                                                key={chat._id}
                                                onClick={() => setSelectedChat(chat)}
                                                style={{
                                                    padding: '0.9rem 1rem',
                                                    cursor: 'pointer',
                                                    background: isActive ? 'var(--color-ivory)' : 'transparent',
                                                    borderBottom: '1px solid var(--color-border)',
                                                    borderLeft: isActive
                                                        ? '3px solid var(--color-terracotta)'
                                                        : '3px solid transparent',
                                                }}
                                            >
                                                <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                                                    {chat.userId?.name || 'Unknown user'}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                    {chat.userId?.email}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-text-tertiary)',
                                                        marginTop: '0.25rem',
                                                    }}
                                                >
                                                    {format(new Date(chat.lastUpdated), 'dd MMM HH:mm')}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {selectedChat ? (
                                    <>
                                        <div
                                            style={{
                                                padding: '1rem 1.25rem',
                                                borderBottom: '1px solid var(--color-border)',
                                                background: 'var(--color-ivory)',
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontFamily: 'var(--font-serif)',
                                                    fontSize: '1.125rem',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text)',
                                                }}
                                            >
                                                {selectedChat.userId?.name}
                                            </h3>
                                            <span
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--color-text-tertiary)',
                                                }}
                                            >
                                                {selectedChat.userId?.email}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                padding: '1.25rem',
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.75rem',
                                                background: 'var(--color-parchment)',
                                            }}
                                        >
                                            {selectedChat.messages.map((msg: any, idx: number) => {
                                                const isAdmin = msg.sender === 'admin';
                                                return (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                                            maxWidth: '70%',
                                                            padding: '0.65rem 0.9rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            borderBottomRightRadius: isAdmin ? '4px' : 'var(--radius-md)',
                                                            borderBottomLeftRadius: isAdmin ? 'var(--radius-md)' : '4px',
                                                            background: isAdmin
                                                                ? 'var(--color-terracotta)'
                                                                : 'var(--color-ivory)',
                                                            color: isAdmin ? 'var(--color-ivory)' : 'var(--color-text)',
                                                            border: isAdmin
                                                                ? 'none'
                                                                : '1px solid var(--color-border-warm)',
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.5,
                                                        }}
                                                    >
                                                        <div>{msg.text}</div>
                                                        <div
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                opacity: 0.75,
                                                                marginTop: '0.25rem',
                                                                textAlign: 'right',
                                                            }}
                                                        >
                                                            {format(new Date(msg.timestamp), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <form
                                            onSubmit={handleSendAdminMessage}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                borderTop: '1px solid var(--color-border)',
                                                display: 'flex',
                                                gap: '0.5rem',
                                                background: 'var(--color-ivory)',
                                            }}
                                        >
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Type a reply…"
                                                value={adminMessage}
                                                onChange={(e) => setAdminMessage(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                style={{ padding: '0.6rem 0.9rem' }}
                                                aria-label="Send message"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-text-tertiary)',
                                            flexDirection: 'column',
                                            gap: '0.75rem',
                                        }}
                                    >
                                        <MessageCircle size={44} style={{ opacity: 0.4 }} />
                                        <p>Select a conversation to start messaging</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {editingPolicy && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button
                            onClick={() => setEditingPolicy(null)}
                            aria-label="Close modal"
                            style={modalCloseButton}
                        >
                            <X size={20} />
                        </button>
                        <h3 style={modalTitle}>Update policy</h3>
                        <form onSubmit={handleUpdatePolicy}>
                            <div className="input-group">
                                <label className="input-label">Policy link</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={editingPolicy.policyLink || ''}
                                    onChange={(e) => setEditingPolicy({ ...editingPolicy, policyLink: e.target.value })}
                                    placeholder="https://drive.google.com/…"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={editingPolicy.expiryDate ? new Date(editingPolicy.expiryDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEditingPolicy({ ...editingPolicy, expiryDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Internal notes</label>
                                <textarea
                                    className="input-field"
                                    value={editingPolicy.notes || ''}
                                    onChange={(e) => setEditingPolicy({ ...editingPolicy, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditingPolicy(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCreatingPolicy && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button
                            onClick={() => setIsCreatingPolicy(false)}
                            aria-label="Close modal"
                            style={modalCloseButton}
                        >
                            <X size={20} />
                        </button>
                        <h3 style={modalTitle}>Create new policy</h3>
                        <form onSubmit={handleCreatePolicy}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select user</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Search user…"
                                        value={userSearch}
                                        onChange={(e) => {
                                            setUserSearch(e.target.value);
                                            setShowUserDropdown(true);
                                        }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        style={{ paddingRight: '2rem' }}
                                    />
                                    <ChevronDown
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--color-text-tertiary)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </div>
                                {showUserDropdown && (
                                    <div style={dropdownPanel}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u: any) => {
                                                const selected = newPolicy.userId === u._id;
                                                return (
                                                    <div
                                                        key={u._id}
                                                        onClick={() => selectUserForPolicy(u)}
                                                        style={{
                                                            padding: '0.75rem 0.9rem',
                                                            cursor: 'pointer',
                                                            background: selected ? 'var(--color-sand)' : 'transparent',
                                                            borderBottom: '1px solid var(--color-border)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                                {u.email}
                                                            </div>
                                                        </div>
                                                        {selected && <Check size={16} color="var(--color-terracotta)" />}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div
                                                style={{
                                                    padding: '0.85rem',
                                                    color: 'var(--color-text-tertiary)',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {newPolicy.userId && (
                                <div className="input-group">
                                    <label className="input-label">Select vehicle</label>
                                    <select
                                        className="input-field"
                                        value={newPolicy.vehicleId}
                                        onChange={(e) => setNewPolicy({ ...newPolicy, vehicleId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select vehicle</option>
                                        {data.vehicles
                                            .filter((v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId))
                                            .map((v: any) => (
                                                <option key={v._id} value={v._id}>
                                                    {v.vehicleModel} — {v.regNumber}
                                                </option>
                                            ))}
                                    </select>
                                    {data.vehicles.filter(
                                        (v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId),
                                    ).length === 0 && (
                                        <p
                                            style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--color-error)',
                                                marginTop: '0.375rem',
                                            }}
                                        >
                                            No vehicles found for this user.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Policy link</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={newPolicy.policyLink}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, policyLink: e.target.value })}
                                    placeholder="https://drive.google.com/…"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={newPolicy.expiryDate}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, expiryDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <select
                                    className="input-field"
                                    value={newPolicy.status}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Expiring Soon">Expiring soon</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingPolicy(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create policy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAddingVehicle && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setIsAddingVehicle(false)} aria-label="Close modal" style={modalCloseButton}>
                            <X size={20} />
                        </button>
                        <h3 style={modalTitle}>Add new vehicle</h3>
                        <form onSubmit={handleAddVehicle}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select user</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Search user…"
                                        value={userSearch}
                                        onChange={(e) => {
                                            setUserSearch(e.target.value);
                                            setShowUserDropdown(true);
                                        }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        style={{ paddingRight: '2rem' }}
                                    />
                                    <ChevronDown
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--color-text-tertiary)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </div>
                                {showUserDropdown && (
                                    <div style={dropdownPanel}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u: any) => {
                                                const selected = newVehicle.userId === u._id;
                                                return (
                                                    <div
                                                        key={u._id}
                                                        onClick={() => selectUserForVehicle(u)}
                                                        style={{
                                                            padding: '0.75rem 0.9rem',
                                                            cursor: 'pointer',
                                                            background: selected ? 'var(--color-sand)' : 'transparent',
                                                            borderBottom: '1px solid var(--color-border)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                                                                {u.email}
                                                            </div>
                                                        </div>
                                                        {selected && <Check size={16} color="var(--color-terracotta)" />}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div
                                                style={{
                                                    padding: '0.85rem',
                                                    color: 'var(--color-text-tertiary)',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Vehicle type</label>
                                <select
                                    className="input-field"
                                    value={newVehicle.type}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                >
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>

                            {newVehicle.type === 'Car' && (
                                <div className="input-group">
                                    <label className="input-label">Board type</label>
                                    <select
                                        className="input-field"
                                        value={newVehicle.boardType}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, boardType: e.target.value })}
                                    >
                                        <option value="Own Board">Own board</option>
                                        <option value="T Board">T board</option>
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Vehicle model</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newVehicle.vehicleModel}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })}
                                    placeholder="e.g. Swift Dzire"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Registration number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newVehicle.regNumber}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, regNumber: e.target.value })}
                                    placeholder="e.g. TN 38 AB 1234"
                                    required
                                />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddingVehicle(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCreatingUser && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setIsCreatingUser(false)} aria-label="Close modal" style={modalCloseButton}>
                            <X size={20} />
                        </button>
                        <h3 style={modalTitle}>Create new user</h3>
                        <form onSubmit={handleCreateUser}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone number (login ID)</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email (optional)</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingUser(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create user
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingUser && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setEditingUser(null)} aria-label="Close modal" style={modalCloseButton}>
                            <X size={20} />
                        </button>
                        <h3 style={modalTitle}>Edit user</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={editingUser.phone}
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
