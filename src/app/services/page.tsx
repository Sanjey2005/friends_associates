import Navbar from '@/components/Navbar';
import { Car, Bike, Heart, Home as HomeIcon, Briefcase, Umbrella } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Services() {
    const insurances = [
        { name: 'Car Insurance', icon: <Car size={36} />, desc: 'Comprehensive coverage for your four-wheeler against accidents, theft, and third-party liabilities.', color: '#6366f1' },
        { name: 'Bike Insurance', icon: <Bike size={36} />, desc: 'Protect your two-wheeler with our affordable plans covering damages and legal liabilities.', color: '#8b5cf6' },
        { name: 'Health Insurance', icon: <Heart size={36} />, desc: 'Secure your family\'s health with cashless treatments and coverage for medical emergencies.', color: '#ec4899' },
        { name: 'Home Insurance', icon: <HomeIcon size={36} />, desc: 'Safeguard your home and belongings against natural calamities, theft, and fire.', color: '#f59e0b' },
        { name: 'Commercial Insurance', icon: <Briefcase size={36} />, desc: 'Tailored solutions for your business vehicles, assets, and liability protection.', color: '#22c55e' },
        { name: 'Life Insurance', icon: <Umbrella size={36} />, desc: 'Ensure financial security for your loved ones with our term and endowment plans.', color: '#06b6d4' },
    ];

    const companies = [
        'HDFC Ergo', 'ICICI Lombard', 'Tata AIG', 'Bajaj Allianz',
        'Star Health', 'New India Assurance', 'United India Insurance',
        'Oriental Insurance', 'SBI General', 'Reliance General'
    ];

    return (
        <main style={{ minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{
                padding: '5rem 1rem 3rem',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Our Insurance Services
                    </h1>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                        margin: '0 auto 1.5rem',
                        borderRadius: '9999px'
                    }}></div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Comprehensive insurance solutions tailored to protect what matters most to you
                    </p>
                </div>
            </section>

            <div className="container" style={{ padding: '4rem 1rem' }}>
                {/* Insurance Services Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginBottom: '6rem'
                }}>
                    {insurances.map((item, index) => (
                        <div key={index} className="card fade-in-up" style={{
                            padding: '2.5rem',
                            animationDelay: `${index * 0.1}s`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50px',
                                right: '-50px',
                                width: '150px',
                                height: '150px',
                                background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                                borderRadius: '50%',
                            }}></div>

                            <div style={{
                                color: item.color,
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'center',
                                background: `${item.color}20`,
                                width: '80px',
                                height: '80px',
                                borderRadius: '1rem',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {item.icon}
                            </div>

                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                marginBottom: '1rem',
                                color: 'var(--text)',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {item.name}
                            </h3>

                            <p style={{
                                color: 'var(--text-light)',
                                lineHeight: 1.7,
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Partner Companies Section */}
                <section style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Our Trusted Partners
                    </h2>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                        margin: '0 auto 1.5rem',
                        borderRadius: '9999px'
                    }}></div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                        We work with India's leading insurance providers to bring you the best plans
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {companies.map((company, index) => (
                            <div key={index} className="card" style={{
                                padding: '1.5rem',
                                fontWeight: 600,
                                color: 'var(--text)',
                                textAlign: 'center',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                transition: 'all 0.3s ease'
                            }}>
                                {company}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
