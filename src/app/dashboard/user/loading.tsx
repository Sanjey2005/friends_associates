export default function UserLoading() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-parchment, #f5f3ed)',
                padding: '4rem 1.5rem',
            }}
        >
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header skeleton */}
                <div
                    style={{
                        height: '56px',
                        background: 'var(--color-ivory, #faf9f5)',
                        borderRadius: '8px',
                        marginBottom: '3rem',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />

                {/* Section title skeleton */}
                <div
                    style={{
                        width: '180px',
                        height: '28px',
                        background: 'var(--color-sand, #e8e6dc)',
                        borderRadius: '6px',
                        marginBottom: '1.5rem',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />

                {/* Cards skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: '180px',
                                background: 'var(--color-ivory, #faf9f5)',
                                border: '1px solid var(--color-border, #f0eee6)',
                                borderRadius: '12px',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Table skeleton */}
                <div
                    style={{
                        width: '160px',
                        height: '28px',
                        background: 'var(--color-sand, #e8e6dc)',
                        borderRadius: '6px',
                        marginBottom: '1.5rem',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />
                <div
                    style={{
                        height: '200px',
                        background: 'var(--color-ivory, #faf9f5)',
                        border: '1px solid var(--color-border, #f0eee6)',
                        borderRadius: '12px',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                />
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
