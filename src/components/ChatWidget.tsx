'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('/api/chat', { withCredentials: true });
            if (res.data && res.data.messages) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) {
            console.log('Message is empty, not sending');
            return;
        }

        const messageText = newMessage.trim();
        console.log('Sending message:', messageText);
        setNewMessage('');
        setLoading(true);

        try {
            const response = await axios.post('/api/chat', { text: messageText }, { withCredentials: true });
            console.log('Message sent successfully:', response.data);
            await fetchMessages();
        } catch (error: any) {
            console.error('Error sending message:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            // Restore message on error
            setNewMessage(messageText);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary"
                    aria-label="Open support chat"
                    style={{
                        borderRadius: '50%',
                        width: '56px',
                        height: '56px',
                        padding: 0,
                        boxShadow: '0 8px 24px rgba(201, 100, 66, 0.25), 0 0 0 1px rgba(201, 100, 66, 0.35)',
                    }}
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div
                    style={{
                        width: '360px',
                        height: '520px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        background: 'var(--color-ivory)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 20px 48px rgba(20, 20, 19, 0.12)',
                    }}
                >
                    <div
                        style={{
                            padding: '1rem 1.25rem',
                            background: 'var(--color-near-black)',
                            color: 'var(--color-ivory)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--color-dark-surface)',
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                            }}
                        >
                            Support Chat
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-on-dark)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            padding: '1rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.625rem',
                            background: 'var(--color-parchment)',
                        }}
                    >
                        {messages.length === 0 && (
                            <p
                                style={{
                                    textAlign: 'center',
                                    color: 'var(--color-text-tertiary)',
                                    marginTop: '2rem',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                Ask us anything — we'll reply as soon as possible.
                            </p>
                        )}
                        {messages.map((msg, idx) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                                        maxWidth: '82%',
                                        padding: '0.625rem 0.875rem',
                                        borderRadius: '14px',
                                        borderBottomRightRadius: isUser ? '4px' : '14px',
                                        borderBottomLeftRadius: isUser ? '14px' : '4px',
                                        background: isUser
                                            ? 'var(--color-terracotta)'
                                            : 'var(--color-ivory)',
                                        color: isUser
                                            ? 'var(--color-ivory)'
                                            : 'var(--color-text)',
                                        border: isUser
                                            ? 'none'
                                            : '1px solid var(--color-border)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {msg.text}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSend}
                        style={{
                            padding: '0.75rem',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            gap: '0.5rem',
                            background: 'var(--color-ivory)',
                        }}
                    >
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Type a message…"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ padding: '0.625rem 0.75rem', fontSize: '0.9rem' }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            aria-label="Send message"
                            style={{ padding: '0.5rem 0.875rem' }}
                            disabled={loading}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
