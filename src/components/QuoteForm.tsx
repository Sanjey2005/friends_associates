'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Phone } from 'lucide-react';
import { apiFetch, errorMessage, jsonBody } from '@/lib/api-client';

export default function QuoteForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        product: '',
        vehicleModel: '',
        mfgYear: '',
        regNumber: '',
        insuranceType: '',
        additionalInfo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiFetch('/api/leads', {
                method: 'POST',
                body: jsonBody(formData),
            });
            toast.success('Quote request submitted successfully! We will contact you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                product: '',
                vehicleModel: '',
                mfgYear: '',
                regNumber: '',
                insuranceType: '',
                additionalInfo: '',
            });
        } catch (error) {
            toast.error(errorMessage(error, 'Failed to submit quote. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="card"
            style={{
                maxWidth: '820px',
                margin: '0 auto',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-ivory)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-whisper)',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.15,
                    }}
                >
                    Get a Quote
                </h2>
                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.0625rem',
                        lineHeight: 1.6,
                        maxWidth: '520px',
                        margin: '0 auto',
                    }}
                >
                    Share a few details and our team will help compare suitable
                    insurance options for your vehicle, family, home, or business.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            name="name"
                            required
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Email Address *</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                            <input
                                type="email"
                                name="email"
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Phone Number *</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Product *</label>
                        <select
                            name="product"
                            required
                            className="input-field"
                            value={formData.product}
                            onChange={handleChange}
                        >
                            <option value="">Select Product</option>
                            <option value="2W">2W</option>
                            <option value="CAR">CAR</option>
                            <option value="GCCV">GCCV</option>
                            <option value="PCCV">PCCV</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Vehicle Model</label>
                        <input
                            type="text"
                            name="vehicleModel"
                            className="input-field"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Manufacturing Year</label>
                        <input
                            type="number"
                            name="mfgYear"
                            className="input-field"
                            value={formData.mfgYear}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Registration Number</label>
                        <input
                            type="text"
                            name="regNumber"
                            className="input-field"
                            value={formData.regNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Insurance Type *</label>
                    <select
                        name="insuranceType"
                        required
                        className="input-field"
                        value={formData.insuranceType}
                        onChange={handleChange}
                    >
                        <option value="">Select Insurance Type</option>
                        <option value="Comprehensive">Comprehensive</option>
                        <option value="Third Party">Third Party</option>
                        <option value="Own Damage">Own Damage</option>
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label">Additional Information</label>
                    <textarea
                        name="additionalInfo"
                        className="input-field"
                        rows={4}
                        value={formData.additionalInfo}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        marginTop: '1.5rem',
                        padding: '0.875rem 1.5rem',
                        fontSize: '1rem',
                        letterSpacing: '0.02em',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Submitting…' : 'Get Insurance Quote'}
                </button>
            </form>
        </div>
    );
}
