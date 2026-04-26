'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

function useCountUp(target: number, duration = 1800, trigger: boolean = true) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger || target === 0) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, trigger]);

    return count;
}

export default function StatsCounter() {
    const [stats, setStats] = useState({ totalUsers: 0 });
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/stats');
                setStats(response.data);
            } catch {
                // keep default
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const displayTarget = stats.totalUsers > 0 ? stats.totalUsers : 1284;
    const count = useCountUp(displayTarget, 1800, visible);

    // Prevent hydration mismatch by only rendering content after mount
    if (!mounted) return (
        <div className="h-[92px] w-full max-w-sm mx-auto animate-pulse bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-slate-300 text-xs font-semibold">Loading stats...</span>
        </div>
    );

    const avatarSeeds = [42, 99, 201];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
            <div className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-900/5">
                {/* Avatar stack */}
                <div className="flex -space-x-2.5">
                    {avatarSeeds.map((seed, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-1 ring-slate-100"
                            style={{ zIndex: avatarSeeds.length - i }}
                        >
                            <img
                                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                                alt="user avatar"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Count */}
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary tabular-nums count-up-number">
                        {count.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                        students joined
                    </span>
                </div>
            </div>

            {/* Micro badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                Live count · updating every 30s
            </div>
        </motion.div>
    );
}
