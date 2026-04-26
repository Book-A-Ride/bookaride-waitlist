import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateReferralCode } from '@/lib/referral';
import axios from 'axios';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const limitCheck = rateLimit(ip);

        if (!limitCheck.success) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const { name, email, phone, role, location, referredBy } = await req.json();

        if (!name || !email || !phone || !role || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const referralCode = generateReferralCode();

        const newUser = new User({
            name,
            email,
            phone,
            role,
            location,
            referralCode,
            referredBy: referredBy || null,
        });

        await newUser.save();

        // If referredBy exists, increment referrer's count
        if (referredBy) {
            await User.findOneAndUpdate(
                { referralCode: referredBy },
                { $inc: { referralsCount: 1 } }
            );
        }

        // ConvertKit Integration (Optional/Conditional)
        if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
            try {
                await axios.post(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
                    api_key: process.env.CONVERTKIT_API_KEY,
                    email: email,
                    first_name: name,
                    tags: [role], // Tag as 'student' or 'driver'
                });
            } catch (ckError) {
                console.error('ConvertKit subscription error:', ckError);
                // Don't fail the whole request if email sync fails
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email,
                referralCode: newUser.referralCode,
            },
        });
    } catch (error: any) {
        console.error('Waitlist API Error:', error.message);
        return NextResponse.json({
            error: error.message.includes('MONGODB_URI') ? 'Database not configured' : 'Internal Server Error'
        }, { status: 500 });
    }
}
