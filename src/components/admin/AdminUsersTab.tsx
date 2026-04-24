'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
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

const ITEMS_PER_PAGE = 20;

interface Props {
    users: any[];
    onDataChange: () => void;
}

export default function AdminUsersTab({ users, onDataChange }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', email: '' });

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    useEffect(() => { setPage(1); }, [searchTerm]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/users', newUser);
            setIsCreatingUser(false);
            setNewUser({ name: '', phone: '', email: '' });
            toast.success('User created successfully');
            onDataChange();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put('/api/users', editingUser);
            setEditingUser(null);
            toast.success('User updated successfully');
            onDataChange();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`/api/users?id=${id}`);
            toast.success('User deleted successfully');
            onDataChange();
        } catch (error) {
            toast.error('Failed to delete user');
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
                    <input type="text" placeholder="Search by name or email…" className="input-field" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                            {paginatedUsers.map((user: any) => (
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
                        <button onClick={() => setIsCreatingUser(false)} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Create new user</h3>
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
                                <label className="input-label">Email (optional)</label>
                                <input type="email" className="input-field" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsCreatingUser(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create user</button>
                            </div>
                        </form>
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
