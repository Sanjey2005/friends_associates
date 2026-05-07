import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
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
                        alt="Friends Associates Logo"
                        width={56}
                        height={56}
                        style={{ objectFit: 'contain', borderRadius: '8px' }}
                    />
                    <span className="logo">Friends Associates</span>
                </Link>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                    }}
                >
                    <ThemeToggle />
                    <Link
                        href="/services"
                        style={{
                            color: 'var(--color-text-strong)',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            padding: '0.5rem 0.75rem',
                        }}
                    >
                        Services
                    </Link>
                    {isAdmin ? (
                        <Link href="https://admin.friendsassociates.org" className="btn btn-primary">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/login/user" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
