import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const drivers = await User.countDocuments({ role: 'driver' });

        // Artificial boost for social proof if needed, but per prompt we should show real or reasonable data
        // Here we just return real data
        return NextResponse.json({
            totalUsers,
            students,
            drivers,
        });
    } catch (error: any) {
        console.error('Stats API Error:', error?.message || error);
        // If DB is not configured or connection fails, return 0 as requested
        return NextResponse.json({
            totalUsers: 0,
            students: 0,
            drivers: 0,
        }, { status: 200 });
    }
}
