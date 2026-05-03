import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPoliciesTab from '../AdminPoliciesTab';
import { apiFetch } from '@/lib/api-client';
import type { PolicyRecord, UserRecord, VehicleRecord } from '@/types/domain';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('@/lib/api-client', async () => {
    const actual = await vi.importActual<typeof import('@/lib/api-client')>('@/lib/api-client');
    return {
        ...actual,
        apiFetch: vi.fn().mockResolvedValue({}),
    };
});

const users: UserRecord[] = [
    { _id: 'user-id', name: 'Sam User', phone: '9876543210', email: 'sam@example.com' },
];

const vehicles: VehicleRecord[] = [
    { _id: 'vehicle-id', userId: 'user-id', type: 'Car', vehicleModel: 'Swift', regNumber: 'TN01AB1234' },
];

const policies: PolicyRecord[] = [
    {
        _id: 'policy-id',
        userId: users[0],
        vehicleId: vehicles[0],
        policyLink: 'https://example.com/policy.pdf',
        expiryDate: '2026-12-31T00:00:00.000Z',
        status: 'Active',
    },
];

describe('AdminPoliciesTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders policy rows and filters by search term', async () => {
        const user = userEvent.setup();
        render(<AdminPoliciesTab policies={policies} users={users} vehicles={vehicles} onDataChange={vi.fn()} />);

        expect(screen.getByText('Sam User')).toBeInTheDocument();
        expect(screen.getByText('TN01AB1234')).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText('Search user, email, reg number...'), 'missing');

        expect(screen.queryByText('Sam User')).not.toBeInTheDocument();
    });

    it('creates a policy with selected user and vehicle', async () => {
        const user = userEvent.setup();
        const onDataChange = vi.fn();
        render(<AdminPoliciesTab policies={[]} users={users} vehicles={vehicles} onDataChange={onDataChange} />);

        await user.click(screen.getByRole('button', { name: /create policy/i }));
        await user.type(screen.getByPlaceholderText('Search user...'), 'Sam');
        await user.click(screen.getByText('Sam User'));
        await user.selectOptions(screen.getByLabelText('Select vehicle'), 'vehicle-id');
        await user.type(screen.getByLabelText('Expiry date'), '2026-12-31');
        await user.click(screen.getAllByRole('button', { name: /create policy/i })[1]);

        await waitFor(() => {
            expect(apiFetch).toHaveBeenCalledWith('/api/policies', expect.objectContaining({ method: 'POST' }));
            expect(onDataChange).toHaveBeenCalled();
        });
    });

    it('updates an existing policy', async () => {
        const user = userEvent.setup();
        const onDataChange = vi.fn();
        render(<AdminPoliciesTab policies={policies} users={users} vehicles={vehicles} onDataChange={onDataChange} />);

        await user.click(screen.getByRole('button', { name: /edit policy/i }));
        const linkInput = screen.getByDisplayValue('https://example.com/policy.pdf');
        await user.clear(linkInput);
        await user.type(linkInput, 'https://example.com/new.pdf');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(apiFetch).toHaveBeenCalledWith('/api/policies', expect.objectContaining({ method: 'PUT' }));
            expect(onDataChange).toHaveBeenCalled();
        });
    });
});
