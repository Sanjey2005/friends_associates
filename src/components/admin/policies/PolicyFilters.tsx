'use client';

import { Plus, Search } from 'lucide-react';
import { sectionTitle } from '../shared';

interface PolicyFiltersProps {
    searchTerm: string;
    filterType: string;
    filterExpiry: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onExpiryChange: (value: string) => void;
    onCreatePolicy: () => void;
}

export function PolicyFilters({
    searchTerm,
    filterType,
    filterExpiry,
    onSearchChange,
    onTypeChange,
    onExpiryChange,
    onCreatePolicy,
}: PolicyFiltersProps) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={sectionTitle}>Policies</h2>
                <button className="btn btn-primary" onClick={onCreatePolicy}>
                    <Plus size={16} /> Create policy
                </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Search user, email, reg number..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <select className="input-field" style={{ width: 'auto', minWidth: '140px' }} value={filterType} onChange={(e) => onTypeChange(e.target.value)}>
                    <option value="">All types</option>
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                    <option value="Commercial">Commercial</option>
                </select>
                <select className="input-field" style={{ width: 'auto', minWidth: '160px' }} value={filterExpiry} onChange={(e) => onExpiryChange(e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="soon">Expiring soon</option>
                    <option value="expired">Expired</option>
                </select>
            </div>
        </>
    );
}
