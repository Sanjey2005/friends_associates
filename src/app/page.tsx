import Navbar from '@/components/Navbar';
import QuoteForm from '@/components/QuoteForm';
import ShortsCarousel from '@/components/ShortsCarousel';
import Footer from '@/components/Footer';
import AnimatedHero from '@/components/AnimatedHero';
import PartnersCarousel from '@/components/PartnersCarousel';
import Link from 'next/link';
import Script from 'next/script';
import { Shield, Clock, Award, Wallet, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://friendsassociates.in';

export const metadata: Metadata = {
  title: {
    absolute: 'Friends Associates',
  },
  description:
    'Friends Associates provides car, bike, health, home, commercial, and life insurance support in Coimbatore, including quotes, renewals, claims guidance, and trusted insurer options.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Friends Associates Insurance Services in Coimbatore and Udumalpet',
    description:
      'Local insurance guidance for families, vehicle owners, and businesses in Coimbatore and Udumalpet.',
    url: '/',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Friends Associates',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  telephone: '+918220016649',
  foundingDate: '2009',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ho.187 Raju Naidu street, Dr Radhakrishna St, near Omni Bus stand',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    postalCode: '641012',
    addressCountry: 'IN',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Coimbatore',
    },
    {
      '@type': 'City',
      name: 'Udumalpet',
    }
  ],
  priceRange: '$$',
  serviceType: [
    'Car insurance',
    'Bike insurance',
    'Health insurance',
    'Home insurance',
    'Commercial insurance',
    'Life insurance',
    'Insurance renewal support',
    'Claims guidance',
  ],
};

export default function Home() {
  const features = [
    {
      icon: <Shield size={28} />,
      title: 'Local Insurance Guidance',
      desc: 'Support from branches in Coimbatore and Udumalpet for choosing car, bike, health, life, home, and business coverage with confidence.',
    },
    {
      icon: <Clock size={28} />,
      title: 'Renewal Reminders',
      desc: 'We help you stay ahead of policy expiry dates so your vehicle and family protection do not lapse.',
    },
    {
      icon: <Award size={28} />,
      title: 'Claims Guidance',
      desc: 'From documents to insurer coordination, our team guides you through the claim process when support matters most.',
    },
    {
      icon: <Wallet size={28} />,
      title: 'Trusted Insurer Options',
      desc: 'Partnerships with leading Indian insurers help us compare thoughtful plans for your budget and needs.',
    },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-parchment)' }}>
      <Script
        id="friends-associates-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Navbar />

      <AnimatedHero />

      {/* Features — adaptive surface */}
      <section
        style={{
          padding: '6rem 1.5rem',
          background: 'var(--color-ivory)',
          color: 'var(--color-text)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '720px', margin: '0 auto 4rem' }}>
            <div className="eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}>
              Why Friends Associates
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--color-text)',
                marginBottom: '1rem',
                letterSpacing: '-0.01em',
              }}
            >
              Insurance support for Tamilnadu families, vehicles, and businesses.
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1.125rem',
                lineHeight: 1.6,
              }}
            >
              With 15 years of experience, Friends Associates has helped customers compare policies, manage
              renewals, understand claims, and choose cover from trusted insurance providers.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="fade-in-up"
                style={{
                  background: 'var(--color-parchment)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  animationDelay: `${index * 0.06}s`,
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201, 100, 66, 0.12)',
                    color: 'var(--color-terracotta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {feature.icon}
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
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link
              href="/services"
              className="btn btn-primary"
              style={{
                padding: '0.875rem 1.75rem',
                fontSize: '1rem',
              }}
            >
              View insurance services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <PartnersCarousel />

      <ShortsCarousel />

      {/* Quote Form — Parchment */}
      <section
        id="quote"
        style={{ padding: '6rem 1.5rem', background: 'var(--color-parchment)' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '620px', margin: '0 auto 3rem' }}>
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
              Request a quote
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
              Tell us what you want to protect.
            </h2>
          </div>
          <QuoteForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
