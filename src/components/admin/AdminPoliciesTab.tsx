'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Pagination } from './shared';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';
import type { PolicyRecord, UserRecord, VehicleRecord } from '@/types/domain';
import { PolicyCreateModal } from './policies/PolicyCreateModal';
import { PolicyEditModal } from './policies/PolicyEditModal';
import { PolicyFilters } from './policies/PolicyFilters';
import { PolicyTable } from './policies/PolicyTable';
import {
    ITEMS_PER_PAGE,
    defaultPolicyFormState,
    filterPolicies,
    filterUsers,
    type PolicyFormState,
} from './policies/policyHelpers';

interface Props {
    policies: PolicyRecord[];
    users: UserRecord[];
    vehicles: VehicleRecord[];
    onDataChange: () => void;
}

export default function AdminPoliciesTab({ policies, users, vehicles, onDataChange }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterExpiry, setFilterExpiry] = useState('');
    const [page, setPage] = useState(1);
    const [editingPolicy, setEditingPolicy] = useState<PolicyRecord | null>(null);
    const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
    const [newPolicy, setNewPolicy] = useState<PolicyFormState>(defaultPolicyFormState);
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

    const filteredPolicies = filterPolicies(policies, searchTerm, filterType, filterExpiry);
    const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
    const paginatedPolicies = filteredPolicies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const filteredUsers = filterUsers(users, userSearch);

    const resetPolicyFilters = (setter: (value: string) => void, value: string) => {
        setter(value);
        setPage(1);
    };

    const selectUserForPolicy = (user: UserRecord) => {
        setNewPolicy({ ...newPolicy, userId: user._id, vehicleId: '' });
        setUserSearch(user.name);
        setShowUserDropdown(false);
    };

    const closeCreateModal = () => {
        setIsCreatingPolicy(false);
        setNewPolicy(defaultPolicyFormState);
        setUserSearch('');
        setShowUserDropdown(false);
    };

    const handleUpdatePolicy = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingPolicy) return;

        try {
            await apiFetch('/api/policies', {
                method: 'PUT',
                body: jsonBody({
                    id: editingPolicy._id,
                    policyLink: editingPolicy.policyLink,
                    expiryDate: editingPolicy.expiryDate,
                    notes: editingPolicy.notes,
                }),
            });
            setEditingPolicy(null);
            toast.success('Policy updated successfully');
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to update policy'));
        }
    };

    const handleCreatePolicy = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await apiFetch('/api/policies', {
                method: 'POST',
                body: jsonBody(newPolicy),
            });
            closeCreateModal();
            toast.success('Policy created successfully');
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to create policy'));
        }
    };

    return (
        <>
            <section>
                <PolicyFilters
                    searchTerm={searchTerm}
                    filterType={filterType}
                    filterExpiry={filterExpiry}
                    onSearchChange={(value) => resetPolicyFilters(setSearchTerm, value)}
                    onTypeChange={(value) => resetPolicyFilters(setFilterType, value)}
                    onExpiryChange={(value) => resetPolicyFilters(setFilterExpiry, value)}
                    onCreatePolicy={() => setIsCreatingPolicy(true)}
                />
                <PolicyTable policies={paginatedPolicies} onEditPolicy={setEditingPolicy} />
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </section>

            {editingPolicy && (
                <PolicyEditModal
                    policy={editingPolicy}
                    onChange={setEditingPolicy}
                    onClose={() => setEditingPolicy(null)}
                    onSubmit={handleUpdatePolicy}
                />
            )}

            {isCreatingPolicy && (
                <PolicyCreateModal
                    newPolicy={newPolicy}
                    users={users}
                    vehicles={vehicles}
                    filteredUsers={filteredUsers}
                    userSearch={userSearch}
                    showUserDropdown={showUserDropdown}
                    dropdownRef={dropdownRef}
                    onPolicyChange={setNewPolicy}
                    onUserSearchChange={setUserSearch}
                    onShowUserDropdownChange={setShowUserDropdown}
                    onSelectUser={selectUserForPolicy}
                    onClose={closeCreateModal}
                    onSubmit={handleCreatePolicy}
                />
            )}
        </>
    );
}
