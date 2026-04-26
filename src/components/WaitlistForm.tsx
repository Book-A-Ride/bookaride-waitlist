'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ChevronRight, Loader2, CheckCircle2, Share2, Copy, GraduationCap, Car, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Enter a valid Nigerian phone number'),
    role: z.enum(['student', 'driver']),
    location: z.string().min(2, 'Please specify your location'),
});

type FormValues = z.infer<typeof formSchema>;

type Step = 'role' | 'details';

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function WaitlistForm() {
    const [step, setStep] = useState<Step>('role');
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState<{ referralCode: string; name: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        trigger,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { role: 'student' },
        mode: 'onTouched',
    });

    const selectedRole = watch('role');

    const selectRole = (r: 'student' | 'driver') => {
        setValue('role', r);
        setTimeout(() => {
            setDirection(1);
            setStep('details');
        }, 180);
    };

    const goBack = () => {
        setDirection(-1);
        setStep('role');
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const referredBy = urlParams.get('ref');
            const response = await axios.post('/api/waitlist', { ...data, referredBy });
            if (response.data.success) {
                setSuccess(true);
                setUserData({ referralCode: response.data.user.referralCode, name: data.name });
                toast.success('You\'re on the waitlist! 🚀');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const referralUrl = userData
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${userData.referralCode}`
        : '';

    const copyReferral = async () => {
        await navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopied(false), 2500);
    };

    const shareReferral = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Book A Ride Waitlist',
                text: 'Join the waitlist for Book A Ride at BOUESTI — rides powered by students!',
                url: referralUrl,
            });
        } else {
            copyReferral();
        }
    };

    // ── Success screen ──────────────────────────────────────────
    if (success && userData) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-4"
            >
                {/* Check icon */}
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 check-bounce shadow-xl shadow-green-500/25">
                    <CheckCircle2 className="text-white w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black mb-2 text-slate-900">
                    You&apos;re in, {userData.name}! 🚀
                </h3>
                <p className="text-slate-500 mb-8 text-sm max-w-xs mx-auto">
                    We&apos;ll notify you the moment Book A Ride launches at BOUESTI. Move up the list by sharing!
                </p>

                {/* Referral box */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-5 text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your referral link</p>
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={typeof window !== 'undefined' ? `${window.location.host}?ref=${userData.referralCode}` : ''}
                            className="bg-transparent border-none focus:ring-0 text-sm font-mono w-full text-primary outline-none min-w-0 truncate"
                        />
                        <button
                            onClick={copyReferral}
                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                ${copied ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button onClick={shareReferral} className="btn-primary w-full text-base py-3.5">
                    <Share2 className="w-4 h-4" />
                    Invite Friends · Climb the list
                </button>

                <p className="text-xs text-slate-400 mt-4">
                    Each friend you invite moves you up the priority list.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="relative">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {(['role', 'details'] as Step[]).map((s, i) => (
                    <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-primary' : i < ['role', 'details'].indexOf(step) ? 'w-4 bg-[#93C5FD]' : 'w-4 bg-slate-200'
                            }`}
                    />
                ))}
            </div>

            {/* motion.div with layout animates height automatically when step changes */}
            <motion.div layout transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    {/* ── STEP 1 : Role Selection ── */}
                    {step === 'role' && (
                        <motion.div
                            key="role"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
                                Who are you?
                            </p>
                            <div className="flex gap-4">
                                {/* Student card */}
                                <button
                                    type="button"
                                    onClick={() => selectRole('student')}
                                    className={`flex-1 flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border-2 cursor-pointer text-center font-semibold text-sm transition-all duration-200 
                                  ${selectedRole === 'student'
                                            ? 'border-primary bg-blue-50 text-primary shadow-[0_0_0_4px_rgba(37,99,235,0.1),0_4px_16px_rgba(37,99,235,0.12)]'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-primary hover:-translate-y-0.5 hover:shadow-md'
                                        }`}
                                >
                                    <span className="text-4xl leading-none">🚶‍♂️</span>
                                    <span className="text-base font-bold">Student</span>
                                    <span className="text-xs text-slate-400 font-medium">I need rides</span>
                                </button>

                                {/* Driver card */}
                                <button
                                    type="button"
                                    onClick={() => selectRole('driver')}
                                    className={`flex-1 flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border-2 cursor-pointer text-center font-semibold text-sm transition-all duration-200 
                                  ${selectedRole === 'driver'
                                            ? 'border-primary bg-blue-50 text-primary shadow-[0_0_0_4px_rgba(37,99,235,0.1),0_4px_16px_rgba(37,99,235,0.12)]'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-primary hover:-translate-y-0.5 hover:shadow-md'
                                        }`}
                                >
                                    <span className="text-4xl leading-none">🚗</span>
                                    <span className="text-base font-bold">Driver</span>
                                    <span className="text-xs text-slate-400 font-medium">I give rides</span>
                                </button>
                            </div>
                            <input type="hidden" {...register('role')} />
                        </motion.div>
                    )}

                    {/* ── STEP 2 : Details ── */}
                    {step === 'details' && (
                        <motion.div
                            key="details"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-5"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Change role
                            </button>

                            {/* Role indicator */}
                            <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 w-fit">
                                {selectedRole === 'student'
                                    ? <GraduationCap className="w-4 h-4 text-primary" />
                                    : <Car className="w-4 h-4 text-primary" />}
                                <span className="text-sm font-bold text-primary capitalize">
                                    {selectedRole}
                                </span>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <input type="hidden" {...register('role')} />

                                {/* Name */}
                                <div className="relative ">
                                    <input
                                        {...register('name')}
                                        placeholder="Full Name"
                                        className={`input-field ${errors.name ? 'error' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Email Address"
                                        className={`input-field ${errors.email ? 'error' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="Phone Number (e.g. 08012345678)"
                                        className={`input-field ${errors.phone ? 'error' : ''}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <input
                                        {...register('location')}
                                        placeholder="Where do you live in Ikere?"
                                        className={`input-field ${errors.location ? 'error' : ''}`}
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {errors.location.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full text-base py-4 mt-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Get Early Access
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-slate-400 pt-1">
                                    No spam. We respect your privacy.
                                </p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
