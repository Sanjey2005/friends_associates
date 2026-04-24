'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface Partner {
  id: string;
  name: string;
  domain?: string;
}

const defaultPartners: Partner[] = [
  { id: 'lic', name: 'LIC of India', domain: 'licindia.in' },
  { id: 'hdfc-life', name: 'HDFC Life', domain: 'hdfclife.com' },
  { id: 'icici-pru', name: 'ICICI Prudential', domain: 'iciciprulife.com' },
  { id: 'sbi-life', name: 'SBI Life', domain: 'sbilife.co.in' },
  { id: 'max-life', name: 'Max Life', domain: 'maxlifeinsurance.com' },
  { id: 'bajaj-allianz', name: 'Bajaj Allianz', domain: 'bajajallianz.com' },
  { id: 'tata-aig', name: 'Tata AIG', domain: 'tataaig.com' },
  { id: 'star-health', name: 'Star Health', domain: 'starhealth.in' },
  { id: 'new-india', name: 'New India Assurance', domain: 'newindia.co.in' },
  { id: 'reliance-gen', name: 'Reliance General', domain: 'reliancegeneral.co.in' },
];

interface Props {
  heading?: string;
  partners?: Partner[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((p) => !/^(of|the|and|&)$/i.test(p));
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  const src = partner.domain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(partner.domain)}&sz=128`
    : null;

  const showFallback = !src || failed;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        background: 'var(--color-ivory)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        minWidth: '200px',
        height: '72px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-warm)';
        e.currentTarget.style.boxShadow = 'var(--shadow-whisper)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-border-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          color: 'var(--color-terracotta)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: '0.85rem',
          letterSpacing: '0.02em',
        }}
      >
        {showFallback ? (
          partner.name ? (
            <span>{getInitials(partner.name)}</span>
          ) : (
            <Building2 size={20} />
          )
        ) : (
          <img
            src={src!}
            alt={`${partner.name} logo`}
            width={32}
            height={32}
            loading="lazy"
            onError={() => setFailed(true)}
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          fontSize: '0.95rem',
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
        }}
      >
        {partner.name}
      </span>
    </div>
  );
}

export default function PartnersCarousel({
  heading = 'Trusted by India\u2019s leading insurers',
  partners = defaultPartners,
}: Props) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true }, [
    AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const loopList = [...partners, ...partners];

  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--color-parchment)',
        color: 'var(--color-text)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <div className="eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}>
            Our partners
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'var(--color-text)',
            }}
          >
            {heading}
          </h2>
        </div>

        <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto' }}>
          <div ref={emblaRef} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {loopList.map((partner, i) => (
                <div
                  key={`${partner.id}-${i}`}
                  style={{ flex: '0 0 auto', minWidth: 0 }}
                >
                  <PartnerLogo partner={partner} />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '80px',
              background: 'linear-gradient(to right, var(--color-parchment), transparent)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '80px',
              background: 'linear-gradient(to left, var(--color-parchment), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </section>
  );
}
