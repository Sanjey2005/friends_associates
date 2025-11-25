import Navbar from '@/components/Navbar';
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Clock, Award, Wallet, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '6rem 1rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={16} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>5 Years of Excellence</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your One Stop Solution to<br />Your Insurance Needs
          </h1>

          <div style={{
            width: '80px',
            height: '5px',
            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            margin: '0 auto 2rem',
            borderRadius: '9999px'
          }}></div>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-light)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.8
          }}>
            Protect what matters most with tailored insurance solutions from Friends Associates
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#quote" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              Get Free Quote <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </a>
            <Link href="/services" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Why Choose Friends Associates
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1, #ec4899)',
              margin: '0 auto 1.5rem',
              borderRadius: '9999px'
            }}></div>
            <p style={{ color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
              With 5 years of experience in the Indian insurance industry, we deliver exceptional service and personalized solutions for all your insurance needs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: <Shield size={40} />, title: 'Personalized Service', desc: 'We take the time to understand your unique needs and provide customized solutions that fit your life.', color: '#6366f1' },
              { icon: <Clock size={40} />, title: 'Fast Claims Processing', desc: 'Our streamlined claims process ensures you get the support you need when you need it most.', color: '#8b5cf6' },
              { icon: <Award size={40} />, title: 'Comprehensive Coverage', desc: 'We offer complete protection with policies that cover all aspects of your insurance needs.', color: '#ec4899' },
              { icon: <Wallet size={40} />, title: 'Competitive Rates', desc: 'Our partnerships with top insurance providers allow us to offer the best coverage at affordable prices.', color: '#f59e0b' }
            ].map((feature, index) => (
              <div key={index} className="card fade-in-up" style={{
                textAlign: 'center',
                padding: '2.5rem',
                animationDelay: `${index * 0.1}s`
              }}>
                <div style={{
                  color: feature.color,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  alignItems: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/services" className="btn btn-primary gradient-animate" style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              padding: '1.25rem 3rem',
              fontSize: '1.1rem',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
            }}>
              EXPLORE OUR SERVICES <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" style={{ padding: '5rem 1rem', background: 'rgba(30, 41, 59, 0.3)' }}>
        <div className="container">
          <QuoteForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
