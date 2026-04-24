export default function AdminLoading() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-parchment, #f5f3ed)',
                padding: '4rem 1.5rem',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Navbar skeleton */}
                <div
                    style={{
                        height: '56px',
                        background: 'var(--color-ivory, #faf9f5)',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />

                {/* Tabs skeleton */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '100px',
                                height: '36px',
                                background: 'var(--color-sand, #e8e6dc)',
                                borderRadius: '6px',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Content skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: '200px',
                                background: 'var(--color-ivory, #faf9f5)',
                                border: '1px solid var(--color-border, #f0eee6)',
                                borderRadius: '12px',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
