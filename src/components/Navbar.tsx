import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
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
                    <Link href="/login/user" className="btn btn-outline">
                        User Login
                    </Link>
                    <Link href="/login/admin" className="btn btn-primary">
                        Admin Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
