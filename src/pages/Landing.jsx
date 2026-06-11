import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Wallet, CheckCircle2, LayoutDashboard, Activity, Users, SplitSquareHorizontal } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/* ── Minimalist Grid Background ── */
const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
    <div className="w-full h-full max-w-[1400px] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.4]" />
    </div>
  </div>
);

/* ── Navbar ── */
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-border transition-all">
    <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 bg-text-primary rounded flex items-center justify-center">
          <span className="text-bg-secondary font-bold text-[10px]">SU</span>
        </div>
        <span className="text-[14px] font-semibold text-text-primary tracking-tight">SettleUP</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
          Log in
        </Link>
        <Link to="/login" className="h-8 flex items-center gap-2 px-3 rounded-md bg-text-primary text-bg-secondary text-[13px] font-medium hover:bg-black transition-colors">
          Sign up <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </nav>
);

/* ── Hero Section ── */
const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-bg-secondary shadow-sm mb-8"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
        <span className="text-[11px] font-medium text-text-secondary uppercase tracking-widest">SettleUP 2.0 is now live</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-semibold tracking-tighter text-text-primary max-w-4xl leading-[1.05]"
      >
        Financial harmony <br className="hidden md:block" />
        <span className="text-text-muted">engineered for groups.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="mt-6 text-[17px] text-text-secondary max-w-2xl leading-relaxed"
      >
        A mathematically perfected ledger to track shared expenses, calculate balances, and settle debts with zero friction. Built for precision.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="flex items-center gap-4 mt-10"
      >
        <Link to="/login" className="h-11 flex items-center justify-center gap-2 px-6 rounded-md bg-text-primary text-bg-secondary text-[14px] font-medium hover:bg-black transition-colors shadow-sm">
          Start for free <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
};

/* ── UI Preview Mockup (Linear style border-box) ── */
const Mockup = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="relative px-6 max-w-5xl mx-auto z-10 pb-24">
      <motion.div
        style={{ y }}
        className="rounded-xl border border-border bg-bg-secondary shadow-2xl overflow-hidden"
      >
        {/* Mockup Header */}
        <div className="h-12 border-b border-border flex items-center px-4 gap-4 bg-bg-primary">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border-subtle border border-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border-subtle border border-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border-subtle border border-border" />
          </div>
          <div className="h-6 flex-1 max-w-sm rounded bg-bg-secondary border border-border flex items-center px-3 mx-auto">
            <span className="text-[10px] text-text-muted">settleup.app/dashboard</span>
          </div>
        </div>
        
        {/* Mockup Content */}
        <div className="p-8 flex flex-col md:flex-row gap-8 bg-bg-secondary">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6 flex-shrink-0">
            <div>
              <div className="h-3 w-16 bg-border rounded mb-4" />
              <div className="space-y-2">
                <div className="h-8 w-full bg-bg-primary border border-border rounded flex items-center px-3 gap-2">
                  <div className="h-4 w-4 rounded-sm bg-brand-primary/20" />
                  <div className="h-2 w-20 bg-text-secondary rounded" />
                </div>
                <div className="h-8 w-full bg-bg-primary rounded flex items-center px-3 gap-2 opacity-60">
                  <div className="h-4 w-4 rounded-sm bg-border" />
                  <div className="h-2 w-24 bg-border rounded" />
                </div>
              </div>
            </div>
            <div className="p-4 rounded border border-border bg-bg-primary">
              <div className="h-2 w-12 bg-text-muted rounded mb-3" />
              <div className="flex justify-between items-center">
                <div className="h-4 w-4 rounded-full bg-success-bg" />
                <div className="h-3 w-16 bg-success rounded" />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="h-5 w-32 bg-border rounded mb-6" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 w-full rounded border border-border bg-bg-primary flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded bg-bg-secondary border border-border" />
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-text-secondary rounded" />
                    <div className="h-1.5 w-16 bg-text-muted rounded" />
                  </div>
                </div>
                <div className="h-3 w-12 bg-text-primary rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Features List ── */
const Features = () => {
  const feats = [
    { icon: SplitSquareHorizontal, title: 'Greedy simplification', desc: 'Our algorithm minimizes the total number of transactions needed to settle a group.' },
    { icon: Activity, title: 'Real-time sync', desc: 'Powered by a live database. Changes propagate instantly across all connected clients.' },
    { icon: LayoutDashboard, title: 'Precision interfaces', desc: 'No clutter. No friction. Just your data, presented with absolute clarity.' }
  ];

  return (
    <section className="py-24 border-t border-border bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {feats.map((f, i) => (
          <div key={i}>
            <div className="h-10 w-10 rounded border border-border bg-bg-secondary flex items-center justify-center mb-5 shadow-sm">
              <f.icon size={18} className="text-text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold text-text-primary mb-2">{f.title}</h3>
            <p className="text-[14px] text-text-secondary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── Main Landing Page ── */
const Landing = () => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-bg-primary selection:bg-brand-secondary selection:text-brand-primary">
      <GridBackground />
      <Navbar />
      <Hero />
      <Mockup />
      <Features />
      
      {/* Footer CTA */}
      <footer className="border-t border-border bg-bg-secondary py-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-text-primary rounded flex items-center justify-center">
              <span className="text-bg-secondary font-bold text-[10px]">SU</span>
            </div>
            <span className="text-[14px] font-semibold text-text-primary tracking-tight">SettleUP</span>
          </div>
          <div className="text-[13px] text-text-secondary">
            Engineered for precision.
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium text-text-secondary">
            <Link to="/login" className="hover:text-text-primary transition-colors">Log in</Link>
            <Link to="/login" className="hover:text-text-primary transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
