import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChatWidget from '../ChatWidget';
import { apiFetch } from '@/lib/api-client';

vi.mock('@/lib/api-client', async () => {
    const actual = await vi.importActual<typeof import('@/lib/api-client')>('@/lib/api-client');
    return {
        ...actual,
        apiFetch: vi.fn(),
    };
});

describe('ChatWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Element.prototype.scrollIntoView = vi.fn();
    });

    it('renders the empty state when no messages exist', async () => {
        vi.mocked(apiFetch).mockResolvedValue({ _id: 'chat-id', messages: [] });

        const user = userEvent.setup();
        render(<ChatWidget />);
        await user.click(screen.getByRole('button', { name: /open support chat/i }));

        expect(await screen.findByText(/Ask us anything/)).toBeInTheDocument();
    });

    it('sends messages and refreshes the chat', async () => {
        vi.mocked(apiFetch)
            .mockResolvedValueOnce({ _id: 'chat-id', messages: [] })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({ _id: 'chat-id', messages: [{ sender: 'user', text: 'Hello', timestamp: '2026-01-01T00:00:00.000Z' }] });

        const user = userEvent.setup();
        render(<ChatWidget />);
        await user.click(screen.getByRole('button', { name: /open support chat/i }));
        await user.type(screen.getByPlaceholderText('Type a message…'), 'Hello');
        await user.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(apiFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({ method: 'POST' }));
            expect(screen.getByText('Hello')).toBeInTheDocument();
        });
    });

    it('restores the message text when sending fails', async () => {
        vi.mocked(apiFetch)
            .mockResolvedValueOnce({ _id: 'chat-id', messages: [] })
            .mockRejectedValueOnce(new Error('send failed'));

        const user = userEvent.setup();
        render(<ChatWidget />);
        await user.click(screen.getByRole('button', { name: /open support chat/i }));
        await user.type(screen.getByPlaceholderText('Type a message…'), 'Retry me');
        await user.click(screen.getByRole('button', { name: /send message/i }));

        expect(await screen.findByDisplayValue('Retry me')).toBeInTheDocument();
    });
});
