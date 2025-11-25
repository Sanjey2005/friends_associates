import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <Image
                            src="/logo.png"
                            alt="Friends Associates Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>Friends Associates</span>
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/services" style={{ fontWeight: 500, marginRight: '1rem' }}>
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
