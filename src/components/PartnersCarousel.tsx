'use client';

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface Partner {
  id: string;
  name: string;
  tagline?: string;
  accent?: string;
  font?: 'serif' | 'sans';
  weight?: number;
  tracking?: string;
}

const defaultPartners: Partner[] = [
  { id: 'lic', name: 'LIC', tagline: 'of India', accent: '#1a3a7a', font: 'serif', weight: 700, tracking: '0.02em' },
  { id: 'hdfc-life', name: 'HDFC Life', accent: '#b53333', font: 'sans', weight: 700, tracking: '-0.01em' },
  { id: 'icici-pru', name: 'ICICI Prudential', accent: '#a8281f', font: 'sans', weight: 600, tracking: '-0.01em' },
  { id: 'sbi-life', name: 'SBI Life', accent: '#1b4aa0', font: 'sans', weight: 700, tracking: '0.02em' },
  { id: 'max-life', name: 'Max Life', accent: '#1f3a6b', font: 'serif', weight: 600 },
  { id: 'bajaj-allianz', name: 'Bajaj Allianz', accent: '#003d7a', font: 'sans', weight: 700, tracking: '-0.01em' },
  { id: 'tata-aig', name: 'Tata AIG', accent: '#0a2f5e', font: 'sans', weight: 700, tracking: '0.04em' },
  { id: 'star-health', name: 'Star Health', accent: '#c96442', font: 'serif', weight: 600 },
  { id: 'new-india', name: 'New India Assurance', accent: '#1a5f3a', font: 'serif', weight: 600 },
  { id: 'reliance-gen', name: 'Reliance General', accent: '#2b2b2b', font: 'sans', weight: 700, tracking: '-0.01em' },
];

interface Props {
  heading?: string;
  partners?: Partner[];
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {loopList.map((partner, i) => (
                <div
                  key={`${partner.id}-${i}`}
                  style={{
                    flex: '0 0 auto',
                    minWidth: 0,
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '96px',
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        partner.font === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                      fontWeight: partner.weight ?? 600,
                      fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
                      letterSpacing: partner.tracking ?? '0',
                      color: partner.accent ?? 'var(--color-text)',
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: '0.35em',
                      opacity: 0.78,
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.78';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {partner.name}
                    {partner.tagline && (
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 400,
                          fontSize: '0.7em',
                          color: 'var(--color-text-secondary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {partner.tagline}
                      </span>
                    )}
                  </span>
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
