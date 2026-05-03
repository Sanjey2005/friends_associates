'use client';

import { Car } from 'lucide-react';
import type { VehicleRecord } from '@/types/domain';
import { userSectionTitle } from './styles';

interface VehiclesSectionProps {
    vehicles: VehicleRecord[];
}

export function VehiclesSection({ vehicles }: VehiclesSectionProps) {
    return (
        <section>
            <h2 style={userSectionTitle}>
                <Car size={26} style={{ color: 'var(--color-terracotta)' }} />
                My Vehicles
            </h2>
            {vehicles.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    No vehicles found yet.
                </p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Model</th>
                                <th>Registration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle._id}>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.vehicleModel}</td>
                                    <td>{vehicle.regNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
