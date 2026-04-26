import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const drivers = await User.countDocuments({ role: 'driver' });

        // Sort logic for top referrers
        const topReferrers = await User.find({ referralsCount: { $gt: 0 } })
            .sort({ referralsCount: -1 })
            .limit(5)
            .select('name email referralsCount');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(50);

        const totalReferrals = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$referralsCount" } } }
        ]);

        return NextResponse.json({
            totalUsers,
            students,
            drivers,
            topReferrers,
            users: recentUsers,
            totalReferrals: totalReferrals[0]?.total || 0
        });
    } catch (error: any) {
        console.error('Detailed Stats Error:', error?.message || error);
        // If DB is not configured or connection fails, return empty data
        return NextResponse.json({
            totalUsers: 0,
            students: 0,
            drivers: 0,
            topReferrers: [],
            users: [],
            totalReferrals: 0
        }, { status: 200 });
    }
}
