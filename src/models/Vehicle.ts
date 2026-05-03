import mongoose, { Schema, Document, Model } from 'mongoose';
import { BOARD_TYPES, VEHICLE_TYPES, type BoardType, type VehicleType } from '@/lib/constants';

export interface IVehicle extends Document {
    userId: mongoose.Types.ObjectId;
    type: VehicleType;
    vehicleModel: string;
    regNumber: string;
    boardType?: BoardType;
    details?: Record<string, unknown>;
}

const VehicleSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: VEHICLE_TYPES, required: true },
    vehicleModel: { type: String, required: true },
    regNumber: { type: String, required: true, uppercase: true, trim: true },
    boardType: { type: String, enum: BOARD_TYPES, default: 'Own Board' },
    details: { type: Schema.Types.Mixed },
}, { timestamps: true });

// Indexes
VehicleSchema.index({ userId: 1 });
VehicleSchema.index({ regNumber: 1 }, { unique: true });

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
