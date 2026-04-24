'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h1
                    style={{
                        fontFamily: 'var(--font-serif, Georgia, serif)',
                        fontSize: '1.75rem',
                        fontWeight: 500,
                        color: 'var(--color-text, #141413)',
                        marginBottom: '0.75rem',
                    }}
                >
                    Something went wrong
                </h1>
                <p
                    style={{
                        color: 'var(--color-text-secondary, #5e5d59)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                    }}
                >
                    We encountered an unexpected error. Please try again or contact support if the problem persists.
                </p>
                <button
                    onClick={reset}
                    className="btn btn-primary"
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
