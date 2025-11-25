import { Phone, User } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            padding: '3rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.8)',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div className="logo" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                    Friends Associates
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}>
                        <User size={18} />
                        <span>Ethiraj R</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}>
                        <Phone size={18} />
                        <span>8220016649</span>
                    </div>
                </div>

                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                    Your trusted insurance partner since 2003
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    © 2025 Friends Associates. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
