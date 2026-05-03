import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserDashboard from '../page';
import { apiFetch } from '@/lib/api-client';

const push = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

vi.mock('next/image', () => ({
    default: () => <span data-testid="logo" />,
}));

vi.mock('@/components/Footer', () => ({
    default: () => <footer>Footer</footer>,
}));

vi.mock('@/components/ChatWidget', () => ({
    default: () => <div>Chat widget</div>,
}));

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
        apiFetch: vi.fn(),
    };
});

describe('UserDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(apiFetch).mockImplementation(async (input) => {
            if (input === '/api/vehicles') {
                return [{ _id: 'vehicle-id', type: 'Car', vehicleModel: 'Swift', regNumber: 'TN01AB1234', userId: 'user-id' }];
            }
            if (input === '/api/policies') {
                return [{
                    _id: 'policy-id',
                    userId: 'user-id',
                    vehicleId: { _id: 'vehicle-id', type: 'Car', vehicleModel: 'Swift', regNumber: 'TN01AB1234' },
                    expiryDate: '2026-12-31T00:00:00.000Z',
                    status: 'Active',
                    policyLink: 'https://example.com/policy.pdf',
                }];
            }
            if (input === '/api/user/profile') {
                return { _id: 'user-id', name: 'Sam User', phone: '9876543210', email: 'sam@example.com' };
            }
            return { message: 'ok' };
        });
    });

    it('renders customer policies and vehicles', async () => {
        render(<UserDashboard />);

        expect(await screen.findAllByText('Swift')).toHaveLength(2);
        expect(screen.getAllByText('TN01AB1234')).toHaveLength(2);
        expect(screen.getByText('View policy document')).toHaveAttribute('href', 'https://example.com/policy.pdf');
    });

    it('logs out through the server endpoint', async () => {
        const user = userEvent.setup();
        render(<UserDashboard />);

        await screen.findByText('My Policies');
        await user.click(screen.getByRole('button', { name: /log out/i }));

        await waitFor(() => {
            expect(apiFetch).toHaveBeenCalledWith('/api/auth/user/logout', { method: 'POST' });
            expect(push).toHaveBeenCalledWith('/login/user');
        });
    });
});
