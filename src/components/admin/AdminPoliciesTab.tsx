'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
    Search,
    Edit,
    X,
    Plus,
    Check,
    ChevronDown,
} from 'lucide-react';
import {
    sectionTitle,
    modalOverlay,
    modalCard,
    modalCloseButton,
    modalTitle,
    modalActions,
    dropdownPanel,
    badgeForStatus,
    Pagination,
} from './shared';

const ITEMS_PER_PAGE = 15;

interface Props {
    policies: any[];
    users: any[];
    vehicles: any[];
    onDataChange: () => void;
}

export default function AdminPoliciesTab({ policies, users, vehicles, onDataChange }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterExpiry, setFilterExpiry] = useState('');
    const [page, setPage] = useState(1);

    const [editingPolicy, setEditingPolicy] = useState<any>(null);
    const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
    const [newPolicy, setNewPolicy] = useState({ userId: '', vehicleId: '', policyLink: '', expiryDate: '', notes: '', status: 'Active' });
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter policies
    const filteredPolicies = policies.filter((p) => {
        const matchesSearch =
            !searchTerm ||
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

    // Pagination
    const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
    const paginatedPolicies = filteredPolicies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [searchTerm, filterType, filterExpiry]);

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(userSearch.toLowerCase()),
    );

    const selectUserForPolicy = (user: any) => {
        setNewPolicy({ ...newPolicy, userId: user._id, vehicleId: '' });
        setUserSearch(user.name);
        setShowUserDropdown(false);
    };

    const handleUpdatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put('/api/policies', {
                id: editingPolicy._id,
                policyLink: editingPolicy.policyLink,
                expiryDate: editingPolicy.expiryDate,
                notes: editingPolicy.notes,
            });
            setEditingPolicy(null);
            toast.success('Policy updated successfully');
            onDataChange();
        } catch (error) {
            toast.error('Failed to update policy');
        }
    };

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/policies', newPolicy);
            setIsCreatingPolicy(false);
            setNewPolicy({ userId: '', vehicleId: '', policyLink: '', expiryDate: '', notes: '', status: 'Active' });
            setUserSearch('');
            toast.success('Policy created successfully');
            onDataChange();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create policy');
        }
    };

    return (
        <>
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={sectionTitle}>Policies</h2>
                    <button className="btn btn-primary" onClick={() => setIsCreatingPolicy(true)}>
                        <Plus size={16} /> Create policy
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search user, email, reg number…"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="input-field" style={{ width: 'auto', minWidth: '140px' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All types</option>
                        <option value="Bike">Bike</option>
                        <option value="Car">Car</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                    <select className="input-field" style={{ width: 'auto', minWidth: '160px' }} value={filterExpiry} onChange={(e) => setFilterExpiry(e.target.value)}>
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
                            {paginatedPolicies.map((policy: any) => (
                                <tr key={policy._id}>
                                    <td>
                                        <div>{policy.userId?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{policy.userId?.email}</div>
                                    </td>
                                    <td>
                                        <div>{policy.vehicleId?.vehicleModel}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{policy.vehicleId?.regNumber}</div>
                                    </td>
                                    <td>{format(new Date(policy.expiryDate), 'dd MMM yyyy')}</td>
                                    <td><span className={badgeForStatus(policy.status)}>{policy.status || 'Active'}</span></td>
                                    <td>
                                        {policy.policyLink ? (
                                            <a href={policy.policyLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta)', textDecoration: 'underline', fontWeight: 500 }}>View</a>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setEditingPolicy(policy)} aria-label="Edit policy">
                                            <Edit size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </section>

            {/* Edit Policy Modal */}
            {editingPolicy && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setEditingPolicy(null)} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Update policy</h3>
                        <form onSubmit={handleUpdatePolicy}>
                            <div className="input-group">
                                <label className="input-label">Policy link</label>
                                <input type="url" className="input-field" value={editingPolicy.policyLink || ''} onChange={(e) => setEditingPolicy({ ...editingPolicy, policyLink: e.target.value })} placeholder="https://drive.google.com/…" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry date</label>
                                <input type="date" className="input-field" value={editingPolicy.expiryDate ? new Date(editingPolicy.expiryDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingPolicy({ ...editingPolicy, expiryDate: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Internal notes</label>
                                <textarea className="input-field" value={editingPolicy.notes || ''} onChange={(e) => setEditingPolicy({ ...editingPolicy, notes: e.target.value })} rows={3} />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditingPolicy(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Policy Modal */}
            {isCreatingPolicy && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setIsCreatingPolicy(false)} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Create new policy</h3>
                        <form onSubmit={handleCreatePolicy}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select user</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="input-field" placeholder="Search user…" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setShowUserDropdown(true); }} onFocus={() => setShowUserDropdown(true)} style={{ paddingRight: '2rem' }} />
                                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                                </div>
                                {showUserDropdown && (
                                    <div style={dropdownPanel}>
                                        {filteredUsers.length > 0 ? filteredUsers.map((u: any) => {
                                            const selected = newPolicy.userId === u._id;
                                            return (
                                                <div key={u._id} onClick={() => selectUserForPolicy(u)} style={{ padding: '0.75rem 0.9rem', cursor: 'pointer', background: selected ? 'var(--color-sand)' : 'transparent', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{u.email}</div>
                                                    </div>
                                                    {selected && <Check size={16} color="var(--color-terracotta)" />}
                                                </div>
                                            );
                                        }) : (
                                            <div style={{ padding: '0.85rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>No users found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {newPolicy.userId && (
                                <div className="input-group">
                                    <label className="input-label">Select vehicle</label>
                                    <select className="input-field" value={newPolicy.vehicleId} onChange={(e) => setNewPolicy({ ...newPolicy, vehicleId: e.target.value })} required>
                                        <option value="">Select vehicle</option>
                                        {vehicles.filter((v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId)).map((v: any) => (
                                            <option key={v._id} value={v._id}>{v.vehicleModel} — {v.regNumber}</option>
                                        ))}
                                    </select>
                                    {vehicles.filter((v: any) => v.userId && (v.userId._id === newPolicy.userId || v.userId === newPolicy.userId)).length === 0 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.375rem' }}>No vehicles found for this user.</p>
                                    )}
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Policy link</label>
                                <input type="url" className="input-field" value={newPolicy.policyLink} onChange={(e) => setNewPolicy({ ...newPolicy, policyLink: e.target.value })} placeholder="https://drive.google.com/…" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Expiry date</label>
                                <input type="date" className="input-field" value={newPolicy.expiryDate} onChange={(e) => setNewPolicy({ ...newPolicy, expiryDate: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <select className="input-field" value={newPolicy.status} onChange={(e) => setNewPolicy({ ...newPolicy, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="Expiring Soon">Expiring soon</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingPolicy(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create policy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
