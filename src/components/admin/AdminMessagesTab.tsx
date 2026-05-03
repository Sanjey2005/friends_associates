'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { MessageCircle, Send } from 'lucide-react';
import { sectionTitle } from './shared';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';
import type { ChatMessage, ChatRecord } from '@/types/domain';

interface Props {
    chats: ChatRecord[];
    onDataChange: () => void;
}

export default function AdminMessagesTab({ chats, onDataChange }: Props) {
    const [selectedChat, setSelectedChat] = useState<ChatRecord | null>(null);
    const [adminMessage, setAdminMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = await apiFetch<ChatRecord[]>('/api/chat?scope=admin');
                if (selectedChat) {
                    const updatedChat = data.find((chat) => chat._id === selectedChat._id);
                    if (updatedChat) setSelectedChat(updatedChat);
                }
                onDataChange();
            } catch (error) {
                console.error(error);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedChat, onDataChange]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat]);

    const handleSendAdminMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminMessage.trim() || !selectedChat) return;
        try {
            const userId = typeof selectedChat.userId === 'object' ? selectedChat.userId._id : selectedChat.userId;
            await apiFetch('/api/chat', {
                method: 'POST',
                body: jsonBody({ text: adminMessage, userId }),
            });
            setAdminMessage('');
            const data = await apiFetch<ChatRecord[]>('/api/chat?scope=admin');
            const updatedChat = data.find((chat) => chat._id === selectedChat._id);
            if (updatedChat) setSelectedChat(updatedChat);
            onDataChange();
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to send message'));
        }
    };

    return (
        <section>
            <h2 style={sectionTitle}>Messages</h2>
            <div
                style={{
                    height: '600px',
                    display: 'flex',
                    overflow: 'hidden',
                    background: 'var(--color-ivory)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                }}
            >
                {/* Chat list sidebar */}
                <div
                    style={{
                        width: '300px',
                        borderRight: '1px solid var(--color-border)',
                        overflowY: 'auto',
                        background: 'var(--color-parchment)',
                    }}
                >
                    {chats.length === 0 ? (
                        <div style={{ padding: '1.25rem', color: 'var(--color-text-tertiary)', textAlign: 'center', fontSize: '0.9rem' }}>
                            No messages yet
                        </div>
                    ) : (
                        chats.map((chat) => {
                            const isActive = selectedChat?._id === chat._id;
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    style={{
                                        padding: '0.9rem 1rem',
                                        cursor: 'pointer',
                                        background: isActive ? 'var(--color-ivory)' : 'transparent',
                                        borderBottom: '1px solid var(--color-border)',
                                        borderLeft: isActive ? '3px solid var(--color-terracotta)' : '3px solid transparent',
                                    }}
                                >
                                    <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{typeof chat.userId === 'object' ? chat.userId.name : 'Unknown user'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{typeof chat.userId === 'object' ? chat.userId.email : ''}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                                        {format(new Date(chat.lastUpdated), 'dd MMM HH:mm')}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Chat messages */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {selectedChat ? (
                        <>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-ivory)' }}>
                                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-text)' }}>
                                    {typeof selectedChat.userId === 'object' ? selectedChat.userId.name : 'Unknown user'}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{typeof selectedChat.userId === 'object' ? selectedChat.userId.email : ''}</span>
                            </div>
                            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--color-parchment)' }}>
                                {selectedChat.messages.map((msg: ChatMessage, idx: number) => {
                                    const isAdmin = msg.sender === 'admin';
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%',
                                                padding: '0.65rem 0.9rem',
                                                borderRadius: 'var(--radius-md)',
                                                borderBottomRightRadius: isAdmin ? '4px' : 'var(--radius-md)',
                                                borderBottomLeftRadius: isAdmin ? 'var(--radius-md)' : '4px',
                                                background: isAdmin ? 'var(--color-terracotta)' : 'var(--color-ivory)',
                                                color: isAdmin ? 'var(--color-ivory)' : 'var(--color-text)',
                                                border: isAdmin ? 'none' : '1px solid var(--color-border-warm)',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            <div>{msg.text}</div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: '0.25rem', textAlign: 'right' }}>
                                                {format(new Date(msg.timestamp), 'HH:mm')}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendAdminMessage} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', background: 'var(--color-ivory)' }}>
                                <input type="text" className="input-field" placeholder="Type a reply…" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} />
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 0.9rem' }} aria-label="Send message">
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', flexDirection: 'column', gap: '0.75rem' }}>
                            <MessageCircle size={44} style={{ opacity: 0.4 }} />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
