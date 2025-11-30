import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
    userId: mongoose.Types.ObjectId;
    type: string;
    vehicleModel: string;
    regNumber: string;
    boardType?: string; // 'Own Board' | 'T Board'
    details?: any;
}

const VehicleSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    regNumber: { type: String, required: true },
    boardType: { type: String, default: 'Own Board' },
    details: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
