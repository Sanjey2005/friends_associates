import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleModel?: string;
    mfgYear?: string;
    regNumber?: string;
    insuranceType: string;
    additionalInfo?: string;
    status: 'Completed' | 'Not Completed' | 'Customer Didn’t Pick';
    createdAt: Date;
}

const LeadSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleModel: { type: String },
    mfgYear: { type: String },
    regNumber: { type: String },
    insuranceType: { type: String, required: true },
    additionalInfo: { type: String },
    status: { 
        type: String, 
        enum: ['Completed', 'Not Completed', 'Customer Didn’t Pick'],
        default: 'Not Completed'
    },
}, { timestamps: true });

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
