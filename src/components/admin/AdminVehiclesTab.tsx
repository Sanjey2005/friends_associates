'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Plus, X, Check, ChevronDown } from 'lucide-react';
import {
    sectionTitle,
    modalOverlay,
    modalCard,
    modalCloseButton,
    modalTitle,
    modalActions,
    dropdownPanel,
    Pagination,
} from './shared';

const ITEMS_PER_PAGE = 20;

interface Props {
    vehicles: any[];
    users: any[];
    onDataChange: () => void;
}

export default function AdminVehiclesTab({ vehicles, users, onDataChange }: Props) {
    const [page, setPage] = useState(1);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ userId: '', type: 'Car', vehicleModel: '', regNumber: '', details: '', boardType: 'Own Board' });
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
    const paginatedVehicles = vehicles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(userSearch.toLowerCase()),
    );

    const selectUserForVehicle = (user: any) => {
        setNewVehicle({ ...newVehicle, userId: user._id });
        setUserSearch(user.name);
        setShowUserDropdown(false);
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedVehicle = { ...newVehicle, regNumber: newVehicle.regNumber.replace(/\s+/g, '') };
            await axios.post('/api/vehicles', sanitizedVehicle);
            setIsAddingVehicle(false);
            setNewVehicle({ userId: '', type: 'Car', vehicleModel: '', regNumber: '', details: '', boardType: 'Own Board' });
            setUserSearch('');
            toast.success('Vehicle added successfully');
            onDataChange();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to add vehicle');
        }
    };

    return (
        <>
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                            {paginatedVehicles.map((v: any) => (
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
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </section>

            {/* Add Vehicle Modal */}
            {isAddingVehicle && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <button onClick={() => setIsAddingVehicle(false)} aria-label="Close modal" style={modalCloseButton}><X size={20} /></button>
                        <h3 style={modalTitle}>Add new vehicle</h3>
                        <form onSubmit={handleAddVehicle}>
                            <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                                <label className="input-label">Select user</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="input-field" placeholder="Search user…" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setShowUserDropdown(true); }} onFocus={() => setShowUserDropdown(true)} style={{ paddingRight: '2rem' }} />
                                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                                </div>
                                {showUserDropdown && (
                                    <div style={dropdownPanel}>
                                        {filteredUsers.length > 0 ? filteredUsers.map((u: any) => {
                                            const selected = newVehicle.userId === u._id;
                                            return (
                                                <div key={u._id} onClick={() => selectUserForVehicle(u)} style={{ padding: '0.75rem 0.9rem', cursor: 'pointer', background: selected ? 'var(--color-sand)' : 'transparent', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                            <div className="input-group">
                                <label className="input-label">Vehicle type</label>
                                <select className="input-field" value={newVehicle.type} onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>

                            {newVehicle.type === 'Car' && (
                                <div className="input-group">
                                    <label className="input-label">Board type</label>
                                    <select className="input-field" value={newVehicle.boardType} onChange={(e) => setNewVehicle({ ...newVehicle, boardType: e.target.value })}>
                                        <option value="Own Board">Own board</option>
                                        <option value="T Board">T board</option>
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">Vehicle model</label>
                                <input type="text" className="input-field" value={newVehicle.vehicleModel} onChange={(e) => setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })} placeholder="e.g. Swift Dzire" required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Registration number</label>
                                <input type="text" className="input-field" value={newVehicle.regNumber} onChange={(e) => setNewVehicle({ ...newVehicle, regNumber: e.target.value })} placeholder="e.g. TN 38 AB 1234" required />
                            </div>
                            <div style={modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsAddingVehicle(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
