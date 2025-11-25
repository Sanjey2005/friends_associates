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
            const res = await axios.get('/api/chat');
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
            const response = await axios.post('/api/chat', { text: messageText });
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
                    style={{
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        padding: 0,
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.5)'
                    }}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="card" style={{
                    width: '350px',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <div style={{
                        padding: '1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Support Chat</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: 'var(--surface)'
                    }}>
                        {messages.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>
                                Ask us anything! We'll reply as soon as possible.
                            </p>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomRightRadius: msg.sender === 'user' ? 0 : '1rem',
                                    borderBottomLeftRadius: msg.sender === 'admin' ? 0 : '1rem',
                                    background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-light)',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: 'var(--background)' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ padding: '0.75rem' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }} disabled={loading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
