'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import { sectionTitle, Pagination } from './shared';

const ITEMS_PER_PAGE = 20;

interface Props {
    leads: any[];
    onDataChange: () => void;
}

export default function AdminLeadsTab({ leads, onDataChange }: Props) {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
    const paginatedLeads = leads.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleUpdateLeadStatus = async (id: string, status: string) => {
        try {
            await axios.put('/api/leads', { id, status });
            toast.success('Lead status updated');
            onDataChange();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
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
                        {paginatedLeads.map((lead: any) => (
                            <tr key={lead._id}>
                                <td>{lead.name}</td>
                                <td>
                                    <div>{lead.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{lead.phone}</div>
                                </td>
                                <td>{lead.vehicleType} — {lead.vehicleModel}</td>
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
                                        <option value="Customer Didn't Pick">Customer didn&apos;t pick</option>
                                    </select>
                                </td>
                                <td>{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
    );
}
