import mongoose, { Schema, Document, Model } from 'mongoose';
import { POLICY_STATUSES, type PolicyStatus } from '@/lib/constants';

export interface IPolicy extends Document {
    userId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    policyLink?: string;
    expiryDate: Date;
    notes?: string;
    status: PolicyStatus;
}

const PolicySchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    policyLink: { type: String },
    expiryDate: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: POLICY_STATUSES, default: 'Active' },
}, { timestamps: true });

// Indexes for common query patterns
PolicySchema.index({ userId: 1 });
PolicySchema.index({ expiryDate: 1 });
PolicySchema.index({ userId: 1, expiryDate: 1 });

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);

export default Policy;
