'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import toast from 'react-hot-toast';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';
import type { UserRecord } from '@/types/domain';
import { DashboardHeader } from '@/components/dashboard/user/DashboardHeader';
import { PoliciesSection } from '@/components/dashboard/user/PoliciesSection';
import { ProfileModal } from '@/components/dashboard/user/ProfileModal';
import { VehiclesSection } from '@/components/dashboard/user/VehiclesSection';
import { useUserDashboardData } from '@/components/dashboard/user/useUserDashboardData';

export default function UserDashboard() {
    const router = useRouter();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const { vehicles, policies, user, setUser, loading, profileData, setProfileData } = useUserDashboardData();

    const handleLogout = async () => {
        await apiFetch('/api/auth/user/logout', { method: 'POST' });
        router.push('/login/user');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await apiFetch<{ user: UserRecord }>('/api/user/profile', {
                method: 'PUT',
                body: jsonBody(profileData),
            });
            setUser(res.user);
            toast.success('Profile updated successfully');
            setShowProfileModal(false);
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to update profile'));
        } finally {
            setSaving(false);
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
            <DashboardHeader onOpenProfile={() => setShowProfileModal(true)} onLogout={handleLogout} />

            <div className="container" style={{ padding: '3rem 1.5rem 4rem' }}>
                <PoliciesSection policies={policies} />
                <VehiclesSection vehicles={vehicles} />
            </div>

            {showProfileModal && (
                <ProfileModal
                    user={user}
                    profileData={profileData}
                    saving={saving}
                    onChange={setProfileData}
                    onClose={() => setShowProfileModal(false)}
                    onSubmit={handleUpdateProfile}
                />
            )}

            <ChatWidget />
            <Footer />
        </main>
    );
}
