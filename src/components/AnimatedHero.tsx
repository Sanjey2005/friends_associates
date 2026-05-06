'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedHero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ['local', 'personal', 'practical', 'trusted', 'timely'],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <section
            style={{
                padding: '7rem 1.5rem 6rem',
                background: 'var(--color-parchment)',
            }}
        >
            <div
                className="container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    textAlign: 'center',
                }}
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
                        fontSize: '0.8rem',
                        color: 'var(--color-text-button-light)',
                        letterSpacing: '0.02em',
                    }}
                >
                    <Sparkles size={14} style={{ color: 'var(--color-terracotta)' }} />
                    <span>COMPANY WITH 15 YEARS EXPERIENCE</span>
                </div>

                <h1
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 500,
                        lineHeight: 1.08,
                        letterSpacing: '-0.015em',
                        color: 'var(--color-text)',
                        maxWidth: '820px',
                        margin: 0,
                    }}
                >
                    <span>Insurance that feels</span>
                    <span
                        style={{
                            position: 'relative',
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.5rem',
                            minHeight: '1.2em',
                        }}
                    >
                        &nbsp;
                        {titles.map((title, index) => (
                            <motion.span
                                key={index}
                                style={{
                                    position: 'absolute',
                                    fontWeight: 600,
                                    color: 'var(--color-terracotta)',
                                    fontStyle: 'italic',
                                }}
                                initial={{ opacity: 0, y: -100 }}
                                transition={{ type: 'spring', stiffness: 50 }}
                                animate={
                                    titleNumber === index
                                        ? { y: 0, opacity: 1 }
                                        : {
                                              y: titleNumber > index ? -150 : 150,
                                              opacity: 0,
                                          }
                                }
                            >
                                {title}
                            </motion.span>
                        ))}
                    </span>
                </h1>

                <p
                    style={{
                        fontSize: '1.25rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '640px',
                        lineHeight: 1.6,
                        margin: 0,
                    }}
                >
                    Insurance support with branches in Coimbatore and Udumalpet for cars, bikes, health, life, homes,
                    and businesses — with quotes, renewals, claims guidance, and trusted
                    insurer options.
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
                        href="tel:8220016649"
                        className="btn btn-outline"
                        style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
                    >
                        Call an advisor
                        <PhoneCall size={18} />
                    </a>
                    <Link
                        href="#quote"
                        className="btn btn-primary"
                        style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
                    >
                        Request a quote
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
