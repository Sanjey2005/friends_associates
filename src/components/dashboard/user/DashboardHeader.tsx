'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';

interface DashboardHeaderProps {
    onOpenProfile: () => void;
    onLogout: () => void;
}

export function DashboardHeader({ onOpenProfile, onLogout }: DashboardHeaderProps) {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="Friends Associates logo"
                        width={48}
                        height={48}
                        style={{ objectFit: 'contain', borderRadius: '8px' }}
                        priority
                    />
                    <div>
                        <div className="logo" style={{ fontSize: '1.25rem', lineHeight: 1.1 }}>
                            Friends Associates
                        </div>
                        <div
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                            }}
                        >
                            User Dashboard
                        </div>
                    </div>
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onOpenProfile} className="btn btn-outline">
                        <Settings size={16} /> Profile
                    </button>
                    <button onClick={onLogout} className="btn btn-ghost">
                        <LogOut size={16} /> Log out
                    </button>
                </div>
            </div>
        </nav>
    );
}
