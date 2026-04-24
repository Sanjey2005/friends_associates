'use client';

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

const defaultPartners: Partner[] = [
  { id: 'lic', name: 'LIC', logo: 'https://logo.clearbit.com/licindia.in' },
  { id: 'hdfc-life', name: 'HDFC Life', logo: 'https://logo.clearbit.com/hdfclife.com' },
  { id: 'icici-pru', name: 'ICICI Prudential', logo: 'https://logo.clearbit.com/iciciprulife.com' },
  { id: 'sbi-life', name: 'SBI Life', logo: 'https://logo.clearbit.com/sbilife.co.in' },
  { id: 'max-life', name: 'Max Life', logo: 'https://logo.clearbit.com/maxlifeinsurance.com' },
  { id: 'bajaj-allianz', name: 'Bajaj Allianz', logo: 'https://logo.clearbit.com/bajajallianz.com' },
  { id: 'tata-aig', name: 'Tata AIG', logo: 'https://logo.clearbit.com/tataaig.com' },
  { id: 'star-health', name: 'Star Health', logo: 'https://logo.clearbit.com/starhealth.in' },
  { id: 'new-india', name: 'New India Assurance', logo: 'https://logo.clearbit.com/newindia.co.in' },
  { id: 'reliance-gen', name: 'Reliance General', logo: 'https://logo.clearbit.com/reliancegeneral.co.in' },
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
                    height: '88px',
                  }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    style={{
                      height: '48px',
                      width: 'auto',
                      maxWidth: '160px',
                      objectFit: 'contain',
                      filter: 'grayscale(100%)',
                      opacity: 0.72,
                      transition: 'filter 0.2s ease, opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%)';
                      e.currentTarget.style.opacity = '0.72';
                    }}
                  />
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
