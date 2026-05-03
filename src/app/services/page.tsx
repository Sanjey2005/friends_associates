import Navbar from '@/components/Navbar';
import { Car, Bike, Heart, Home as HomeIcon, Briefcase, Umbrella } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Services() {
    const insurances = [
        {
            name: 'Car Insurance',
            icon: <Car size={28} />,
            desc: 'Comprehensive coverage for your four-wheeler against accidents, theft, and third-party liabilities.',
        },
        {
            name: 'Bike Insurance',
            icon: <Bike size={28} />,
            desc: 'Protect your two-wheeler with our affordable plans covering damages and legal liabilities.',
        },
        {
            name: 'Health Insurance',
            icon: <Heart size={28} />,
            desc: "Secure your family's health with cashless treatments and coverage for medical emergencies.",
        },
        {
            name: 'Home Insurance',
            icon: <HomeIcon size={28} />,
            desc: 'Safeguard your home and belongings against natural calamities, theft, and fire.',
        },
        {
            name: 'Commercial Insurance',
            icon: <Briefcase size={28} />,
            desc: 'Tailored solutions for your business vehicles, assets, and liability protection.',
        },
        {
            name: 'Life Insurance',
            icon: <Umbrella size={28} />,
            desc: 'Ensure financial security for your loved ones with our term and endowment plans.',
        },
    ];

    const companies = [
        'HDFC Ergo',
        'ICICI Lombard',
        'Tata AIG',
        'Bajaj Allianz',
        'Star Health',
        'New India Assurance',
        'United India Insurance',
        'Oriental Insurance',
        'SBI General',
        'Reliance General',
    ];

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-parchment)' }}>
            <Navbar />

            {/* Hero — Parchment */}
            <section
                style={{
                    padding: '5.5rem 1.5rem 3.5rem',
                    background: 'var(--color-parchment)',
                }}
            >
                <div
                    className="container"
                    style={{ textAlign: 'center', maxWidth: '760px' }}
                >
                    <div className="eyebrow" style={{ marginBottom: '1rem' }}>
                        What we offer
                    </div>
                    <h1
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
                            fontWeight: 500,
                            lineHeight: 1.1,
                            letterSpacing: '-0.015em',
                            color: 'var(--color-text)',
                            marginBottom: '1.25rem',
                        }}
                    >
                        Insurance, considered carefully.
                    </h1>
                    <p
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '1.125rem',
                            lineHeight: 1.6,
                        }}
                    >
                        Comprehensive insurance solutions tailored to protect what matters most to you.
                    </p>
                </div>
            </section>

            <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
                {/* Service cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '6rem',
                    }}
                >
                    {insurances.map((item, index) => (
                        <div
                            key={index}
                            className="fade-in-up"
                            style={{
                                background: 'var(--color-ivory)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                animationDelay: `${index * 0.06}s`,
                                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                            }}
                        >
                            <div
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    background: 'rgba(201, 100, 66, 0.1)',
                                    color: 'var(--color-terracotta)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                {item.icon}
                            </div>

                            <h3
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.375rem',
                                    fontWeight: 500,
                                    marginBottom: '0.625rem',
                                    color: 'var(--color-text)',
                                    lineHeight: 1.25,
                                }}
                            >
                                {item.name}
                            </h3>

                            <p
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    lineHeight: 1.6,
                                    fontSize: '0.95rem',
                                }}
                            >
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Partner Companies */}
                <section style={{ textAlign: 'center' }}>
                    <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                        Our partners
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            lineHeight: 1.15,
                            letterSpacing: '-0.01em',
                            marginBottom: '0.75rem',
                        }}
                    >
                        India&apos;s most trusted insurers.
                    </h2>
                    <p
                        style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: '3rem',
                            fontSize: '1.0625rem',
                            lineHeight: 1.6,
                            maxWidth: '560px',
                            margin: '0 auto 3rem',
                        }}
                    >
                        We work with India&apos;s leading insurance providers to bring you thoughtful plans.
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.75rem',
                            maxWidth: '960px',
                            margin: '0 auto',
                        }}
                    >
                        {companies.map((company, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '1rem 1.25rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text-button-light)',
                                    textAlign: 'center',
                                    fontSize: '0.95rem',
                                    background: 'var(--color-ivory)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
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
