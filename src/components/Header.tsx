'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
    const lastY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 40);
            setScrollDir(y > lastY.current ? 'down' : 'up');
            lastY.current = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-header shadow-sm py-3' : 'bg-transparent py-5'
                } ${scrollDir === 'down' && scrolled ? '-translate-y-full' : 'translate-y-0'}`}
        >
            <div className="container mx-auto px-5 sm:px-8 flex items-center justify-between max-w-6xl">
                {/* Logo + Brand */}
                <div className="flex items-center gap-2.5">
                    <img src="./logo.png" alt="bookaride logo" className='w-15 h-5' />
                    <span className="text-lg font-black tracking-tight text-slate-900">
                        Book A Ride
                    </span>
                </div>

                {/* CTA pill */}
                <a
                    href="#waitlist"
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-bold 
                     shadow-md shadow-blue-500/20 hover:bg-primary-dark hover:scale-[1.03] transition-all duration-200"
                >
                    Join Waitlist
                </a>
            </div>
        </motion.header>
    );
}
