import Navbar from '@/components/Navbar';
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Clock, Award, Wallet, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Shield size={28} />,
      title: 'Personalized Service',
      desc: 'We take the time to understand your unique needs and craft coverage that fits your life.',
    },
    {
      icon: <Clock size={28} />,
      title: 'Fast Claims Processing',
      desc: 'Our streamlined claims process ensures you get the support you need, when you need it.',
    },
    {
      icon: <Award size={28} />,
      title: 'Comprehensive Coverage',
      desc: 'Policies that cover every meaningful aspect of your insurance needs — nothing left to chance.',
    },
    {
      icon: <Wallet size={28} />,
      title: 'Competitive Rates',
      desc: 'Partnerships with top providers let us offer the best coverage at thoughtful prices.',
    },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-parchment)' }}>
      <Navbar />

      {/* Hero Section — Parchment */}
      <section
        style={{
          padding: '7rem 1.5rem 6rem',
          background: 'var(--color-parchment)',
        }}
      >
        <div
          className="container"
          style={{ textAlign: 'center', maxWidth: '860px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--color-sand)',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid var(--color-border-warm)',
              marginBottom: '2rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-button-light)',
              letterSpacing: '0.02em',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--color-terracotta)' }} />
            <span>5 Years of Excellence</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.015em',
              color: 'var(--color-text)',
              marginBottom: '1.5rem',
            }}
          >
            Your one-stop solution<br />
            to every insurance need.
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Protect what matters most with tailored insurance solutions from Friends Associates —
            thoughtful, personal, and unhurried.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#quote"
              className="btn btn-primary"
              style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
            >
              Get a free quote
              <ArrowRight size={18} />
            </a>
            <Link
              href="/services"
              className="btn btn-outline"
              style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
            >
              Explore services
            </Link>
          </div>
        </div>
      </section>

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
              Coverage that reads like a thoughtful letter.
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1.125rem',
                lineHeight: 1.6,
              }}
            >
              Five years of experience in the Indian insurance industry, and every conversation
              still starts the same way: what matters to you?
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
              Explore our services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

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
              Tell us a little about you.
            </h2>
          </div>
          <QuoteForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
