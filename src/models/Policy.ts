import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPolicy extends Document {
    userId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    policyLink?: string;
    expiryDate: Date;
    notes?: string;
    status: 'Active' | 'Expired' | 'Expiring Soon';
}

const PolicySchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    policyLink: { type: String },
    expiryDate: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Expired', 'Expiring Soon'], default: 'Active' },
}, { timestamps: true });

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);

export default Policy;
