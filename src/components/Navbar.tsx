import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <Image
                        src="/logo.png"
                        alt="Friends Associates Logo"
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain' }}
                    />
                    <span className="logo" style={{ fontSize: '1.5rem', margin: 0 }}>Friends Associates</span>
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/services" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>Services</Link>
                    <Link href="/login/user" className="btn btn-outline">User Login</Link>
                    <Link href="/login/admin" className="btn btn-primary">Admin Login</Link>
                </div>
            </div>
        </nav>
    );
}
