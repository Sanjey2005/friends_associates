'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const shorts = [
  { id: '1', videoId: 'TrEIKZDmWx8' },
  { id: '2', videoId: 'TrEIKZDmWx8' },
  { id: '3', videoId: 'TrEIKZDmWx8' },
  { id: '4', videoId: 'TrEIKZDmWx8' },
];

export default function ShortsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--color-ivory)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '0.75rem' }}>
            Featured
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 500,
              color: 'var(--color-text)',
              marginBottom: '1rem',
              lineHeight: 1.15,
            }}
          >
            Watch Our Short Ads
          </h2>
        </div>

        <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto' }}>
          <div ref={emblaRef} style={{ overflow: 'hidden', padding: '1rem 0' }}>
            <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
              {shorts.map((short) => (
                <div
                  key={short.id}
                  style={{
                    flex: '0 0 auto',
                    width: '315px', // Standard shorts width
                    height: '560px', // Standard shorts height
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-whisper)',
                    background: 'var(--color-parchment)',
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${short.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: '-20px',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-ivory)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-whisper)',
              color: 'var(--color-text)',
              zIndex: 10,
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-20px',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-ivory)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-whisper)',
              color: 'var(--color-text)',
              zIndex: 10,
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
