'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Car, Calendar, FileText, Info } from 'lucide-react';

export default function QuoteForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleType: '',
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
            await axios.post('/api/leads', formData);
            toast.success('Quote request submitted successfully! We will contact you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                vehicleType: '',
                vehicleModel: '',
                mfgYear: '',
                regNumber: '',
                insuranceType: '',
                additionalInfo: '',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit quote. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Get in Touch</h2>
                <p style={{ color: 'var(--text-light)' }}>
                    Fill in your details below and our team will get back to you with the best insurance options for your needs.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
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
                        <label className="input-label">Vehicle Type *</label>
                        <select
                            name="vehicleType"
                            required
                            className="input-field"
                            value={formData.vehicleType}
                            onChange={handleChange}
                        >
                            <option value="">Select Type</option>
                            <option value="Bike">Bike</option>
                            <option value="Car">Car</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Other">Other</option>
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
                    style={{ width: '100%', marginTop: '1rem', background: '#d946ef' }} // Pinkish button from screenshot
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'GET INSURANCE QUOTE'}
                </button>
            </form>
        </div>
    );
}
