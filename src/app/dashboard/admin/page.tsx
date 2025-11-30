'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminAnalytics from '@/components/AdminAnalytics';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { LogOut, Search, Filter, Edit, Save, X, Plus, Car, Check, ChevronDown, MessageCircle, Send } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ policies: any[], leads: any[], users: any[], vehicles: any[], chats: any[] }>({
        policies: [],
        leads: [],
        users: [],
        vehicles: [],
        chats: [],
    });

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterExpiry, setFilterExpiry] = useState('');

    // Edit/Create States
    const [editingPolicy, setEditingPolicy] = useState<any>(null);
    const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);

    // New Policy/Vehicle Form Data
    const [newPolicy, setNewPolicy] = useState({ userId: '', vehicleId: '', policyLink: '', expiryDate: '', notes: '', status: 'Active' });
    const [newVehicle, setNewVehicle] = useState({ userId: '', type: 'Car', vehicleModel: '', regNumber: '', details: '', boardType: 'Own Board' });
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', email: '' });

    // User Search State for Modals
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Chat State
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

    // Poll for chats if on messages tab
    useEffect(() => {
        if (activeTab === 'messages') {
            const interval = setInterval(async () => {
                try {
                    const res = await axios.get('/api/chat?scope=admin', { withCredentials: true });
                    setData(prev => ({ ...prev, chats: res.data }));
                    // Update selected chat if open
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

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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

            setData(prev => ({
                ...prev,
                policies: prev.policies.map(p => p._id === editingPolicy._id ? res.data : p)
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
            setData(prev => ({ ...prev, policies: [...prev.policies, res.data] }));
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
            // Sanitize regNumber locally as well
            const sanitizedVehicle = {
                ...newVehicle,
                regNumber: newVehicle.regNumber.replace(/\s+/g, '')
            };

            const res = await axios.post('/api/vehicles', sanitizedVehicle);
            setData(prev => ({ ...prev, vehicles: [...prev.vehicles, res.data] }));
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
            setData(prev => ({ ...prev, users: [res.data.user, ...prev.users] }));
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
            setData(prev => ({
                ...prev,
                users: prev.users.map(u => u._id === editingUser._id ? res.data : u)
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
            setData(prev => ({
                ...prev,
                users: prev.users.filter(u => u._id !== id)
            }));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleUpdateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await axios.put('/api/leads', { id, status });
            setData(prev => ({
                ...prev,
                leads: prev.leads.map(l => l._id === id ? res.data : l)
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
            await axios.post('/api/chat', {
                text: adminMessage,
                userId: selectedChat.userId._id
            }, { withCredentials: true });
            setAdminMessage('');
            // Refresh data immediately
            const res = await axios.get('/api/chat?scope=admin', { withCredentials: true });
            setData(prev => ({ ...prev, chats: res.data }));
            const updatedChat = res.data.find((c: any) => c._id === selectedChat._id);
            if (updatedChat) setSelectedChat(updatedChat);
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    // Filter Policies
    const filteredPolicies = data.policies.filter(p => {
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

    // Filter Users for Modals
    const filteredUsers = data.users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
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

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

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
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Admin Dashboard</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
                    {['analytics', 'policies', 'leads', 'users', 'vehicles', 'messages'].map(tab => (
                        <button
                            key={tab}
                            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab(tab)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'analytics' && (
                    <AdminAnalytics policies={data.policies} leads={data.leads} vehicles={data.vehicles} />
                )}

                {activeTab === 'policies' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                                <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                        <input
                                            type="text"
                                            placeholder="Search user, email, reg number..."
                                            className="input-field"
                                            style={{ paddingLeft: '2.5rem' }}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <select className="input-field" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                                    <option value="">All Types</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Car">Car</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                                <select className="input-field" style={{ width: 'auto' }} value={filterExpiry} onChange={e => setFilterExpiry(e.target.value)}>
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="soon">Expiring Soon</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={() => setIsCreatingPolicy(true)}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create Policy
                            </button>
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Vehicle</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                        <th>Link</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPolicies.map(policy => (
                                        <tr key={policy._id}>
                                            <td>
                                                <div>{policy.userId?.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{policy.userId?.email}</div>
                                            </td>
                                            <td>
                                                <div>{policy.vehicleId?.vehicleModel}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{policy.vehicleId?.regNumber}</div>
                                            </td>
                                            <td>{format(new Date(policy.expiryDate), 'dd MMM yyyy')}</td>
                                            <td>
                                                <span className={`badge ${policy.status === 'Active' ? 'badge-success' :
                                                    policy.status === 'Expired' ? 'badge-error' : 'badge-warning'
                                                    }`}>
                                                    {policy.status}
                                                </span>
                                            </td>
                                            <td>
                                                {policy.policyLink ? (
                                                    <a href={policy.policyLink} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View</a>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setEditingPolicy(policy)}>
                                                    <Edit size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="card table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Vehicle</th>
                                    <th>Insurance Type</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.leads.map(lead => (
                                    <tr key={lead._id}>
                                        <td>{lead.name}</td>
                                        <td>
                                            <div>{lead.email}</div>
                                            <div style={{ fontSize: '0.8rem' }}>{lead.phone}</div>
                                        </td>
                                        <td>{lead.vehicleType} - {lead.vehicleModel}</td>
                                        <td>{lead.insuranceType}</td>
                                        <td>
                                            <select
                                                className="input-field"
                                                style={{ padding: '0.25rem', fontSize: '0.9rem', width: 'auto' }}
                                                value={lead.status || 'Not Completed'}
                                                onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                                            >
                                                <option value="Not Completed">Not Completed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Customer Didn’t Pick">Customer Didn’t Pick</option>
                                            </select>
                                        </td>
                                        <td>{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px', maxWidth: '400px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or phone..."
                                        className="input-field"
                                        style={{ paddingLeft: '2.5rem' }}
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={() => setIsCreatingUser(true)}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create User
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="table">
                                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {filteredUsers.map((user: any) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setEditingUser(user)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDeleteUser(user._id)}>
                                                        <div style={{ color: 'var(--error)' }}><X size={16} /></div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'vehicles' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <button className="btn btn-primary" onClick={() => setIsAddingVehicle(true)}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Vehicle
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="table">
                                <thead><tr><th>Owner</th><th>Type</th><th>Model</th><th>Reg Number</th><th>Board</th></tr></thead>
                                <tbody>
                                    {data.vehicles.map((v: any) => (
                                        <tr key={v._id}>
                                            <td>{v.userId?.name}</td>
                                            <td>{v.type}</td>
                                            <td>{v.vehicleModel}</td>
                                            <td>{v.regNumber}</td>
                                            <td>{v.type === 'Car' ? (v.boardType || 'Own Board') : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="card" style={{ height: '600px', display: 'flex', overflow: 'hidden', padding: 0 }}>
                        {/* Chat List */}
                        <div style={{ width: '300px', borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
                            {data.chats.length === 0 ? (
                                <div style={{ padding: '1rem', color: 'var(--text-light)', textAlign: 'center' }}>No messages yet</div>
                            ) : (
                                data.chats.map(chat => (
                                    <div
                                        key={chat._id}
                                        onClick={() => setSelectedChat(chat)}
                                        style={{
                                            padding: '1rem',
                                            cursor: 'pointer',
                                            background: selectedChat?._id === chat._id ? 'var(--primary-light)' : 'transparent',
                                            borderBottom: '1px solid var(--border)'
                                        }}
                                    >
                                        <div style={{ fontWeight: 600 }}>{chat.userId?.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{chat.userId?.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                            {format(new Date(chat.lastUpdated), 'dd MMM HH:mm')}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Chat Window */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {selectedChat ? (
                                <>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                                        <h3 style={{ margin: 0 }}>{selectedChat.userId?.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{selectedChat.userId?.email}</span>
                                    </div>
                                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)' }}>
                                        {selectedChat.messages.map((msg: any, idx: number) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                                    maxWidth: '70%',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '1rem',
                                                    borderBottomRightRadius: msg.sender === 'admin' ? 0 : '1rem',
                                                    borderBottomLeftRadius: msg.sender === 'user' ? 0 : '1rem',
                                                    background: msg.sender === 'admin' ? 'var(--primary)' : 'var(--surface-light)',
                                                    color: msg.sender === 'admin' ? 'white' : 'var(--text)',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <div>{msg.text}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                                    {format(new Date(msg.timestamp), 'HH:mm')}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <form onSubmit={handleSendAdminMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: 'var(--surface)' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Type a reply..."
                                            value={adminMessage}
                                            onChange={(e) => setAdminMessage(e.target.value)}
                                            style={{ padding: '0.75rem' }}
                                        />
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', flexDirection: 'column' }}>
                                    <MessageCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Policy Modal */}
            {editingPolicy && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>Update Policy</h3>
                            <button onClick={() => setEditingPolicy(null)} className="btn-icon"><X /></button>
                        </div>
                        <form onSubmit={handleUpdatePolicy}>
                            <div className="input-group">
                                <label className="input-label">Policy Link</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={editingPolicy.policyLink || ''}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, policyLink: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={editingPolicy.expiryDate ? new Date(editingPolicy.expiryDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, expiryDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Internal Notes</label>
                                <textarea
                                    className="input-field"
                                    value={editingPolicy.notes || ''}
                                    onChange={e => setEditingPolicy({ ...editingPolicy, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setEditingPolicy(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Policy Modal */}
            {isCreatingPolicy && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>Create New Policy</h3>
                            <button onClick={() => setIsCreatingPolicy(false)} className="btn-icon"><X /></button>
                        </div>
                        <form onSubmit={handleCreatePolicy}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select User</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Search user..."
                                        value={userSearch}
                                        onChange={e => { setUserSearch(e.target.value); setShowUserDropdown(true); }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        style={{ paddingRight: '2rem' }}
                                    />
                                    <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
                                </div>

                                {showUserDropdown && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        maxHeight: '200px', overflowY: 'auto',
                                        border: '1px solid var(--border)', borderRadius: '0.5rem',
                                        background: '#1e293b', zIndex: 50,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u: any) => (
                                                <div
                                                    key={u._id}
                                                    onClick={() => selectUserForPolicy(u)}
                                                    style={{
                                                        padding: '0.75rem',
                                                        cursor: 'pointer',
                                                        background: newPolicy.userId === u._id ? 'var(--primary-light)' : 'transparent',
                                                        borderBottom: '1px solid var(--border)',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{u.email}</div>
                                                    </div>
                                                    {newPolicy.userId === u._id && <Check size={16} color="var(--primary)" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>No users found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {newPolicy.userId && (
                                <div className="input-group">
                                    <label className="input-label">Select Vehicle</label>
                                    <select
                                        className="input-field"
                                        value={newPolicy.vehicleId}
                                        onChange={e => setNewPolicy({ ...newPolicy, vehicleId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Vehicle</option>
                                        {data.vehicles
                                            .filter((v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId))
                                            .map((v: any) => (
                                                <option key={v._id} value={v._id}>{v.vehicleModel} - {v.regNumber}</option>
                                            ))
                                        }
                                    </select>
                                    {data.vehicles.filter((v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId)).length === 0 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.25rem' }}>No vehicles found for this user.</p>
                                    )}
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Policy Link</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={newPolicy.policyLink}
                                    onChange={e => setNewPolicy({ ...newPolicy, policyLink: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={newPolicy.expiryDate}
                                    onChange={e => setNewPolicy({ ...newPolicy, expiryDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <select
                                    className="input-field"
                                    value={newPolicy.status}
                                    onChange={e => setNewPolicy({ ...newPolicy, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Expiring Soon">Expiring Soon</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingPolicy(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Policy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Vehicle Modal */}
            {isAddingVehicle && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>Add New Vehicle</h3>
                            <button onClick={() => setIsAddingVehicle(false)} className="btn-icon"><X /></button>
                        </div>
                        <form onSubmit={handleAddVehicle}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select User</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Search user..."
                                        value={userSearch}
                                        onChange={e => { setUserSearch(e.target.value); setShowUserDropdown(true); }}
                                        onFocus={() => setShowUserDropdown(true)}
                                        style={{ paddingRight: '2rem' }}
                                    />
                                    <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
                                </div>

                                {showUserDropdown && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        maxHeight: '200px', overflowY: 'auto',
                                        border: '1px solid var(--border)', borderRadius: '0.5rem',
                                        background: '#1e293b', zIndex: 50,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u: any) => (
                                                <div
                                                    key={u._id}
                                                    onClick={() => selectUserForVehicle(u)}
                                                    style={{
                                                        padding: '0.75rem',
                                                        cursor: 'pointer',
                                                        background: newVehicle.userId === u._id ? 'var(--primary-light)' : 'transparent',
                                                        borderBottom: '1px solid var(--border)',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{u.email}</div>
                                                    </div>
                                                    {newVehicle.userId === u._id && <Check size={16} color="var(--primary)" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>No users found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Vehicle Type</label>
                                <select
                                    className="input-field"
                                    value={newVehicle.type}
                                    onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                >
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>

                            {newVehicle.type === 'Car' && (
                                <div className="input-group">
                                    <label className="input-label">Board Type</label>
                                    <select
                                        className="input-field"
                                        value={newVehicle.boardType}
                                        onChange={e => setNewVehicle({ ...newVehicle, boardType: e.target.value })}
                                    >
                                        <option value="Own Board">Own Board</option>
                                        <option value="T Board">T Board</option>
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Vehicle Model</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newVehicle.vehicleModel}
                                    onChange={e => setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })}
                                    placeholder="e.g. Swift Dzire"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Registration Number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newVehicle.regNumber}
                                    onChange={e => setNewVehicle({ ...newVehicle, regNumber: e.target.value })}
                                    placeholder="e.g. TN 38 AB 1234"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddingVehicle(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {isCreatingUser && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>Create New User</h3>
                            <button onClick={() => setIsCreatingUser(false)} className="btn-icon"><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone Number (Login ID)</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={newUser.phone}
                                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email (Optional)</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingUser(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>Edit User</h3>
                            <button onClick={() => setEditingUser(null)} className="btn-icon"><X /></button>
                        </div>
                        <form onSubmit={handleUpdateUser}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editingUser.name}
                                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={editingUser.phone}
                                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={editingUser.email || ''}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    width: 90%; 
                    max-width: 500px; 
                    max-height: 90vh; 
                    overflow-y: auto;
                    margin: auto;
                }
                .modal-header {
                    display: flex; justifyContent: space-between; align-items: center; margin-bottom: 1.5rem;
                }
                .btn-icon {
                    background: none; border: none; cursor: pointer; color: var(--text-light);
                }
                .btn-icon:hover { color: var(--text); }
                .modal-actions {
                    display: flex; gap: 1rem; justifyContent: flex-end; margin-top: 1.5rem;
                }
                .dropdown-item:hover {
                    background: var(--bg-secondary) !important;
                }
            `}</style>
            <Footer />
        </main>
    );
}
