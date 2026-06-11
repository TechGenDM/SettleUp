import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 selection:bg-brand-secondary selection:text-brand-primary">
      <div className="w-full max-w-[400px] text-center">
        {/* ── Logo ── */}
        <div className="mx-auto h-12 w-12 bg-bg-secondary border border-border rounded-lg flex items-center justify-center mb-6 shadow-sm">
          <AlertCircle size={24} className="text-text-muted" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl font-semibold text-text-primary tracking-tight mb-3">
          404
        </h1>
        <p className="text-[15px] text-text-secondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <CustomButton variant="secondary" icon={ArrowLeft}>
              Go back home
            </CustomButton>
          </Link>
        </div>
      </div>
      
      {/* ── Minimalist Grid Background ── */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden flex justify-center">
        <div className="w-full h-full max-w-[1400px] relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.3]" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
