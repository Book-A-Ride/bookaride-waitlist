import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    phone: string;
    role: 'student' | 'driver';
    location: string;
    referralCode: string;
    referredBy: string | null;
    referralsCount: number;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['student', 'driver'], required: true },
    location: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: String, default: null },
    referralsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
