'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import type { PolicyRecord, UserRecord, VehicleRecord } from '@/types/domain';

export function useUserDashboardData() {
    const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
    const [policies, setPolicies] = useState<PolicyRecord[]>([]);
    const [user, setUser] = useState<UserRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ name: '', email: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesData, policiesData, userData] = await Promise.all([
                    apiFetch<VehicleRecord[]>('/api/vehicles'),
                    apiFetch<PolicyRecord[]>('/api/policies'),
                    apiFetch<UserRecord>('/api/user/profile'),
                ]);
                setVehicles(vehiclesData);
                setPolicies(policiesData);
                setUser(userData);
                setProfileData({ name: userData.name, email: userData.email || '' });
            } catch (error) {
                console.error('Error fetching data:', error);
                window.location.href = '/login/user';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        vehicles,
        policies,
        user,
        setUser,
        loading,
        profileData,
        setProfileData,
    };
}
