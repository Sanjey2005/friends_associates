'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Edit, Plus, X, Trash2 } from 'lucide-react';
import {
    sectionTitle,
    modalOverlay,
    modalCard,
    modalCloseButton,
    modalTitle,
    modalActions,
    Pagination,
} from './shared';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';
import type { UserRecord } from '@/types/domain';

const ITEMS_PER_PAGE = 20;

interface Props {
    users: UserRecord[];
    onDataChange: () => void;
}

export default function AdminUsersTab({ users, onDataChange }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', email: '' });
    const [createdTempPassword, setCreatedTempPassword] = useState<string | null>(null);

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await apiFetch<{ message: string; tempPassword?: string }>('/api/users', {
                method: 'POST',
                body: jsonBody(newUser),
            });
            setNewUser({ name: '', phone: '', email: '' });
            setCreatedTempPassword(result.tempPassword ?? null);
            toast.success('User created successfully');
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to create user'));
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            await apiFetch('/api/users', {
                method: 'PUT',
                body: jsonBody(editingUser),
            });
            setEditingUser(null);
            toast.success('User updated successfully');
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to update user'));
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await apiFetch(`/api/users?id=${id}`, { method: 'DELETE' });
            toast.success('User deleted successfully');
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to delete user'));
        }
    };

    return (
        <>
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={sectionTitle}>Users</h2>
                    <button className="btn btn-primary" onClick={() => setIsCreatingUser(true)}>
                        <Plus size={16} /> Create user
                    </button>
                </div>

                <div style={{ position: 'relative', maxWidth: '420px', marginBottom: '1.25rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input type="text" placeholder="Search by name or email…" className="input-field" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
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
                            {paginatedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email || '—'}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setEditingUser(user)} aria-label="Edit user">
                                                <Edit size={14} />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDeleteUser(user._id)} aria-label="Delete user">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </section>

            {/* Create User Modal */}
            {isCreatingUser && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => { setIsCreatingUser(false); setCreatedTempPassword(null); }} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Create new user</h3>
                        {createdTempPassword ? (
                            <>
                                <div style={{ background: 'rgba(201,100,66,0.08)', border: '1px solid rgba(201,100,66,0.3)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-terracotta)' }}>⚠️ Share this temporary password with the user</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>This password is shown only once. The user should change it after first login.</p>
                                    <code style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-parchment)', padding: '0.5rem 0.75rem', borderRadius: '6px', display: 'block', textAlign: 'center', userSelect: 'all' }}>{createdTempPassword}</code>
                                </div>
                                <div style={modalActions}>
                                    <button className="btn btn-primary" onClick={() => { setIsCreatingUser(false); setCreatedTempPassword(null); }}>Done</button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleCreateUser}>
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input type="text" className="input-field" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phone number (login ID)</label>
                                    <input type="tel" className="input-field" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email (optional — temp password will be emailed)</label>
                                    <input type="email" className="input-field" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                                <div style={modalActions}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsCreatingUser(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create user</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setEditingUser(null)} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Edit user</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input type="text" className="input-field" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone number</label>
                                <input type="tel" className="input-field" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input type="email" className="input-field" value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
