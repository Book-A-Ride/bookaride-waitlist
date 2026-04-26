'use client';

import { useEffect, useRef, useState } from 'react';
import WaitlistForm from '@/components/WaitlistForm';
import StatsCounter from '@/components/StatsCounter';
import { Zap, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── Bottom CTA (extracted to satisfy rules of hooks) ──────────
function BottomCTA() {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <div ref={ref as any} className="reveal container mx-auto max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Limited spots · Join now
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
        Ready to stop trekking?
      </h2>
      <p className="text-slate-500 mb-8 text-lg">
        Join 1,284+ students already waiting for BOUESTI&apos;s first ride-sharing service.
      </p>
      <a
        href="#waitlist"
        className="btn-primary text-lg px-8 py-4 inline-flex"
        style={{ borderRadius: '16px' }}
      >
        Get Early Access
        <ArrowRight className="w-5 h-5 ml-2" />
      </a>
    </div>
  );
}

// ── How It Works heading ──────────────────────────────────────
function HowItWorksHeading() {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <div ref={ref as any} className="reveal text-center mb-14">
      <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">The Process</span>
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900">How it works</h2>
      <p className="text-slate-500 mt-3 max-w-md mx-auto text-base">
        Three simple steps. That&apos;s all it takes to move around BOUESTI.
      </p>
    </div>
  );
}

// ── Hook: scroll-reveal via IntersectionObserver ──────────────
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('in-view'); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Kinetic headline ──────────────────────────────────────────
function KineticHeadline() {
  const words1 = ['Stop', 'trekking', 'across', 'BOUESTI.'];
  const words2 = ['Get', 'a', 'ride', 'in', 'minutes.'];

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 mb-6">
      <span className="block">
        {words1.map((word, i) => (
          <span
            key={i}
            className="kinetic-word inline-block mr-[0.22em]"
            style={{ animationDelay: `${0.08 + i * 0.07}s`, animationFillMode: 'forwards' }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="block text-primary">
        {words2.map((word, i) => (
          <span
            key={i}
            className="kinetic-word inline-block mr-[0.22em]"
            style={{ animationDelay: `${0.4 + i * 0.07}s`, animationFillMode: 'forwards' }}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
}

// ── Phone mock ────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative w-full max-w-[280px] mx-auto select-none">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-[42px] bg-primary/15 blur-2xl scale-90 -z-10" />
      {/* Phone frame */}
      <div className="relative rounded-[42px] bg-white border-2 border-slate-200 shadow-2xl shadow-slate-900/15 overflow-hidden aspect-9/18">
        {/* Status bar */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between bg-white border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 rounded-sm bg-slate-900 opacity-60" />
            <div className="w-0.5 h-1.5 rounded-sm bg-slate-900 opacity-40" />
          </div>
        </div>

        {/* App UI mockup */}
        <div className="p-4 flex flex-col gap-4 bg-slate-50 h-full">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-black">BR</span>
            </div>
            <span className="text-sm font-black text-slate-900">Book A Ride</span>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-[#DBEAFE] h-28 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="absolute border border-primary/30" style={{
                  left: `${i * 30}%`, top: 0, bottom: 0, width: 1
                }} />
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute border border-primary/30" style={{
                  top: `${i * 20}%`, left: 0, right: 0, height: 1
                }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-primary text-xs font-bold">Ikere-Ekiti</span>
            </div>
          </div>

          {/* Ride options */}
          {['Campus → Town', 'Town → Campus'].map((route, i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i === 0 ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                {i === 0 ? '🎓' : '🏠'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{route}</p>
                <p className="text-xs text-slate-400">₦150 · 5 min away</p>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg ${i === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                {i === 0 ? 'Book' : 'Soon'}
              </div>
            </div>
          ))}

          {/* CTA pill */}
          <div className="mt-auto">
            <div className="w-full py-3 rounded-xl bg-primary text-white text-center text-xs font-bold shadow-lg shadow-blue-500/30">
              Request Ride
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-4 top-16 bg-white border border-slate-100 shadow-lg rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Driver nearby!
      </motion.div>

      {/* Bottom badge */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -left-4 bottom-20 bg-secondary shadow-lg rounded-2xl px-3 py-2 text-xs font-black text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
      >
        ⚡ ₦150 flat fare
      </motion.div>
    </div>
  );
}

// ── Sticky mobile CTA ─────────────────────────────────────────
function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sticky-cta lg:hidden ${visible ? 'visible' : ''}`}>
      <a
        href="#waitlist"
        className="btn-primary w-full text-base py-3.5 flex items-center justify-center"
        style={{ borderRadius: '14px' }}
      >
        Get Early Access
        <ArrowRight className="w-5 h-5 ml-2" />
      </a>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, delay }: {
  icon: React.ElementType; title: string; desc: string; delay: number;
}) {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <div
      ref={ref as any}
      className="reveal text-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="icon-ring text-primary mx-auto mb-5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Step card ─────────────────────────────────────────────────
function StepCard({ step, title, desc, delay }: {
  step: string; title: string; desc: string; delay: number;
}) {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <div
      ref={ref as any}
      className="reveal step-card"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="icon-ring mb-4">
        <span className="text-primary font-black text-xl">{step}</span>
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}


// ── Main Page ─────────────────────────────────────────────────
export default function Home() {
  const featuresRef = useReveal() as React.RefObject<HTMLElement>;
  const { scrollY } = useScroll();
  // Subtle parallax for phone mockup on desktop
  const phoneY = useTransform(scrollY, [0, 600], [0, -40]);

  return (
    <>
      <main className="min-h-screen bg-white relative overflow-x-hidden">

        {/* ── Animated gradient blobs ── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="blob blob-blue w-[560px] h-[560px] top-[-15%] left-[-10%] opacity-70" />
          <div className="blob blob-yellow w-[420px] h-[420px] bottom-[10%] right-[-8%] opacity-60" />
          <div className="blob blob-blue2 w-[380px] h-[380px] top-[45%] left-[55%] opacity-50" />
        </div>

        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section className="container mx-auto max-w-6xl px-5 sm:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — copy + form */}
            <div className="max-w-xl mx-auto lg:mx-0 w-full">
              {/* Context badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-amber-700 text-xs font-bold uppercase tracking-wider mb-7 badge-pulse"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                🎓 Launching first at BOUESTI
              </motion.div>

              {/* Kinetic headline */}
              <KineticHeadline />

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="text-slate-500 text-lg mb-8 leading-relaxed"
              >
                Book trusted rides from students and local drivers in{' '}
                <span className="font-semibold text-slate-700">Ikere-Ekiti</span>{' '}
                — no stress, no long walks.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mb-8"
              >
                <StatsCounter />
              </motion.div>

              {/* Form card */}
              <motion.div
                id="waitlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-[28px] p-7 sm:p-8 shadow-xl shadow-slate-900/8 border border-white/70"
              >
                <WaitlistForm />
              </motion.div>
            </div>

            {/* RIGHT — phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: phoneY }}
              className="hidden lg:flex items-center justify-center"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FEATURES SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          ref={featuresRef as any}
          className="reveal container mx-auto max-w-5xl px-5 sm:px-8 py-20 border-t border-slate-100"
        >
          <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
            <FeatureCard
              icon={Zap}
              title="Reliable Rides"
              desc="No more waiting hours. Get matched with a verified driver nearby in minutes."
              delay={0}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Verified Drivers"
              desc="All drivers are BOUESTI students or trusted Ikere-Ekiti locals. Always vetted."
              delay={100}
            />
            <FeatureCard
              icon={MapPin}
              title="Student Pricing"
              desc="Transparent, fair pricing designed for the student budget. No surge pricing."
              delay={200}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════════════ */}
        <section className="bg-slate-50 py-24 px-5 sm:px-8">
          <div className="container mx-auto max-w-5xl">
            <HowItWorksHeading />

            {/* Steps — relative line connector on desktop */}
            <div className="grid sm:grid-cols-3 gap-6 relative">
              {/* Connector line */}
              <div className="absolute top-[36px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-linear-to-r from-slate-200 via-primary/30 to-slate-200 hidden sm:block" />

              <StepCard step="01" title="Request a ride" desc="Choose your destination and tap to request. It takes under 10 seconds." delay={0} />
              <StepCard step="02" title="Get matched" desc="We pair you with the nearest verified driver on campus or nearby." delay={120} />
              <StepCard step="03" title="Move easily" desc="Arrive safely. Pay a fair price. No stress, no trekking." delay={240} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BOTTOM CTA BAND
        ═══════════════════════════════════════════════════════ */}
        <section className="py-20 px-5 sm:px-8 text-center">
          <BottomCTA />
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-100 py-10 px-5 sm:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-black">BR</span>
            </div>
            <span className="text-base font-black text-slate-900">Book A Ride</span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2026 Book A Ride · Moving BOUESTI forward.
          </p>
        </footer>

      </main>

      {/* Sticky mobile CTA */}
      <StickyCTA />
    </>
  );
}
