import Navbar from '@/components/Navbar';
import { Car, Bike, Bus, Truck, Package, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://friendsassociates.in';

export const metadata: Metadata = {
    title: 'Services',
    description:
        'Explore Friends Associates insurance services in Coimbatore, including car, bike, health, home, commercial, and life insurance with renewal and claims guidance.',
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        title: 'Insurance Services in Coimbatore | Friends Associates',
        description:
            'Compare car, bike, health, home, commercial, and life insurance options with local support from Friends Associates.',
        url: '/services',
    },
};

const faqs = [
    {
        question: 'Which documents are usually needed for vehicle insurance?',
        answer:
            'For vehicle insurance, customers typically need registration details, previous policy information if available, owner details, and vehicle information such as model and manufacturing year.',
    },
    {
        question: 'Can Friends Associates help with an expired policy?',
        answer:
            'Yes. The team can review the expired policy details, explain available renewal or fresh policy options, and guide customers through the next steps.',
    },
    {
        question: 'Do you help customers compare multiple insurers?',
        answer:
            'Yes. Friends Associates works with leading Indian insurers and helps customers compare suitable coverage options based on their budget, vehicle, family, or business needs.',
    },
    {
        question: 'Do you provide claims guidance?',
        answer:
            'Yes. Friends Associates guides customers on claim documentation, insurer coordination, and the practical steps needed after an incident.',
    },
];

const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Friends Associates Insurance Services',
    url: `${siteUrl}/services`,
    itemListElement: [
        'Car Insurance',
        'Bike Insurance',
        'Health Insurance',
        'Home Insurance',
        'Commercial Insurance',
        'Life Insurance',
    ].map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
            '@type': 'Service',
            name,
            provider: {
                '@type': 'InsuranceAgency',
                name: 'Friends Associates',
                url: siteUrl,
            },
            areaServed: {
                '@type': 'City',
                name: 'Coimbatore',
            },
        },
    })),
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
};

export default function Services() {
    const insurances = [
        {
            name: '2W (Two Wheeler)',
            icon: <Bike size={28} />,
            desc: 'Affordable two-wheeler plans for third-party compliance, own damage protection, renewals, and everyday road risks.',
            bestFor: 'Scooters and motorcycles',
            cta: 'Renew 2W policy',
        },
        {
            name: 'Car',
            icon: <Car size={28} />,
            desc: 'Coverage guidance for accidents, theft, third-party liability, own damage, renewals, and claim support for private cars.',
            bestFor: 'Private car owners',
            cta: 'Get car quote',
        },
        {
            name: 'School Bus',
            icon: <Bus size={28} />,
            desc: 'Comprehensive protection options for school buses, ensuring passenger safety and operational compliance.',
            bestFor: 'Schools and educational institutions',
            cta: 'Protect school bus',
        },
        {
            name: 'Auto 3W',
            icon: <Package size={28} />,
            desc: 'Commercial insurance for three-wheelers, covering passenger liability and vehicle damage.',
            bestFor: 'Auto rickshaw drivers and owners',
            cta: 'Get Auto 3W quote',
        },
        {
            name: 'Tata Ace',
            icon: <Truck size={28} />,
            desc: 'Specialized goods-carrying commercial vehicle (GCCV) insurance for mini-trucks like Tata Ace.',
            bestFor: 'Logistics and goods transport',
            cta: 'Insure Tata Ace',
        },
        {
            name: 'Lorry',
            icon: <Truck size={28} />,
            desc: 'Heavy goods vehicle insurance covering cargo risks, third-party liability, and transit damages.',
            bestFor: 'Fleet operators and transport businesses',
            cta: 'Discuss lorry cover',
        },
    ];

    const companies = [
        'ICICI Lombard',
        'Tata AIG',
        'SBI General Insurance',
        'IndusInd General Insurance',
        'Cholamandalam MS GIC Ltd',
        'IFFCO Tokio',
        'Royal Sundram',
        'HDFC Ergo',
        'Bajaj Allianz',
        'Policy Bazaar',
        'Niva Bupa Health Insurance',
        'United India',
        'National Insurance',
    ];

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-parchment)' }}>
            <Script
                id="friends-associates-services"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
            />
            <Script
                id="friends-associates-services-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
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
                        Car, bike, health, home, commercial, and life insurance support in Coimbatore,
                        with renewal reminders, claims guidance, and trusted insurer options.
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
                                    marginBottom: '1rem',
                                }}
                            >
                                {item.desc}
                            </p>

                            <p
                                style={{
                                    color: 'var(--color-text-button-light)',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    marginBottom: '1.25rem',
                                }}
                            >
                                Best for: {item.bestFor}
                            </p>

                            <Link
                                href="/#quote"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    color: 'var(--color-terracotta)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                }}
                            >
                                {item.cta}
                                <ArrowRight size={15} />
                            </Link>
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

                <section style={{ marginTop: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '640px', margin: '0 auto 3rem' }}>
                        <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                            Common questions
                        </div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                lineHeight: 1.15,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Insurance decisions, made clearer.
                        </h2>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {faqs.map((faq) => (
                            <div
                                key={faq.question}
                                style={{
                                    background: 'var(--color-ivory)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.5rem',
                                }}
                            >
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '1.125rem',
                                        fontWeight: 500,
                                        color: 'var(--color-text)',
                                        lineHeight: 1.3,
                                        marginBottom: '0.625rem',
                                    }}
                                >
                                    {faq.question}
                                </h3>
                                <p
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 1.6,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
