import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    phone: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiry: { type: Date },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
