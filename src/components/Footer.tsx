import { Phone, User, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer
            style={{
                background: 'var(--color-near-black)',
                color: 'var(--color-text-on-dark)',
                padding: '4rem 1rem 3rem',
                borderTop: '1px solid var(--color-border-dark)',
                marginTop: 'auto',
            }}
        >
            <div className="container" style={{ textAlign: 'center' }}>
                <div
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2rem',
                        fontWeight: 500,
                        color: 'var(--color-ivory)',
                        marginBottom: '2rem',
                        letterSpacing: '-0.01em',
                    }}
                >
                    Friends Associates
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <User size={18} style={{ color: 'var(--color-coral)' }} />
                        <span>Ethiraj R</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Phone size={18} style={{ color: 'var(--color-coral)' }} />
                        <span>8220016649, 82200166649</span>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                        maxWidth: '620px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    <MapPin
                        size={18}
                        style={{ flexShrink: 0, marginTop: '3px', color: 'var(--color-coral)' }}
                    />
                    <span>
                        Ho.187 Raju Naidu street, Dr Radhakrishna St, near Omni Bus stand,
                        Coimbatore, Tamil Nadu 641012
                    </span>
                </div>

                <div
                    style={{
                        borderTop: '1px solid var(--color-dark-surface)',
                        paddingTop: '1.5rem',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-tertiary)',
                    }}
                >
                    <p style={{ marginBottom: '0.5rem' }}>
                        Your trusted insurance partner since 2020
                    </p>
                    <p>© 2025 Friends Associates. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
