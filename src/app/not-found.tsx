import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-parchment, #f5f3ed)',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    maxWidth: '480px',
                    background: 'var(--color-ivory, #faf9f5)',
                    border: '1px solid var(--color-border, #f0eee6)',
                    borderRadius: '12px',
                    padding: '3rem 2rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                }}
            >
                <div
                    style={{
                        fontFamily: 'var(--font-serif, Georgia, serif)',
                        fontSize: '6rem',
                        fontWeight: 500,
                        color: 'var(--color-terracotta, #c96442)',
                        lineHeight: 1,
                        marginBottom: '0.5rem',
                    }}
                >
                    404
                </div>
                <h1
                    style={{
                        fontFamily: 'var(--font-serif, Georgia, serif)',
                        fontSize: '1.75rem',
                        fontWeight: 500,
                        color: 'var(--color-text, #141413)',
                        marginBottom: '0.75rem',
                    }}
                >
                    Page not found
                </h1>
                <p
                    style={{
                        color: 'var(--color-text-secondary, #5e5d59)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                    }}
                >
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="btn btn-primary"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                    }}
                >
                    ← Back to home
                </Link>
            </div>
        </div>
    );
}
